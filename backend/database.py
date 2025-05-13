"""This module is used to connect to the MongoDB database """

import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client["HabitTracker"]
users_collection = db["UsersCollection"]
habits_collection = db["HabitsCollection"]
logs_collection = db["HabitsLogCollections"]
