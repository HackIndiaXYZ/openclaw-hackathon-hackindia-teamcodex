import cv2
import numpy as np

try:
    import face_recognition
except ImportError:
    face_recognition = None

from app.config import MAX_IMAGE_WIDTH

# OpenCV ships with a ready-to-use Haar Cascade file for face detection.
FACE_CASCADE = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)


def is_face_recognition_available():
    """
    Tell the rest of the app whether the face_recognition library is usable.
    """
    return face_recognition is not None



def decode_image_bytes(image_bytes: bytes):
    """
    Convert raw uploaded bytes into an OpenCV image array.

    Why this is needed:
    FastAPI gives us raw file bytes, but OpenCV works with numpy arrays.
    """
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError('Unable to decode uploaded image')

    return image



def resize_image_if_needed(image):
    """
    Reduce image width if the uploaded file is very large.

    Smaller images are faster to process and still work well for demo use.
    """
    height, width = image.shape[:2]

    if width <= MAX_IMAGE_WIDTH:
        return image

    scale_ratio = MAX_IMAGE_WIDTH / width
    resized_width = int(width * scale_ratio)
    resized_height = int(height * scale_ratio)

    return cv2.resize(image, (resized_width, resized_height))



def convert_bgr_to_rgb(image):
    """
    OpenCV reads images in BGR format.
    face_recognition expects RGB format.
    """
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)



def preprocess_classroom_image(image_bytes: bytes):
    """
    Full image preparation flow used before face recognition.
    """
    image = decode_image_bytes(image_bytes)
    image = resize_image_if_needed(image)
    rgb_image = convert_bgr_to_rgb(image)
    return image, rgb_image



def detect_faces_with_opencv(rgb_image):
    """
    Detect faces using OpenCV Haar Cascade.

    We use this mainly to report how many faces were seen in the classroom image.
    """
    gray_image = cv2.cvtColor(rgb_image, cv2.COLOR_RGB2GRAY)
    detections = FACE_CASCADE.detectMultiScale(
        gray_image,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(60, 60)
    )
    return detections



def extract_face_encodings(rgb_image):
    """
    Detect face locations and generate encodings for each face.

    If the face_recognition library is not installed correctly,
    we return empty encodings so the service can still run in detection-only mode.
    """
    if not is_face_recognition_available():
        return [], []

    face_locations = face_recognition.face_locations(rgb_image)
    face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
    return face_locations, face_encodings
