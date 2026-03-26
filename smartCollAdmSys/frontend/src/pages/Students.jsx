import { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/common/DataTable';
import SectionCard from '../components/common/SectionCard';

const getInitialFormData = () => ({
  name: '',
  rollNumber: '',
  department: '',
  departmentRef: '',
  program: '',
  semester: 1,
  batch: '',
  academicYear: '',
  section: '',
  email: '',
  faceLabel: '',
  photo: null,
  photoName: ''
});

export default function Students({ students, departments, programs, batches, onAddStudent }) {
  const [formData, setFormData] = useState(getInitialFormData());

  const filteredPrograms = useMemo(() => {
    if (!formData.departmentRef) {
      return programs;
    }

    return programs.filter((program) => program.departmentId === formData.departmentRef);
  }, [programs, formData.departmentRef]);

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const matchesProgram = formData.program ? batch.programId === formData.program : true;
      const matchesSemester = formData.semester ? Number(batch.semester) === Number(formData.semester) : true;
      return matchesProgram && matchesSemester;
    });
  }, [batches, formData.program, formData.semester]);

  useEffect(() => {
    if (!formData.departmentRef && departments.length > 0) {
      const firstDepartment = departments[0];
      setFormData((previousData) => ({
        ...previousData,
        departmentRef: firstDepartment.id,
        department: firstDepartment.name
      }));
    }
  }, [departments, formData.departmentRef]);

  useEffect(() => {
    if (filteredPrograms.length === 0) {
      setFormData((previousData) => ({
        ...previousData,
        program: ''
      }));
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      program: filteredPrograms.some((program) => program.id === previousData.program)
        ? previousData.program
        : filteredPrograms[0].id
    }));
  }, [filteredPrograms]);

  useEffect(() => {
    if (filteredBatches.length === 0) {
      setFormData((previousData) => ({
        ...previousData,
        batch: '',
        academicYear: previousData.academicYear,
        section: previousData.section
      }));
      return;
    }

    setFormData((previousData) => {
      const selectedBatch = filteredBatches.find((batch) => batch.id === previousData.batch) || filteredBatches[0];

      return {
        ...previousData,
        batch: selectedBatch.id,
        academicYear: selectedBatch.academicYear || '',
        section: selectedBatch.section || ''
      };
    });
  }, [filteredBatches]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (files) {
      setFormData((previousData) => ({
        ...previousData,
        [name]: files[0] || null,
        photoName: files[0]?.name || ''
      }));
      return;
    }

    if (name === 'departmentRef') {
      const selectedDepartment = departments.find((department) => department.id === value);

      setFormData((previousData) => ({
        ...previousData,
        departmentRef: value,
        department: selectedDepartment?.name || '',
        program: '',
        batch: ''
      }));
      return;
    }

    if (name === 'program') {
      setFormData((previousData) => ({
        ...previousData,
        program: value,
        batch: ''
      }));
      return;
    }

    if (name === 'semester') {
      setFormData((previousData) => ({
        ...previousData,
        semester: value,
        batch: ''
      }));
      return;
    }

    if (name === 'batch') {
      const selectedBatch = batches.find((batch) => batch.id === value);

      setFormData((previousData) => ({
        ...previousData,
        batch: value,
        academicYear: selectedBatch?.academicYear || '',
        section: selectedBatch?.section || previousData.section
      }));
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onAddStudent(formData);
    setFormData(getInitialFormData());
    event.target.reset();
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'rollNumber', label: 'Roll Number' },
    { key: 'departmentName', label: 'Department' },
    { key: 'programName', label: 'Program' },
    { key: 'batchName', label: 'Batch' },
    { key: 'semester', label: 'Semester' },
    { key: 'attendancePercentage', label: 'Attendance %' },
    { key: 'status', label: 'Status', type: 'badge' }
  ];

  const hasAcademicSetup = departments.length > 0 && programs.length > 0 && batches.length > 0;

  return (
    <div className="content-grid">
      <SectionCard title="Student Directory" subtitle="All current student records with academic grouping">
        <DataTable columns={columns} rows={students} />
      </SectionCard>

      <SectionCard title="Add Student" subtitle="Create a student and connect them to the correct department, program and batch">
        <form className="simple-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Student name" required />
            <input name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="Roll number" required />

            <select name="departmentRef" value={formData.departmentRef} onChange={handleChange} required>
              <option value="">Select department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>{department.name} ({department.code})</option>
              ))}
            </select>

            <select name="program" value={formData.program} onChange={handleChange} required>
              <option value="">Select program</option>
              {filteredPrograms.map((program) => (
                <option key={program.id} value={program.id}>{program.name} ({program.code})</option>
              ))}
            </select>

            <select name="semester" value={formData.semester} onChange={handleChange} required>
              {Array.from({ length: 8 }, (_, index) => index + 1).map((semester) => (
                <option key={semester} value={semester}>Semester {semester}</option>
              ))}
            </select>

            <select name="batch" value={formData.batch} onChange={handleChange} required>
              <option value="">Select batch</option>
              {filteredBatches.map((batch) => (
                <option key={batch.id} value={batch.id}>{batch.name} {batch.section ? `• Section ${batch.section}` : ''} • {batch.academicYear}</option>
              ))}
            </select>

            <input name="academicYear" value={formData.academicYear} onChange={handleChange} placeholder="Academic year" required />
            <input name="section" value={formData.section} onChange={handleChange} placeholder="Section" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" />
            <input name="faceLabel" value={formData.faceLabel} onChange={handleChange} placeholder="Face label (optional, example: rahul_verma)" />
            <input name="photo" type="file" accept="image/*" onChange={handleChange} required />
          </div>

          <div className="inline-note">
            {hasAcademicSetup
              ? 'Choose the student academic path first. The form automatically keeps the legacy department text and the new academic references in sync.'
              : 'Create departments, programs and batches first. After that, students can be linked batch-wise and attendance will work class-wise.'}
          </div>

          <div className="inline-note">
            {formData.photoName
              ? `Selected photo: ${formData.photoName}. It will be saved automatically for Python face recognition.`
              : 'Upload a clear front-facing photo. It will be stored automatically in the Python known_faces folder.'}
          </div>

          <button type="submit" className="primary-button" disabled={!hasAcademicSetup}>Save Student</button>
        </form>
      </SectionCard>
    </div>
  );
}
