# Deployment Guide

This project has three deployable parts:

1. `frontend` on Vercel
2. `backend` on Render
3. `python-service` on Render using Docker

## 1. Frontend on Vercel

Deploy the `frontend` folder as a separate Vercel project.

### Build settings
- Framework: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### Environment variable
Set this in Vercel:

```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
```

## 2. Backend on Render

Deploy the `backend` folder as a Node web service.

### Build settings
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

### Environment variables
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173,https://your-frontend-domain.vercel.app
JWT_SECRET=use_a_long_random_secret
JWT_EXPIRES_IN=7d
PYTHON_SERVICE_URL=https://your-python-service.onrender.com
```

## 3. Python Service on Render

The Python face recognition service uses native dependencies, so Docker is the safer deployment path.

### Build settings
- Root Directory: `python-service`
- Runtime: `Docker`
- Dockerfile: `python-service/Dockerfile`

### Environment variables
```env
PORT=8000
FASTAPI_PORT=8000
MONGO_URI=your_mongodb_connection_string
KNOWN_FACES_DIR=known_faces
FACE_MATCH_TOLERANCE=0.5
MAX_IMAGE_WIDTH=1280
```

## 4. Deployment order

Deploy in this order:

1. `python-service` on Render
2. `backend` on Render
3. `frontend` on Vercel

Then update:
- backend `PYTHON_SERVICE_URL` to the deployed Python service URL
- frontend `VITE_API_BASE_URL` to the deployed backend URL
- backend `CORS_ORIGIN` to include your Vercel frontend URL

## 5. Important note

The Python service depends on `face_recognition` and `dlib`. That is why a Docker deployment path is included. It is much more reliable than a plain Python runtime for this service.
