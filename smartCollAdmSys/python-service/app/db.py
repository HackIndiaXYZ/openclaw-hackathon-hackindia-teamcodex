from pymongo import MongoClient
from app.config import MONGO_URI

# We create a small helper function so database access can be reused later.
def get_database():
    client = MongoClient(MONGO_URI)
    return client["smartcolladmsys"]
