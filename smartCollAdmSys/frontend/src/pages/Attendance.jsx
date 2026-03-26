import { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/common/DataTable';
import SectionCard from '../components/common/SectionCard';

export default function Attendance({
  students,
  attendance,
  facultyAssignments,
  onAddAttendanceRecord,
  onRunAttendanceRecognition,
  onSaveRecognizedAttendance,
  recognitionResult,
  attendanceLoading
}) {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    status: 'present',
    source: 'photo',
    date: '2026-03-25',
    imageFile: null,
    imageName: ''
  });

  useEffect(() => {
    if (facultyAssignments.length > 0 && !selectedAssignmentId) {
      setSelectedAssignmentId(facultyAssignments[0].id);
    }
  }, [facultyAssignments, selectedAssignmentId]);

  const selectedAssignment = useMemo(() => {
    return facultyAssignments.find((assignment) => assignment.id === selectedAssignmentId) || null;
  }, [facultyAssignments, selectedAssignmentId]);

  const filteredStudents = useMemo(() => {
    if (!selectedAssignment) {
      return students;
    }

    // We show only the students who belong to the selected teaching assignment.
    return students.filter((student) => {
      const matchesBatch = selectedAssignment.batchId ? student.batchId === selectedAssignment.batchId : true;
      const matchesSemester = selectedAssignment.semester ? Number(student.semester) === Number(selectedAssignment.semester) : true;
      const matchesProgram = selectedAssignment.programId ? student.programId === selectedAssignment.programId : true;
      return matchesBatch && matchesSemester && matchesProgram;
    });
  }, [students, selectedAssignment]);

  useEffect(() => {
    setFormData((previousData) => ({
      ...previousData,
      subject: selectedAssignment?.subjectName || previousData.subject || 'DBMS'
    }));
  }, [selectedAssignment]);

  useEffect(() => {
    if (filteredStudents.length > 0) {
      setFormData((previousData) => ({
        ...previousData,
        studentId: filteredStudents.some((student) => student.id === previousData.studentId)
          ? previousData.studentId
          : filteredStudents[0].id
      }));
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      studentId: ''
    }));
  }, [filteredStudents]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: files ? files[0] || null : value,
      imageName: files ? files[0]?.name || '' : previousData.imageName
    }));
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();

    if (!formData.studentId) {
      return;
    }

    await onAddAttendanceRecord({
      studentId: formData.studentId,
      subject: formData.subject,
      status: formData.status,
      source: formData.source,
      date: formData.date,
      facultyAssignmentId: selectedAssignmentId
    });
  };

  const handleRecognize = async () => {
    if (!formData.imageFile) {
      return;
    }

    await onRunAttendanceRecognition({
      imageFile: formData.imageFile,
      facultyAssignmentId: selectedAssignmentId
    });
  };

  const handleSaveRecognized = async () => {
    await onSaveRecognizedAttendance({
      subject: formData.subject,
      date: formData.date,
      facultyAssignmentId: selectedAssignmentId
    });
  };

  const attendanceRows = useMemo(() => {
    const filteredAttendance = selectedAssignmentId
      ? attendance.filter((record) => record.facultyAssignmentId === selectedAssignmentId)
      : attendance;

    return filteredAttendance.map((record) => ({
      ...record,
      status: record.status.charAt(0).toUpperCase() + record.status.slice(1),
      assignmentLabel: record.assignmentLabel || 'Legacy Record'
    }));
  }, [attendance, selectedAssignmentId]);

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'subject', label: 'Subject' },
    { key: 'status', label: 'Status' },
    { key: 'source', label: 'Source' },
    { key: 'date', label: 'Date' }
  ];

  const isAnyAttendanceRequestRunning =
    attendanceLoading.manual || attendanceLoading.recognize || attendanceLoading.saveRecognized;

  let attendanceStatusMessage = 'Ready to send attendance request.';

  if (attendanceLoading.recognize) {
    attendanceStatusMessage = 'Recognition request sent. Checking faces in the uploaded image...';
  } else if (attendanceLoading.saveRecognized) {
    attendanceStatusMessage = 'Saving recognized students as present...';
  } else if (attendanceLoading.manual) {
    attendanceStatusMessage = 'Saving manual attendance record...';
  }

  return (
    <div className="content-grid">
      <div className="attendance-stack">
        <SectionCard title="Select Class" subtitle="Choose the exact batch and subject before marking attendance">
          {facultyAssignments.length ? (
            <div className="assignment-grid">
              {facultyAssignments.map((assignment) => (
                <button
                  key={assignment.id}
                  type="button"
                  className={`assignment-card ${selectedAssignmentId === assignment.id ? 'assignment-card--active' : ''}`}
                  onClick={() => setSelectedAssignmentId(assignment.id)}
                >
                  <strong>{assignment.subjectName}</strong>
                  <span>{assignment.programCode || assignment.programName} • {assignment.batchName}</span>
                  <small>{assignment.departmentName} • Sem {assignment.semester} • {assignment.academicYear}</small>
                </button>
              ))}
            </div>
          ) : (
            <p className="inline-note">No faculty assignments found yet. Create one from the academic setup first.</p>
          )}
        </SectionCard>

        <SectionCard title="Selected Class Summary" subtitle="This is the class context that will be used for recognition and saving attendance">
          {selectedAssignment ? (
            <div className="class-summary-grid">
              <div className="mini-stat">
                <strong>{selectedAssignment.departmentName || 'Department'}</strong>
                <span>Department</span>
              </div>
              <div className="mini-stat">
                <strong>{selectedAssignment.programCode || selectedAssignment.programName || 'Program'}</strong>
                <span>Program</span>
              </div>
              <div className="mini-stat">
                <strong>{selectedAssignment.batchName || 'Batch'}</strong>
                <span>Batch</span>
              </div>
              <div className="mini-stat">
                <strong>{filteredStudents.length}</strong>
                <span>Students in This Class</span>
              </div>
            </div>
          ) : (
            <p className="inline-note">Select a class assignment to continue.</p>
          )}
        </SectionCard>

        <SectionCard title="OpenCV Attendance" subtitle="Upload a classroom image and recognize student faces for the selected class">
          <div className="simple-form">
            <div className="form-grid">
              <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
              <input name="date" type="date" value={formData.date} onChange={handleChange} />
              <input name="imageFile" type="file" accept="image/*" onChange={handleChange} />
            </div>
            <div className="inline-note">
              {formData.imageName ? `Selected image: ${formData.imageName}` : 'Upload a classroom photo to run recognition.'}
            </div>
            <div className="button-row">
              <button
                type="button"
                className="primary-button"
                onClick={handleRecognize}
                disabled={!formData.imageFile || !selectedAssignmentId || isAnyAttendanceRequestRunning}
              >
                {attendanceLoading.recognize ? 'Recognizing...' : 'Recognize Faces'}
              </button>
              <button
                type="button"
                className="primary-button primary-button--secondary"
                onClick={handleSaveRecognized}
                disabled={!recognitionResult?.matchedStudents?.length || !selectedAssignmentId || isAnyAttendanceRequestRunning}
              >
                {attendanceLoading.saveRecognized ? 'Saving...' : 'Save Recognized Attendance'}
              </button>
            </div>
            <div className={isAnyAttendanceRequestRunning ? 'request-status request-status--active' : 'request-status'}>
              <span className={isAnyAttendanceRequestRunning ? 'request-dot request-dot--active' : 'request-dot'} />
              <span>{attendanceStatusMessage}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Recognition Result" subtitle="Matched students returned by the Python service for the selected class only">
          <div className="recognition-panel">
            <div className="recognition-stats">
              <div className="mini-stat">
                <strong>{recognitionResult?.detectedFacesCount ?? 0}</strong>
                <span>Detected Faces</span>
              </div>
              <div className="mini-stat">
                <strong>{recognitionResult?.recognizedFacesCount ?? 0}</strong>
                <span>Recognized</span>
              </div>
              <div className="mini-stat">
                <strong>{recognitionResult?.unknownFacesCount ?? 0}</strong>
                <span>Unknown</span>
              </div>
            </div>

            <div className="recognition-list">
              {recognitionResult?.matchedStudents?.length ? (
                recognitionResult.matchedStudents.map((student) => (
                  <div key={student.studentId} className="recognition-item">
                    <div>
                      <h4>{student.name}</h4>
                      <p>{student.studentId}</p>
                    </div>
                    <strong>{student.confidence}%</strong>
                  </div>
                ))
              ) : (
                <p className="inline-note">No recognition result yet.</p>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Manual Attendance" subtitle="If needed, mark one student manually for the selected class">
          <form className="simple-form" onSubmit={handleManualSubmit}>
            <div className="form-grid">
              <select name="studentId" value={formData.studentId} onChange={handleChange}>
                {filteredStudents.length === 0 ? <option value="">No students available for this class</option> : null}
                {filteredStudents.map((student) => (
                  <option key={student.id} value={student.id}>{student.name} ({student.rollNumber})</option>
                ))}
              </select>
              <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
              <select name="source" value={formData.source} onChange={handleChange}>
                <option value="photo">Photo Upload</option>
                <option value="webcam">Webcam</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <button type="submit" className="primary-button" disabled={filteredStudents.length === 0 || !selectedAssignmentId || isAnyAttendanceRequestRunning}>
              {attendanceLoading.manual ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </form>
        </SectionCard>
      </div>

      <SectionCard title="Attendance History" subtitle="Latest records for the selected class">
        <DataTable columns={columns} rows={attendanceRows} />
      </SectionCard>
    </div>
  );
}
