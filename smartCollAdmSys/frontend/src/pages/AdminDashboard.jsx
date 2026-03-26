
import { useEffect, useMemo, useState } from 'react';
import SectionCard from '../components/common/SectionCard';
import StatCard from '../components/common/StatCard';
import DataTable from '../components/common/DataTable';
import { fetchUsers, createManagedUser, updateManagedUser } from '../api/userApi';
import { fetchStudents, updateStudent } from '../api/studentApi';
import { fetchDepartments, createDepartmentRecord, updateDepartmentRecord } from '../api/departmentApi';
import { fetchPrograms, createProgramRecord, updateProgramRecord } from '../api/programApi';
import { fetchBatches, createBatchRecord, updateBatchRecord } from '../api/batchApi';
import { fetchSubjects, createSubjectRecord, updateSubjectRecord } from '../api/subjectApi';
import { fetchFacultyAssignments, createFacultyAssignmentRecord, updateFacultyAssignmentRecord } from '../api/facultyAssignmentApi';

const facultyInitial = { id: '', name: '', email: '', password: '', role: 'professor', departmentId: '', employeeId: '' };
const departmentInitial = { id: '', name: '', code: '', description: '' };
const programInitial = { id: '', name: '', code: '', departmentId: '', totalSemesters: 6 };
const batchInitial = { id: '', name: '', departmentId: '', programId: '', semester: 1, section: '', academicYear: '' };
const subjectInitial = { id: '', name: '', code: '', departmentId: '', programId: '', semester: 1, credits: 0 };
const assignmentInitial = { id: '', facultyId: '', departmentId: '', programId: '', subjectId: '', batchId: '', semester: 1, academicYear: '', isClassTeacher: false };
const studentInitial = { id: '', name: '', rollNumber: '', email: '', department: '', departmentRef: '', program: '', semester: 1, batch: '', academicYear: '', section: '', faceLabel: '', photo: null, photoName: '' };

export default function AdminDashboard({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [facultyForm, setFacultyForm] = useState(facultyInitial);
  const [departmentForm, setDepartmentForm] = useState(departmentInitial);
  const [programForm, setProgramForm] = useState(programInitial);
  const [batchForm, setBatchForm] = useState(batchInitial);
  const [subjectForm, setSubjectForm] = useState(subjectInitial);
  const [assignmentForm, setAssignmentForm] = useState(assignmentInitial);
  const [studentForm, setStudentForm] = useState(studentInitial);

  const loadAdminData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const [usersResponse, studentsResponse, departmentsResponse, programsResponse, batchesResponse, subjectsResponse, assignmentsResponse] = await Promise.all([
        fetchUsers(), fetchStudents(), fetchDepartments(), fetchPrograms(), fetchBatches(), fetchSubjects(), fetchFacultyAssignments()
      ]);
      setUsers(usersResponse.users || []);
      setStudents(studentsResponse.students || []);
      setDepartments(departmentsResponse.departments || []);
      setPrograms(programsResponse.programs || []);
      setBatches(batchesResponse.batches || []);
      setSubjects(subjectsResponse.subjects || []);
      setAssignments(assignmentsResponse.assignments || []);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const facultyOptions = useMemo(() => users.filter((user) => user.role === 'professor' || user.role === 'dean'), [users]);
  const studentProgramOptions = useMemo(() => programs.filter((program) => !studentForm.departmentRef || String(program.department?._id || program.department) === studentForm.departmentRef), [programs, studentForm.departmentRef]);
  const studentBatchOptions = useMemo(() => batches.filter((batch) => (!studentForm.program || String(batch.program?._id || batch.program) === studentForm.program) && Number(batch.semester) === Number(studentForm.semester)), [batches, studentForm.program, studentForm.semester]);
  const batchProgramOptions = useMemo(() => programs.filter((program) => !batchForm.departmentId || String(program.department?._id || program.department) === batchForm.departmentId), [programs, batchForm.departmentId]);
  const subjectProgramOptions = useMemo(() => programs.filter((program) => !subjectForm.departmentId || String(program.department?._id || program.department) === subjectForm.departmentId), [programs, subjectForm.departmentId]);
  const assignmentProgramOptions = useMemo(() => programs.filter((program) => !assignmentForm.departmentId || String(program.department?._id || program.department) === assignmentForm.departmentId), [programs, assignmentForm.departmentId]);
  const assignmentSubjectOptions = useMemo(() => subjects.filter((subject) => (!assignmentForm.programId || String(subject.program?._id || subject.program) === assignmentForm.programId) && Number(subject.semester) === Number(assignmentForm.semester)), [subjects, assignmentForm.programId, assignmentForm.semester]);
  const assignmentBatchOptions = useMemo(() => batches.filter((batch) => (!assignmentForm.programId || String(batch.program?._id || batch.program) === assignmentForm.programId) && Number(batch.semester) === Number(assignmentForm.semester)), [batches, assignmentForm.programId, assignmentForm.semester]);

  const resetAllMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const afterSave = async (message, resetCallback) => {
    setSuccessMessage(message);
    resetCallback();
    await loadAdminData();
  };

  const actionColumn = (onEdit) => ({ key: 'actions', label: 'Actions', render: (row) => <button type="button" className="table-action-button" onClick={() => onEdit(row.original)}>Edit</button> });

  const studentRows = students.map((student) => ({ id: student._id, name: student.name, rollNumber: student.rollNumber, department: student.departmentRef?.name || student.department, program: student.program?.name || '-', batch: student.batch?.name || '-', semester: student.semester, original: student }));
  const facultyRows = users.map((user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, department: user.department || user.departmentIds?.map((department) => department.name).join(', ') || '-', employeeId: user.employeeId || '-', original: user }));
  const departmentRows = departments.map((department) => ({ id: department._id, name: department.name, code: department.code, description: department.description || '-', original: department }));
  const programRows = programs.map((program) => ({ id: program._id, name: program.name, code: program.code, department: program.department?.name || '-', totalSemesters: program.totalSemesters, original: program }));
  const batchRows = batches.map((batch) => ({ id: batch._id, name: batch.name, program: batch.program?.name || '-', semester: batch.semester, section: batch.section || '-', year: batch.academicYear, original: batch }));
  const subjectRows = subjects.map((subject) => ({ id: subject._id, name: subject.name, code: subject.code, program: subject.program?.name || '-', semester: subject.semester, credits: subject.credits, original: subject }));
  const assignmentRows = assignments.map((assignment) => ({ id: assignment._id, faculty: assignment.faculty?.name || '-', subject: assignment.subject?.name || '-', program: assignment.program?.code || assignment.program?.name || '-', batch: assignment.batch?.name || '-', semester: assignment.semester, year: assignment.academicYear, original: assignment }));

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'dean') {
    return <p className="page-error">Only admin and dean users can access this dashboard.</p>;
  }

  const handleFacultySubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    resetAllMessages();
    try {
      const selectedDepartment = departments.find((department) => department._id === facultyForm.departmentId);
      const payload = { name: facultyForm.name, email: facultyForm.email, password: facultyForm.password, role: facultyForm.role, employeeId: facultyForm.employeeId, department: selectedDepartment?.name || '', departmentIds: facultyForm.departmentId ? [facultyForm.departmentId] : [] };
      if (facultyForm.id) {
        if (!payload.password) delete payload.password;
        await updateManagedUser(facultyForm.id, payload);
        await afterSave('Faculty updated successfully', () => setFacultyForm(facultyInitial));
      } else {
        await createManagedUser(payload);
        await afterSave('Faculty created successfully', () => setFacultyForm(facultyInitial));
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save faculty');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDepartmentSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    resetAllMessages();
    try {
      if (departmentForm.id) {
        await updateDepartmentRecord(departmentForm.id, departmentForm);
        await afterSave('Department updated successfully', () => setDepartmentForm(departmentInitial));
      } else {
        await createDepartmentRecord(departmentForm);
        await afterSave('Department created successfully', () => setDepartmentForm(departmentInitial));
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProgramSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    resetAllMessages();
    try {
      const payload = { ...programForm, totalSemesters: Number(programForm.totalSemesters), departmentId: programForm.departmentId };
      if (programForm.id) {
        await updateProgramRecord(programForm.id, payload);
        await afterSave('Program updated successfully', () => setProgramForm(programInitial));
      } else {
        await createProgramRecord(payload);
        await afterSave('Program created successfully', () => setProgramForm(programInitial));
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save program');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBatchSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    resetAllMessages();
    try {
      const payload = { ...batchForm, semester: Number(batchForm.semester), departmentId: batchForm.departmentId, programId: batchForm.programId };
      if (batchForm.id) {
        await updateBatchRecord(batchForm.id, payload);
        await afterSave('Batch updated successfully', () => setBatchForm(batchInitial));
      } else {
        await createBatchRecord(payload);
        await afterSave('Batch created successfully', () => setBatchForm(batchInitial));
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save batch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubjectSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    resetAllMessages();
    try {
      const payload = { ...subjectForm, semester: Number(subjectForm.semester), credits: Number(subjectForm.credits), departmentId: subjectForm.departmentId, programId: subjectForm.programId };
      if (subjectForm.id) {
        await updateSubjectRecord(subjectForm.id, payload);
        await afterSave('Subject updated successfully', () => setSubjectForm(subjectInitial));
      } else {
        await createSubjectRecord(payload);
        await afterSave('Subject created successfully', () => setSubjectForm(subjectInitial));
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save subject');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignmentSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    resetAllMessages();
    try {
      const payload = { ...assignmentForm, semester: Number(assignmentForm.semester), isClassTeacher: Boolean(assignmentForm.isClassTeacher), facultyId: assignmentForm.facultyId, departmentId: assignmentForm.departmentId, programId: assignmentForm.programId, subjectId: assignmentForm.subjectId, batchId: assignmentForm.batchId };
      if (assignmentForm.id) {
        await updateFacultyAssignmentRecord(assignmentForm.id, payload);
        await afterSave('Assignment updated successfully', () => setAssignmentForm(assignmentInitial));
      } else {
        await createFacultyAssignmentRecord(payload);
        await afterSave('Assignment created successfully', () => setAssignmentForm(assignmentInitial));
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStudentSubmit = async (event) => {
    event.preventDefault();
    if (!studentForm.id) {
      setErrorMessage('Select a student from the table first');
      return;
    }
    setSubmitting(true);
    resetAllMessages();
    try {
      await updateStudent(studentForm.id, { ...studentForm, semester: Number(studentForm.semester) });
      await afterSave('Student updated successfully', () => setStudentForm(studentInitial));
    } catch (error) {
      setErrorMessage(error.message || 'Unable to update student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-grid">
      <div className="stats-grid">
        <StatCard title="Faculty Users" value={users.length} note="All staff accounts" />
        <StatCard title="Students" value={students.length} note="Across all departments" />
        <StatCard title="Subjects" value={subjects.length} note="Mapped and ready to assign" />
        <StatCard title="Assignments" value={assignments.length} note="Teaching loads configured" />
      </div>

      {errorMessage ? <p className="page-error">{errorMessage}</p> : null}
      {successMessage ? <p className="page-loader">{successMessage}</p> : null}
      {loading ? <div className="page-loader">Loading admin data...</div> : null}

      <div className="admin-grid">
        <SectionCard title="Faculty Management" subtitle="Create or update faculty, dean and admin users">
          <form className="simple-form" onSubmit={handleFacultySubmit}>
            <div className="form-grid">
              <input value={facultyForm.name} onChange={(event) => setFacultyForm({ ...facultyForm, name: event.target.value })} placeholder="Full name" required />
              <input value={facultyForm.email} onChange={(event) => setFacultyForm({ ...facultyForm, email: event.target.value })} placeholder="Email" type="email" required />
              <input value={facultyForm.password} onChange={(event) => setFacultyForm({ ...facultyForm, password: event.target.value })} placeholder={facultyForm.id ? 'New password (optional)' : 'Password'} type="password" required={!facultyForm.id} />
              <select value={facultyForm.role} onChange={(event) => setFacultyForm({ ...facultyForm, role: event.target.value })}><option value="professor">Professor</option><option value="dean">Dean</option><option value="admin">Admin</option></select>
              <select value={facultyForm.departmentId} onChange={(event) => setFacultyForm({ ...facultyForm, departmentId: event.target.value })}><option value="">Select department</option>{departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select>
              <input value={facultyForm.employeeId} onChange={(event) => setFacultyForm({ ...facultyForm, employeeId: event.target.value })} placeholder="Employee ID" />
            </div>
            <div className="button-row"><button type="submit" className="primary-button" disabled={submitting}>{facultyForm.id ? 'Update Faculty' : 'Create Faculty'}</button><button type="button" className="secondary-button" onClick={() => setFacultyForm(facultyInitial)}>Reset</button></div>
          </form>
          <DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'department', label: 'Department' }, { key: 'employeeId', label: 'Employee ID' }, actionColumn((user) => setFacultyForm({ id: user._id, name: user.name, email: user.email, password: '', role: user.role, departmentId: user.departmentIds?.[0]?._id || '', employeeId: user.employeeId || '' }))]} rows={facultyRows} />
        </SectionCard>

        <SectionCard title="Student Editor" subtitle="Update student details, academic mapping and face label">
          <form className="simple-form" onSubmit={handleStudentSubmit}>
            <div className="form-grid">
              <input value={studentForm.name} onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })} placeholder="Student name" required />
              <input value={studentForm.rollNumber} onChange={(event) => setStudentForm({ ...studentForm, rollNumber: event.target.value })} placeholder="Roll number" required />
              <input value={studentForm.email} onChange={(event) => setStudentForm({ ...studentForm, email: event.target.value })} placeholder="Email" type="email" />
              <select value={studentForm.departmentRef} onChange={(event) => { const department = departments.find((item) => item._id === event.target.value); setStudentForm({ ...studentForm, departmentRef: event.target.value, department: department?.name || '', program: '', batch: '' }); }}><option value="">Select department</option>{departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select>
              <select value={studentForm.program} onChange={(event) => setStudentForm({ ...studentForm, program: event.target.value, batch: '' })}><option value="">Select program</option>{studentProgramOptions.map((program) => <option key={program._id} value={program._id}>{program.name}</option>)}</select>
              <select value={studentForm.semester} onChange={(event) => setStudentForm({ ...studentForm, semester: event.target.value, batch: '' })}>{Array.from({ length: 8 }, (_, index) => index + 1).map((semester) => <option key={semester} value={semester}>Semester {semester}</option>)}</select>
              <select value={studentForm.batch} onChange={(event) => { const batch = batches.find((item) => item._id === event.target.value); setStudentForm({ ...studentForm, batch: event.target.value, academicYear: batch?.academicYear || studentForm.academicYear, section: batch?.section || studentForm.section }); }}><option value="">Select batch</option>{studentBatchOptions.map((batch) => <option key={batch._id} value={batch._id}>{batch.name} • {batch.academicYear}</option>)}</select>
              <input value={studentForm.academicYear} onChange={(event) => setStudentForm({ ...studentForm, academicYear: event.target.value })} placeholder="Academic year" />
              <input value={studentForm.section} onChange={(event) => setStudentForm({ ...studentForm, section: event.target.value })} placeholder="Section" />
              <input value={studentForm.faceLabel} onChange={(event) => setStudentForm({ ...studentForm, faceLabel: event.target.value })} placeholder="Face label" />
              <input type="file" accept="image/*" onChange={(event) => setStudentForm({ ...studentForm, photo: event.target.files?.[0] || null, photoName: event.target.files?.[0]?.name || '' })} />
            </div>
            <div className="inline-note">{studentForm.photoName ? `Selected new photo: ${studentForm.photoName}` : 'Optional: upload a new face image for this student.'}</div>
            <div className="button-row"><button type="submit" className="primary-button" disabled={submitting || !studentForm.id}>Update Student</button><button type="button" className="secondary-button" onClick={() => setStudentForm(studentInitial)}>Reset</button></div>
          </form>
          <DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'rollNumber', label: 'Roll' }, { key: 'department', label: 'Department' }, { key: 'program', label: 'Program' }, { key: 'batch', label: 'Batch' }, { key: 'semester', label: 'Semester' }, actionColumn((student) => setStudentForm({ id: student._id, name: student.name, rollNumber: student.rollNumber, email: student.email || '', department: student.departmentRef?.name || student.department || '', departmentRef: student.departmentRef?._id || '', program: student.program?._id || '', semester: student.semester, batch: student.batch?._id || '', academicYear: student.academicYear || student.batch?.academicYear || '', section: student.section || '', faceLabel: student.faceLabel || '', photo: null, photoName: '' }))]} rows={studentRows} />
        </SectionCard>
      </div>

      <div className="admin-grid">
        <SectionCard title="Department Management" subtitle="Create and edit departments">
          <form className="simple-form" onSubmit={handleDepartmentSubmit}>
            <div className="form-grid">
              <input value={departmentForm.name} onChange={(event) => setDepartmentForm({ ...departmentForm, name: event.target.value })} placeholder="Department name" required />
              <input value={departmentForm.code} onChange={(event) => setDepartmentForm({ ...departmentForm, code: event.target.value })} placeholder="Code" required />
              <input value={departmentForm.description} onChange={(event) => setDepartmentForm({ ...departmentForm, description: event.target.value })} placeholder="Description" />
            </div>
            <div className="button-row"><button type="submit" className="primary-button" disabled={submitting}>{departmentForm.id ? 'Update Department' : 'Create Department'}</button><button type="button" className="secondary-button" onClick={() => setDepartmentForm(departmentInitial)}>Reset</button></div>
          </form>
          <DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }, { key: 'description', label: 'Description' }, actionColumn((department) => setDepartmentForm({ id: department._id, name: department.name, code: department.code, description: department.description || '' }))]} rows={departmentRows} />
        </SectionCard>

        <SectionCard title="Program Management" subtitle="Create and edit programs inside departments">
          <form className="simple-form" onSubmit={handleProgramSubmit}>
            <div className="form-grid">
              <input value={programForm.name} onChange={(event) => setProgramForm({ ...programForm, name: event.target.value })} placeholder="Program name" required />
              <input value={programForm.code} onChange={(event) => setProgramForm({ ...programForm, code: event.target.value })} placeholder="Program code" required />
              <select value={programForm.departmentId} onChange={(event) => setProgramForm({ ...programForm, departmentId: event.target.value })} required><option value="">Select department</option>{departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select>
              <input value={programForm.totalSemesters} onChange={(event) => setProgramForm({ ...programForm, totalSemesters: event.target.value })} type="number" min="1" placeholder="Total semesters" required />
            </div>
            <div className="button-row"><button type="submit" className="primary-button" disabled={submitting}>{programForm.id ? 'Update Program' : 'Create Program'}</button><button type="button" className="secondary-button" onClick={() => setProgramForm(programInitial)}>Reset</button></div>
          </form>
          <DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }, { key: 'department', label: 'Department' }, { key: 'totalSemesters', label: 'Semesters' }, actionColumn((program) => setProgramForm({ id: program._id, name: program.name, code: program.code, departmentId: program.department?._id || '', totalSemesters: program.totalSemesters }))]} rows={programRows} />
        </SectionCard>
      </div>

      <div className="admin-grid">
        <SectionCard title="Batch Management" subtitle="Manage semester-wise batches for each program">
          <form className="simple-form" onSubmit={handleBatchSubmit}>
            <div className="form-grid">
              <input value={batchForm.name} onChange={(event) => setBatchForm({ ...batchForm, name: event.target.value })} placeholder="Batch name" required />
              <select value={batchForm.departmentId} onChange={(event) => setBatchForm({ ...batchForm, departmentId: event.target.value, programId: '' })} required><option value="">Select department</option>{departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select>
              <select value={batchForm.programId} onChange={(event) => setBatchForm({ ...batchForm, programId: event.target.value })} required><option value="">Select program</option>{batchProgramOptions.map((program) => <option key={program._id} value={program._id}>{program.name}</option>)}</select>
              <input value={batchForm.semester} onChange={(event) => setBatchForm({ ...batchForm, semester: event.target.value })} type="number" min="1" placeholder="Semester" required />
              <input value={batchForm.section} onChange={(event) => setBatchForm({ ...batchForm, section: event.target.value })} placeholder="Section" />
              <input value={batchForm.academicYear} onChange={(event) => setBatchForm({ ...batchForm, academicYear: event.target.value })} placeholder="Academic year" required />
            </div>
            <div className="button-row"><button type="submit" className="primary-button" disabled={submitting}>{batchForm.id ? 'Update Batch' : 'Create Batch'}</button><button type="button" className="secondary-button" onClick={() => setBatchForm(batchInitial)}>Reset</button></div>
          </form>
          <DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'program', label: 'Program' }, { key: 'semester', label: 'Semester' }, { key: 'section', label: 'Section' }, { key: 'year', label: 'Academic Year' }, actionColumn((batch) => setBatchForm({ id: batch._id, name: batch.name, departmentId: batch.department?._id || '', programId: batch.program?._id || '', semester: batch.semester, section: batch.section || '', academicYear: batch.academicYear }))]} rows={batchRows} />
        </SectionCard>

        <SectionCard title="Subject Management" subtitle="Manage subjects for each program and semester">
          <form className="simple-form" onSubmit={handleSubjectSubmit}>
            <div className="form-grid">
              <input value={subjectForm.name} onChange={(event) => setSubjectForm({ ...subjectForm, name: event.target.value })} placeholder="Subject name" required />
              <input value={subjectForm.code} onChange={(event) => setSubjectForm({ ...subjectForm, code: event.target.value })} placeholder="Subject code" required />
              <select value={subjectForm.departmentId} onChange={(event) => setSubjectForm({ ...subjectForm, departmentId: event.target.value, programId: '' })} required><option value="">Select department</option>{departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select>
              <select value={subjectForm.programId} onChange={(event) => setSubjectForm({ ...subjectForm, programId: event.target.value })} required><option value="">Select program</option>{subjectProgramOptions.map((program) => <option key={program._id} value={program._id}>{program.name}</option>)}</select>
              <input value={subjectForm.semester} onChange={(event) => setSubjectForm({ ...subjectForm, semester: event.target.value })} type="number" min="1" placeholder="Semester" required />
              <input value={subjectForm.credits} onChange={(event) => setSubjectForm({ ...subjectForm, credits: event.target.value })} type="number" min="0" placeholder="Credits" />
            </div>
            <div className="button-row"><button type="submit" className="primary-button" disabled={submitting}>{subjectForm.id ? 'Update Subject' : 'Create Subject'}</button><button type="button" className="secondary-button" onClick={() => setSubjectForm(subjectInitial)}>Reset</button></div>
          </form>
          <DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }, { key: 'program', label: 'Program' }, { key: 'semester', label: 'Semester' }, { key: 'credits', label: 'Credits' }, actionColumn((subject) => setSubjectForm({ id: subject._id, name: subject.name, code: subject.code, departmentId: subject.department?._id || '', programId: subject.program?._id || '', semester: subject.semester, credits: subject.credits }))]} rows={subjectRows} />
        </SectionCard>
      </div>

      <SectionCard title="Faculty Assignment Management" subtitle="Map professors to departments, programs, subjects and batches">
        <form className="simple-form" onSubmit={handleAssignmentSubmit}>
          <div className="form-grid">
            <select value={assignmentForm.facultyId} onChange={(event) => setAssignmentForm({ ...assignmentForm, facultyId: event.target.value })} required><option value="">Select faculty</option>{facultyOptions.map((user) => <option key={user._id} value={user._id}>{user.name} ({user.role})</option>)}</select>
            <select value={assignmentForm.departmentId} onChange={(event) => setAssignmentForm({ ...assignmentForm, departmentId: event.target.value, programId: '', subjectId: '', batchId: '' })} required><option value="">Select department</option>{departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select>
            <select value={assignmentForm.programId} onChange={(event) => setAssignmentForm({ ...assignmentForm, programId: event.target.value, subjectId: '', batchId: '' })} required><option value="">Select program</option>{assignmentProgramOptions.map((program) => <option key={program._id} value={program._id}>{program.name}</option>)}</select>
            <input value={assignmentForm.semester} onChange={(event) => setAssignmentForm({ ...assignmentForm, semester: event.target.value, subjectId: '', batchId: '' })} type="number" min="1" placeholder="Semester" required />
            <select value={assignmentForm.subjectId} onChange={(event) => setAssignmentForm({ ...assignmentForm, subjectId: event.target.value })} required><option value="">Select subject</option>{assignmentSubjectOptions.map((subject) => <option key={subject._id} value={subject._id}>{subject.name}</option>)}</select>
            <select value={assignmentForm.batchId} onChange={(event) => setAssignmentForm({ ...assignmentForm, batchId: event.target.value })} required><option value="">Select batch</option>{assignmentBatchOptions.map((batch) => <option key={batch._id} value={batch._id}>{batch.name} • {batch.academicYear}</option>)}</select>
            <input value={assignmentForm.academicYear} onChange={(event) => setAssignmentForm({ ...assignmentForm, academicYear: event.target.value })} placeholder="Academic year" required />
            <select value={String(assignmentForm.isClassTeacher)} onChange={(event) => setAssignmentForm({ ...assignmentForm, isClassTeacher: event.target.value === 'true' })}><option value="false">Subject Teacher</option><option value="true">Class Teacher</option></select>
          </div>
          <div className="button-row"><button type="submit" className="primary-button" disabled={submitting}>{assignmentForm.id ? 'Update Assignment' : 'Create Assignment'}</button><button type="button" className="secondary-button" onClick={() => setAssignmentForm(assignmentInitial)}>Reset</button></div>
        </form>
        <DataTable columns={[{ key: 'faculty', label: 'Faculty' }, { key: 'subject', label: 'Subject' }, { key: 'program', label: 'Program' }, { key: 'batch', label: 'Batch' }, { key: 'semester', label: 'Semester' }, { key: 'year', label: 'Academic Year' }, actionColumn((assignment) => setAssignmentForm({ id: assignment._id, facultyId: assignment.faculty?._id || '', departmentId: assignment.department?._id || '', programId: assignment.program?._id || '', subjectId: assignment.subject?._id || '', batchId: assignment.batch?._id || '', semester: assignment.semester, academicYear: assignment.academicYear, isClassTeacher: Boolean(assignment.isClassTeacher) }))]} rows={assignmentRows} />
      </SectionCard>
    </div>
  );
}
