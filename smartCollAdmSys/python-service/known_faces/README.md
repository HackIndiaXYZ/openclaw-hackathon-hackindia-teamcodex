# Known Faces Folder

Put one image per student in this folder.

## How files reach this folder
You now have two ways to put student images here:

1. Recommended:
   add a student from the frontend form and upload the student's photo there
2. Manual:
   copy the file here yourself

When a student is created from the frontend, the backend automatically saves the uploaded image in this folder.

## File naming rule
The image name should match the student's `faceLabel`.

Example:
- Student name: Rahul Verma
- faceLabel stored in database: `rahul_verma`
- file name inside this folder: `rahul_verma.jpg`

## Tips
- use a clear front-facing image
- keep only one face in the image
- avoid dark or blurry photos
- prefer `.jpg` or `.png`
