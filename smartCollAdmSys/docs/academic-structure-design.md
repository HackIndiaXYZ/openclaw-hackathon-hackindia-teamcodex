# Academic Structure Design

This document defines the correct academic structure for the Smart College Admin System.

The goal is to move from a flat attendance model to a real college model where a professor can manage:
- multiple departments
- multiple programs or courses
- multiple subjects
- multiple batches or sections for the same subject

---

## 1. Why the Current Model Is Not Enough

Right now, the system mostly works like this:
- one student
- one subject
- one attendance record

That is too simple for a real college.

In real colleges, a professor usually teaches across multiple academic groups.

Example:
- `BCA -> DBMS -> Batch A`
- `BCA -> DBMS -> Batch B`
- `MCA -> Operating Systems -> Batch A`
- `MCA -> Operating Systems -> Batch B`
- `MCA -> Operating Systems -> Batch C`

So attendance should not be taken only by `student + subject`.
It should be taken for a proper class context.

---

## 2. Correct Academic Hierarchy

The academic hierarchy should be:

`Department -> Program -> Semester -> Subject -> Batch -> Faculty Assignment -> Students`

### Meaning
- `Department`: broad academic area such as Computer Applications
- `Program`: course like BCA, MCA, BBA
- `Semester`: semester number like 1, 2, 3, 4, 5, 6
- `Subject`: DBMS, OS, DSA, etc.
- `Batch`: section or group such as A, B, C
- `Faculty Assignment`: tells us which professor teaches which subject to which batch
- `Students`: belong to one program, semester, and batch

---

## 3. Final Core Models

We should redesign the system around these core models:

1. `User`
2. `Department`
3. `Program`
4. `Subject`
5. `Batch`
6. `FacultyAssignment`
7. `Student`
8. `AttendanceSession`
9. `AttendanceRecord`
10. `Marks`
11. `Report`
12. `Alert`

---

## 4. Model Design

### 4.1 User
This stores login users such as professor, admin, dean.

Recommended fields:
```js
{
  name,
  email,
  password,
  role, // admin, professor, dean
  employeeId,
  departmentIds: [ObjectId],
  isActive
}
```

Why:
- one professor may teach in more than one department
- role-based access remains clean

---

### 4.2 Department
This stores academic departments.

Examples:
- Computer Applications
- Management
- Science

Recommended fields:
```js
{
  name,
  code, // CA, MGMT, SCI
  description,
  isActive
}
```

---

### 4.3 Program
This stores programs or courses under a department.

Examples:
- BCA
- MCA
- BBA

Recommended fields:
```js
{
  name, // BCA
  code, // BCA
  department: ObjectId,
  totalSemesters,
  isActive
}
```

Relationship:
- one department can have many programs

Example:
- Department: Computer Applications
- Programs: BCA, MCA

---

### 4.4 Subject
This stores subjects taught in a program and semester.

Examples:
- DBMS
- Data Structures
- Operating Systems

Recommended fields:
```js
{
  name,
  code, // DBMS101
  department: ObjectId,
  program: ObjectId,
  semester,
  credits,
  isActive
}
```

Why:
- the same subject name may appear in different programs
- subject should belong to one program and semester

---

### 4.5 Batch
This stores class groups or sections.

Examples:
- BCA Semester 3 Section A
- MCA Semester 1 Section B

Recommended fields:
```js
{
  name, // A or B or C
  department: ObjectId,
  program: ObjectId,
  semester,
  section,
  academicYear, // 2025-26
  isActive
}
```

Important:
This model allows multiple batches for the same program and semester.

Example:
- BCA Semester 5 -> Batch A
- BCA Semester 5 -> Batch B

---

### 4.6 FacultyAssignment
This is the most important model for your real requirement.

It tells us:
`which professor teaches which subject to which batch`

Recommended fields:
```js
{
  faculty: ObjectId,
  department: ObjectId,
  program: ObjectId,
  subject: ObjectId,
  batch: ObjectId,
  semester,
  academicYear,
  isClassTeacher,
  isActive
}
```

Why this model is necessary:
A professor can teach:
- same subject to multiple batches
- different subjects in same department
- different programs inside same department

Example rows:
```text
Professor Sharma -> BCA -> DBMS -> Batch A
Professor Sharma -> BCA -> DBMS -> Batch B
Professor Sharma -> MCA -> OS -> Batch A
Professor Sharma -> MCA -> OS -> Batch B
Professor Sharma -> MCA -> OS -> Batch C
```

This is exactly the structure your project needs.

---

### 4.7 Student
Student should now belong to a specific batch, not only department.

Recommended fields:
```js
{
  name,
  rollNumber,
  email,
  department: ObjectId,
  program: ObjectId,
  semester,
  batch: ObjectId,
  parentName,
  parentContact,
  profileImage,
  faceLabel,
  isActive
}
```

Why this is better:
- student filtering becomes accurate
- attendance can be batch-wise
- report generation becomes batch and subject aware

---

### 4.8 AttendanceSession
This model represents one class attendance event.

For example:
`DBMS attendance for BCA Semester 5 Batch A on 2026-03-25`

Recommended fields:
```js
{
  facultyAssignment: ObjectId,
  department: ObjectId,
  program: ObjectId,
  subject: ObjectId,
  batch: ObjectId,
  date,
  source, // manual, photo, webcam
  classroomImage,
  capturedBy: ObjectId,
  recognitionSummary: {
    detectedFacesCount,
    recognizedFacesCount,
    unknownFacesCount
  }
}
```

Why this model is useful:
- keeps one class event together
- easier to avoid duplicate attendance for same class and date
- useful for analytics and audit history

---

### 4.9 AttendanceRecord
This stores per-student attendance status for one session.

Recommended fields:
```js
{
  attendanceSession: ObjectId,
  facultyAssignment: ObjectId,
  student: ObjectId,
  status, // present, absent
  recognitionConfidence,
  remarks
}
```

Why separate session + record model is better:
- one session can contain many students
- very natural for a classroom flow
- easier to query present/absent per class

---

### 4.10 Marks
Marks should also be linked through academic structure.

Recommended fields:
```js
{
  student: ObjectId,
  facultyAssignment: ObjectId,
  subject: ObjectId,
  batch: ObjectId,
  examType,
  marksObtained,
  maxMarks,
  semester,
  recordedBy: ObjectId
}
```

Why:
- professor teaches by assignment, not just by subject name
- subject ambiguity is removed

---

### 4.11 Report
Recommended fields:
```js
{
  student: ObjectId,
  batch: ObjectId,
  semester,
  attendancePercentage,
  performanceAverage,
  englishComment,
  hindiComment,
  generatedBy: ObjectId
}
```

---

### 4.12 Alert
Recommended fields:
```js
{
  student: ObjectId,
  facultyAssignment: ObjectId,
  type,
  title,
  message,
  severity,
  status,
  currentValue,
  threshold
}
```

This makes alerts subject-aware and batch-aware.

---

## 5. Key Relationships

### One-to-many relationships
- one `Department` -> many `Programs`
- one `Program` -> many `Subjects`
- one `Program + Semester` -> many `Batches`
- one `Professor` -> many `FacultyAssignments`
- one `Batch` -> many `Students`
- one `AttendanceSession` -> many `AttendanceRecords`

### Important rule
`FacultyAssignment` becomes the center of teaching operations.

Most teaching actions should be based on assignment.

Meaning:
- attendance should start by selecting a `FacultyAssignment`
- marks should be stored under a `FacultyAssignment`
- alerts should be linked to a `FacultyAssignment`

---

## 6. Correct Attendance Workflow After Redesign

### Old flow
Professor chooses student and subject directly.

### New flow
1. professor logs in
2. backend fetches professor's `FacultyAssignments`
3. frontend shows list like:
   - BCA / DBMS / Batch A
   - BCA / DBMS / Batch B
   - MCA / OS / Batch A
   - MCA / OS / Batch B
4. professor selects one assignment
5. system loads only students of that batch
6. professor uploads classroom image
7. Python service recognizes faces
8. backend creates one `AttendanceSession`
9. backend creates many `AttendanceRecords`
10. attendance percentage is updated subject-wise
11. alerts are created if required

This is the right design.

---

## 7. Correct Frontend Structure After Redesign

On attendance page, professor should not directly see all students.

They should first choose:
- department
- program
- subject
- batch

Or simpler:
just choose one `assigned class card`

Example cards:
- `BCA • DBMS • Batch A`
- `BCA • DBMS • Batch B`
- `MCA • OS • Batch A`

This is cleaner and faster.

---

## 8. Recommended API Design

### Department APIs
- `GET /api/departments`
- `POST /api/departments`

### Program APIs
- `GET /api/programs`
- `POST /api/programs`

### Subject APIs
- `GET /api/subjects`
- `POST /api/subjects`

### Batch APIs
- `GET /api/batches`
- `POST /api/batches`

### Faculty Assignment APIs
- `GET /api/faculty-assignments/my`
- `POST /api/faculty-assignments`

### Student APIs
- `GET /api/students?batchId=...`
- `POST /api/students`

### Attendance APIs
- `POST /api/attendance/recognize`
- `POST /api/attendance/session`
- `GET /api/attendance/session/:id`
- `GET /api/attendance/batch/:batchId`

---

## 9. Recommended Build Order

To avoid breaking the current MVP too hard, we should refactor in this order:

### Step 1
Add `Program` and `Batch` fields to `Student`

### Step 2
Create `Subject` model

### Step 3
Create `FacultyAssignment` model

### Step 4
Change attendance flow to use `facultyAssignmentId`

### Step 5
Create `AttendanceSession` model

### Step 6
Update marks and alerts to use assignment-aware structure

This path is safe and practical.

---

## 10. Minimum Refactor Needed Right Now

If we want a fast but correct improvement, the minimum next step is:

1. update `Student` model
   - add `program`
   - add `batch`
2. create `Subject` model
3. create `FacultyAssignment` model
4. update attendance form so professor selects assignment first

This alone will solve most of your real academic structure problem.

---

## 11. Final Recommendation

The final system should not treat attendance as only:
`student + subject`

It should treat attendance as:
`facultyAssignment + attendanceSession + attendanceRecords`

That is the correct model for colleges where professors manage:
- multiple departments
- multiple programs
- multiple subjects
- multiple batches

---

## 12. Next Action

Based on this design, the next coding step should be:

1. create `Program` model
2. create `Subject` model
3. create `Batch` model
4. create `FacultyAssignment` model
5. update `Student` model

Then we can update the frontend and attendance APIs properly.
