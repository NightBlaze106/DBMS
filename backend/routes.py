"""This module defines the routes for the FastAPI application."""
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, HTTPException, Depends
from models import Habit, HabitLog
from database import habits_collection, users_collection, logs_collection
from bson import ObjectId
from auth_utils import get_current_user

router = APIRouter()

# Create a habit
@router.post("/habits/")
async def create_habit(habit: Habit, user_data=Depends(get_current_user)):
    user_id = user_data["user_id"]
    habit.user_id = user_id
    
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    habit_dict = habit.dict()
    habit_dict["last_updated"] = datetime.now(timezone.utc)
    habit_dict["completion_dates"] = []
    result = habits_collection.insert_one(habit_dict)
    return {"id": str(result.inserted_id)}

# Get all habits
@router.get("/habits/")
async def get_habits(user_data=Depends(get_current_user)):
    user_id = user_data["user_id"]
    habits = list(habits_collection.find({"user_id": user_id}))
    
    for habit in habits:
        habit["_id"] = str(habit["_id"])
        if "completion_dates" in habit:
            habit["completion_dates"] = [date.strftime("%Y-%m-%d") for date in habit["completion_dates"]]
    return habits

@router.put("/habits/{habit_id}/done")
async def mark_habit_done(habit_id: str, user_data=Depends(get_current_user)):
    user_id = user_data["user_id"]
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    habit = habits_collection.find_one({
        "_id": ObjectId(habit_id), 
        "user_id": user_id
    })
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    completion_dates = habit.get("completion_dates", [])
    if completion_dates and completion_dates[-1].date() == today.date():
        raise HTTPException(status_code=400, detail="Habit already completed today")

    # Calculate streak
    streak = habit.get("streak", 0)
    if completion_dates:
        last_completion = completion_dates[-1]
        yesterday = today - timedelta(days=1)
        
        # Convert to date objects for comparison
        last_completion_date = last_completion.date()
        yesterday_date = yesterday.date()
        
        # If the last completion was yesterday, increment streak
        if last_completion_date == yesterday_date:
            streak += 1
        # If the last completion was before yesterday, reset streak
        elif last_completion_date < yesterday_date:
            streak = 1
    else:
        # First completion
        streak = 1

    # Add today's completion
    completion_dates.append(today)
    
    # Update the habit in the database
    update_result = habits_collection.update_one(
        {"_id": ObjectId(habit_id)},
        {
            "$set": {
                "completion_dates": completion_dates,
                "last_updated": today,
                "streak": streak
            }
        }
    )
    
    if update_result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update habit")
        
    return {"message": "Habit marked as done", "streak": streak}

@router.put("/habits/{habit_id}")
async def update_habit(habit_id: str, habit_update: dict, user_data=Depends(get_current_user)):
    user_id = user_data["user_id"]
    
    habit = habits_collection.find_one({
        "_id": ObjectId(habit_id),
        "user_id": user_id
    })
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    update_data = {}
    if "name" in habit_update:
        update_data["name"] = habit_update["name"]

    if update_data:
        result = habits_collection.update_one(
            {"_id": ObjectId(habit_id)},
            {"$set": update_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update habit")

    return {"message": "Habit updated successfully"}

# Delete a habit
@router.delete("/habits/{habit_id}")
async def delete_habit(habit_id: str, user_data=Depends(get_current_user)):
    user_id = user_data["user_id"]
    result = habits_collection.delete_one({
        "_id": ObjectId(habit_id),
        "user_id": user_id
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Habit not found")
    return {"message": "Habit deleted successfully"}

