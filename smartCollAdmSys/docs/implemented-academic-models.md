# Implemented Academic Models

The following backend models have now been added or updated to support the new college structure:

## Newly added models
- `Department`
- `Program`
- `Subject`
- `Batch`
- `FacultyAssignment`
- `AttendanceSession`

## Updated existing models
- `Student`
- `User`

## Important note
The current app is still using some legacy flat fields like `department` text and direct `subject` strings in attendance.

That is intentional for now.

These new models are the foundation for the next refactor phase where we will:
- create APIs for departments, programs, subjects, and batches
- create faculty assignment APIs
- update attendance to work through `facultyAssignment`
- later replace the flat attendance structure with `AttendanceSession + AttendanceRecord`

## Files
- `backend/src/models/Department.js`
- `backend/src/models/Program.js`
- `backend/src/models/Subject.js`
- `backend/src/models/Batch.js`
- `backend/src/models/FacultyAssignment.js`
- `backend/src/models/AttendanceSession.js`
- `backend/src/models/Student.js`
- `backend/src/models/User.js`
