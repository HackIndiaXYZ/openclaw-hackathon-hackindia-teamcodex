from fastapi import FastAPI
from app.config import FASTAPI_PORT
from app.face_utils import preprocess_classroom_image
from app.routes.attendance import router as attendance_router

# This creates the FastAPI application object.
app = FastAPI(
    title='Smart College Admin Python Service',
    description='FastAPI service for attendance image processing and face recognition',
    version='1.0.0'
)

# We keep attendance routes in a separate file so the project stays modular.
app.include_router(attendance_router)


@app.get('/')
def root():
    # This route confirms the Python service is working.
    return {
        'success': True,
        'message': 'Python service is running',
        'port': FASTAPI_PORT
    }


@app.get('/api/health')
def health_check():
    # This route is helpful for quick service checks.
    return {
        'success': True,
        'message': 'Python API health is good'
    }


@app.get('/api/face-service-info')
def face_service_info():
    # This route explains what the service is responsible for.
    return {
        'success': True,
        'message': 'This service detects faces from a classroom image and matches them with known student face images.'
    }
