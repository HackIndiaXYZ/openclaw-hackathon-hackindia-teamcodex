import os
from dotenv import load_dotenv

# This loads values from the .env file into the Python process.
load_dotenv()

# These settings are kept in one file so they are easy to change later.
FASTAPI_PORT = int(os.getenv("FASTAPI_PORT", "8000"))
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/smartcolladmsys")
KNOWN_FACES_DIR = os.getenv("KNOWN_FACES_DIR", "known_faces")
FACE_MATCH_TOLERANCE = float(os.getenv("FACE_MATCH_TOLERANCE", "0.5"))
MAX_IMAGE_WIDTH = int(os.getenv("MAX_IMAGE_WIDTH", "1280"))
