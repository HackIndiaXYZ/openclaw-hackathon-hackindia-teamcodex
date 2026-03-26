import json
import os

try:
    import face_recognition
except ImportError:
    face_recognition = None

from app.config import FACE_MATCH_TOLERANCE, KNOWN_FACES_DIR
from app.face_utils import (
    detect_faces_with_opencv,
    extract_face_encodings,
    is_face_recognition_available,
    preprocess_classroom_image
)

ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png']



def build_possible_file_names(student):
    """
    Build possible image file names for a student.

    We try multiple patterns so the system stays flexible while you are learning.
    """
    possible_names = []

    if student.get('faceLabel'):
        possible_names.append(student['faceLabel'])

    if student.get('studentId'):
        possible_names.append(student['studentId'])

    if student.get('name'):
        possible_names.append(student['name'].strip().lower().replace(' ', '_'))

    return possible_names



def find_known_face_file(student):
    """
    Search the known_faces folder for a student image.
    """
    for base_name in build_possible_file_names(student):
        for extension in ALLOWED_EXTENSIONS:
            file_path = os.path.join(KNOWN_FACES_DIR, f'{base_name}{extension}')
            if os.path.exists(file_path):
                return file_path

    return None



def load_known_face_encodings(roster):
    """
    Load face encodings for all students sent by the backend/frontend.

    The roster tells us which students belong to the class.
    """
    if not is_face_recognition_available():
        return [], []

    known_faces = []
    missing_faces = []

    for student in roster:
        file_path = find_known_face_file(student)

        if not file_path:
            missing_faces.append(student.get('name', 'Unknown Student'))
            continue

        known_image = face_recognition.load_image_file(file_path)
        known_encodings = face_recognition.face_encodings(known_image)

        if not known_encodings:
            missing_faces.append(student.get('name', 'Unknown Student'))
            continue

        known_faces.append({
            'studentId': student.get('studentId'),
            'name': student.get('name'),
            'encoding': known_encodings[0],
            'filePath': file_path
        })

    return known_faces, missing_faces



def match_face_encoding(face_encoding, known_faces):
    """
    Compare one detected face against all known student faces.
    """
    if not known_faces or not is_face_recognition_available():
        return None

    known_encodings = [item['encoding'] for item in known_faces]
    distances = face_recognition.face_distance(known_encodings, face_encoding)

    if len(distances) == 0:
        return None

    best_match_index = distances.argmin()
    best_distance = float(distances[best_match_index])

    if best_distance > FACE_MATCH_TOLERANCE:
        return None

    best_match = known_faces[best_match_index]
    confidence = round((1 - best_distance) * 100, 2)

    return {
        'studentId': best_match['studentId'],
        'name': best_match['name'],
        'confidence': confidence,
        'matchedFile': best_match['filePath']
    }



def recognize_attendance(image_bytes, roster):
    """
    Main classroom recognition flow.

    Steps:
    1. Prepare uploaded image
    2. Detect faces in classroom
    3. Create encodings for classroom faces
    4. Load known student encodings
    5. Match classroom faces against known faces

    If face_recognition is not available, we still return face detection counts.
    """
    _, rgb_image = preprocess_classroom_image(image_bytes)
    opencv_detections = detect_faces_with_opencv(rgb_image)
    face_locations, classroom_encodings = extract_face_encodings(rgb_image)

    detected_faces_count = max(len(opencv_detections), len(face_locations))

    if not is_face_recognition_available():
        return {
            'success': True,
            'mode': 'detection_only',
            'detectedFacesCount': detected_faces_count,
            'recognizedFacesCount': 0,
            'unknownFacesCount': detected_faces_count,
            'matchedStudents': [],
            'missingKnownFaces': [],
            'warning': 'face_recognition/dlib is not installed correctly. OpenCV face detection is working, but face matching is disabled until CMake and dlib are installed.'
        }

    known_faces, missing_faces = load_known_face_encodings(roster)
    matched_students = []
    matched_student_ids = set()

    for classroom_encoding in classroom_encodings:
        match_result = match_face_encoding(classroom_encoding, known_faces)

        if not match_result:
            continue

        if match_result['studentId'] in matched_student_ids:
            continue

        matched_students.append(match_result)
        matched_student_ids.add(match_result['studentId'])

    unknown_faces_count = max(detected_faces_count - len(matched_students), 0)

    return {
        'success': True,
        'mode': 'full_recognition',
        'detectedFacesCount': detected_faces_count,
        'recognizedFacesCount': len(matched_students),
        'unknownFacesCount': unknown_faces_count,
        'matchedStudents': matched_students,
        'missingKnownFaces': missing_faces
    }



def parse_roster_json(raw_roster):
    """
    Convert the roster string from multipart form-data into Python objects.
    """
    if not raw_roster:
        return []

    try:
        parsed_roster = json.loads(raw_roster)
        return parsed_roster if isinstance(parsed_roster, list) else []
    except json.JSONDecodeError:
        return []
