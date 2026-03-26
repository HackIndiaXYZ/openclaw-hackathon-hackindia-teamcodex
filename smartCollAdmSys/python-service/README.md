# Python Service Documentation

This folder contains the `FastAPI + OpenCV + face_recognition` service used for image-based attendance.

The goal of this document is not only to explain how to run the service, but also to help you understand what each file is doing in beginner-friendly language.

---

## 1. What This Python Service Does

This service takes a classroom image and tries to answer this question:

`Which students in this classroom photo are recognized from our known student face images?`

It works in this order:

1. Frontend uploads a classroom image to the backend.
2. Backend forwards that image to this Python service.
3. Python service prepares the image.
4. OpenCV detects faces in the classroom image.
5. `face_recognition` creates face encodings when available.
6. The service loads known student face images from the `known_faces` folder.
7. It compares classroom faces with known student faces.
8. It returns the matched students to the backend.
9. Backend can save those students as `present` attendance records.

---

## 2. Current Modes

Right now the Python service supports two modes:

### `full_recognition`
This happens when `face_recognition + dlib` are installed correctly.

In this mode, the service can:
- detect faces
- encode faces
- compare classroom faces with known student face images
- return matched students

### `detection_only`
This happens when `face_recognition` is not available or `dlib` could not be installed.

In this mode, the service can still:
- detect faces with OpenCV
- tell you how many faces were found

But it cannot:
- match faces to student names

This fallback was added so the Python API can still run and be learned even before the full face-matching setup is complete.

---

## 3. Folder Structure

```text
python-service/
├── .env
├── requirements.txt
├── README.md
├── known_faces/
└── app/
    ├── __init__.py
    ├── config.py
    ├── db.py
    ├── face_utils.py
    ├── main.py
    ├── routes/
    │   └── attendance.py
    ├── services/
    │   └── face_recognition_service.py
    └── utils/
        └── image_preprocessing.py
```

---

## 4. File-by-File Explanation

### `app/main.py`
This is the entry point of the FastAPI application.

What it does:
- creates the FastAPI app
- loads attendance routes
- provides health check routes

You can think of this file as:
`starting point of the Python API server`

### `app/config.py`
This file stores configuration values.

Why it matters:
- keeps important settings in one place
- avoids hardcoding values all over the project

Examples:
- FastAPI port
- known faces folder path
- face match tolerance
- image resize width

### `app/face_utils.py`
This file contains low-level image helper functions.

What it does:
- converts uploaded image bytes into OpenCV image format
- resizes large images
- converts BGR to RGB
- runs OpenCV face detection
- creates face encodings using `face_recognition` when available
- safely falls back if `face_recognition` is missing

This file is important because it keeps image operations separate from business logic.

### `app/services/face_recognition_service.py`
This is the main logic file for face-based attendance.

What it does:
- reads the roster sent by backend
- searches matching face images inside `known_faces/`
- creates encodings for known student faces
- compares classroom faces with known student faces
- returns matched students, unknown count, and missing known face files
- switches to detection-only mode if full recognition is not available

This is the real brain of the Python attendance flow.

### `app/routes/attendance.py`
This file defines the attendance recognition API route.

Current route:
- `POST /api/attendance/recognize`

This route accepts:
- `image`: classroom image file
- `roster`: JSON string list of students

### `known_faces/`
This folder stores known student face images.

This is where you place one clear face image per student.

The file name must match one of these:
- `faceLabel`
- `studentId`
- student name converted to lowercase with `_`

Example:
- `rahul_verma.jpg`
- `stu123.png`

---

## 5. Concepts You Should Know

### What is OpenCV?
OpenCV is a computer vision library.

In our project, we use it mainly for:
- reading images
- resizing images
- converting color formats
- detecting faces with Haar Cascade

### What is `face_recognition`?
This is a Python library built on top of deep learning face encoding models.

It helps us:
- find face locations
- convert a face into numbers called an `encoding`
- compare one face encoding with another

### What is dlib?
`face_recognition` depends on `dlib` for important face-processing features.

Without `dlib`, full face matching does not work.

### What is CMake?
On Windows, `dlib` often needs `CMake` installed to build correctly.

If CMake is missing, `pip install face_recognition` can fail while building `dlib`.

### What is a face encoding?
A face encoding is a numeric representation of a face.

Instead of comparing raw images, the library converts faces into vectors of numbers. Then it compares how close those vectors are.

Smaller distance means:
`faces are more likely to belong to the same person`

### What is face tolerance?
Tolerance decides how strict the matching should be.

We are using:
- `FACE_MATCH_TOLERANCE=0.5`

Meaning:
- lower value = stricter match
- higher value = easier match but more false positives possible

---

## 6. How Recognition Works Step by Step

### Step 1: Upload image
The backend sends a classroom image to:
- `POST /api/attendance/recognize`

### Step 2: Decode image
Inside `face_utils.py`, the raw bytes are converted into an OpenCV image.

### Step 3: Resize image
If the image is too large, it is resized to improve speed.

### Step 4: Convert BGR to RGB
OpenCV uses BGR, but `face_recognition` needs RGB.

### Step 5: Detect faces
OpenCV Haar Cascade finds likely face boxes.

### Step 6: Generate encodings
If `face_recognition` is installed correctly, it finds face locations and creates face encodings.

If not, the service still works in detection-only mode.

### Step 7: Load known student face images
The service checks the `known_faces` folder for each student in the roster.

### Step 8: Compare faces
Each classroom face encoding is compared with all known student encodings.

### Step 9: Return result
The API returns:
- total detected faces
- recognized faces
- unknown faces
- matched students
- missing known face images
- optional warning if full recognition is not available

---

## 7. API Request and Response

### Endpoint
`POST /api/attendance/recognize`

### Form Data
- `image`: classroom image file
- `roster`: JSON string

### Example roster
```json
[
  {
    "studentId": "67e21b1a9a1b...",
    "name": "Rahul Verma",
    "faceLabel": "rahul_verma"
  },
  {
    "studentId": "67e21b6e9a1b...",
    "name": "Aditi Singh",
    "faceLabel": "aditi_singh"
  }
]
```

### Example response in full recognition mode
```json
{
  "success": true,
  "mode": "full_recognition",
  "detectedFacesCount": 4,
  "recognizedFacesCount": 2,
  "unknownFacesCount": 2,
  "matchedStudents": [
    {
      "studentId": "67e21b1a9a1b...",
      "name": "Rahul Verma",
      "confidence": 88.42,
      "matchedFile": "known_faces/rahul_verma.jpg"
    }
  ],
  "missingKnownFaces": [
    "Aditi Singh"
  ]
}
```

### Example response in detection-only mode
```json
{
  "success": true,
  "mode": "detection_only",
  "detectedFacesCount": 5,
  "recognizedFacesCount": 0,
  "unknownFacesCount": 5,
  "matchedStudents": [],
  "missingKnownFaces": [],
  "warning": "face_recognition/dlib is not installed correctly. OpenCV face detection is working, but face matching is disabled until CMake and dlib are installed."
}
```

---

## 8. How to Add Known Face Images

This is very important for the system to work.

### Rule
Put one clear face image for each student inside:
- `python-service/known_faces/`

### Best practices
- use a front-facing image
- avoid group photos
- avoid dark/blurry images
- keep only one main face in the image

### Naming example
If a student has:
- `faceLabel = rahul_verma`

Then save the image as:
- `known_faces/rahul_verma.jpg`

Supported formats:
- `.jpg`
- `.jpeg`
- `.png`

---

## 9. Environment Variables

Stored in:
- `python-service/.env`

Current values:

```env
FASTAPI_PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/smartcolladmsys
KNOWN_FACES_DIR=known_faces
FACE_MATCH_TOLERANCE=0.5
MAX_IMAGE_WIDTH=1280
```

### Meaning
- `FASTAPI_PORT`: which port FastAPI runs on
- `KNOWN_FACES_DIR`: folder where student face images are stored
- `FACE_MATCH_TOLERANCE`: strictness of face matching
- `MAX_IMAGE_WIDTH`: resize limit for uploaded images

---

## 10. How to Run the Python Service

### Step 1: Go to the folder
```bash
cd python-service
```

### Step 2: Install requirements
```bash
pip install -r requirements.txt
```

### Step 3: Run FastAPI server
```bash
uvicorn app.main:app --reload --port 8000
```

### Step 4: Open docs
FastAPI auto-docs usually open at:
- `http://127.0.0.1:8000/docs`

---

## 11. Current Windows Setup Blocker

During installation on this machine, `dlib` failed to build because `CMake` is not installed.

That means:
- OpenCV parts can still work
- full face matching will not work until `dlib` installs successfully

### To fix it later on Windows
1. Install `CMake` from the official CMake installer.
2. Make sure CMake is added to `PATH`.
3. Restart terminal.
4. Run again:
```bash
pip install -r requirements.txt
```

If `dlib` installs correctly after that, the service should automatically move from `detection_only` mode to `full_recognition` mode.

---

## 12. Common Problems and Fixes

### Problem: No faces detected
Possible reasons:
- image is blurry
- lighting is poor
- faces are too small
- image angle is difficult

### Problem: Student not matched
Possible reasons:
- student image missing in `known_faces`
- file name does not match `faceLabel`
- classroom image quality is poor
- tolerance is too strict
- service is currently in `detection_only` mode

### Problem: Wrong student matched
Possible reasons:
- tolerance is too loose
- known image is not clear
- multiple similar-looking faces

### Problem: `missingKnownFaces` is not empty
This means the service could not find a saved face image for one or more students.

---

## 13. Why We Used Separate Files

This project is split into small files because it becomes easier to understand.

### `main.py`
Handles app startup

### `routes/attendance.py`
Handles API request/response

### `services/face_recognition_service.py`
Handles core recognition logic

### `face_utils.py`
Handles image processing helpers

This is a clean architecture pattern:
`route -> service -> utility`

---

## 14. Learning Summary

If you remember only one thing, remember this flow:

`image upload -> OpenCV preprocessing -> face detection -> face encodings when available -> compare with known faces -> matched students returned`

That is the full idea behind the Python attendance service.

---

## 15. Next Improvements You Can Add Later

Once you understand this version, you can improve it with:
- storing face encodings in database instead of reading image files every time
- better preprocessing for dark classroom images
- subject/class-wise student roster filtering
- webcam capture support
- attendance auto-save for both present and absent students
- confidence threshold controls in admin settings
- duplicate prevention for same class and same date

---

## 16. Final Advice

Do not try to memorize everything at once.

Start by understanding these four files in order:
1. `app/main.py`
2. `app/routes/attendance.py`
3. `app/services/face_recognition_service.py`
4. `app/face_utils.py`

If you understand those four, you understand the core of the Python attendance system.
