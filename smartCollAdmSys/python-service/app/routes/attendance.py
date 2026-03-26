from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from app.services.face_recognition_service import parse_roster_json, recognize_attendance

router = APIRouter(prefix='/api/attendance', tags=['attendance'])


@router.post('/recognize')
async def recognize_attendance_from_image(
    image: UploadFile = File(...),
    roster: str = Form(default='[]')
):
    """
    Recognize faces from an uploaded classroom image.

    Parameters:
    - image: classroom photo file
    - roster: JSON string list of students in the class
    """
    if not image.content_type or not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail='Please upload a valid image file')

    image_bytes = await image.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail='Uploaded image is empty')

    parsed_roster = parse_roster_json(roster)
    result = recognize_attendance(image_bytes=image_bytes, roster=parsed_roster)
    return result
