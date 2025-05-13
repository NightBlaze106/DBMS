"""This module contains the Pydantic models for the application."""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str
    password: str

class Habit(BaseModel):
    user_id: str  # Required field to link habits to a user
    name: str
    streak: int = 0
    last_updated: Optional[datetime] = None
    completion_dates: list[datetime] = []  # Explicitly store completion dates


class HabitLog(BaseModel):
    habit_id: str
    date: str
    status: str  # "done" or "not done"
