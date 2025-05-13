from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import users_collection
from auth_utils import hash_password, verify_password, create_access_token
from datetime import timedelta

router = APIRouter()

class UserLogin(BaseModel):
    email: str
    password: str

class UserSignup(UserLogin):
    username: str

@router.post("/signup")
def signup(user: UserSignup):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    users_collection.insert_one({
        "email": user.email,
        "username": user.username,
        "password": hash_password(user.password)
    })

    return {"message": "User created"}

@router.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        data={"email": user.email, "user_id": str(db_user["_id"])},
        expires_delta=timedelta(minutes=60)
    )
    return {"access_token": token, "token_type": "bearer"}
