import { useEffect, useState } from 'react';
import DataTable from '../components/common/DataTable';
import SectionCard from '../components/common/SectionCard';

export default function Marks({ students, marks, onAddMarksRecord }) {
  const [formData, setFormData] = useState({
    studentId: '',
    subject: 'DBMS',
    examType: 'Internal',
    marksObtained: 0,
    maxMarks: 50,
    semester: 5
  });

  useEffect(() => {
    if (students.length > 0 && !formData.studentId) {
      setFormData((previousData) => ({
        ...previousData,
        studentId: students[0].id
      }));
    }
  }, [students, formData.studentId]);

  const handleChange = (event) => {
    setFormData((previousData) => ({
      ...previousData,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onAddMarksRecord(formData);
  };

  const rows = marks.map((item) => {
    const student = students.find((studentItem) => studentItem.id === item.studentId);

    return {
      ...item,
      studentName: student?.name || 'Unknown Student'
    };
  });

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'subject', label: 'Subject' },
    { key: 'examType', label: 'Exam Type' },
    { key: 'marksObtained', label: 'Marks' },
    { key: 'maxMarks', label: 'Max Marks' },
    { key: 'semester', label: 'Semester' }
  ];

  return (
    <div className="content-grid">
      <SectionCard title="Add Marks" subtitle="Store assessment data for report generation">
        <form className="simple-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <select name="studentId" value={formData.studentId} onChange={handleChange}>
              {students.length === 0 ? <option value="">No students available</option> : null}
              {students.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
            <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
            <select name="examType" value={formData.examType} onChange={handleChange}>
              <option value="Internal">Internal</option>
              <option value="Midsem">Midsem</option>
              <option value="Practical">Practical</option>
              <option value="Final">Final</option>
            </select>
            <input name="marksObtained" type="number" value={formData.marksObtained} onChange={handleChange} placeholder="Marks obtained" required />
            <input name="maxMarks" type="number" value={formData.maxMarks} onChange={handleChange} placeholder="Max marks" required />
            <input name="semester" type="number" value={formData.semester} onChange={handleChange} placeholder="Semester" required />
          </div>
          <button type="submit" className="primary-button" disabled={students.length === 0}>Save Marks</button>
        </form>
      </SectionCard>

      <SectionCard title="Marks History" subtitle="Recent academic entries">
        <DataTable columns={columns} rows={rows} />
      </SectionCard>
    </div>
  );
}
