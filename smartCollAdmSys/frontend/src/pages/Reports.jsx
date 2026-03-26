import { useEffect, useMemo, useState } from 'react';
import SectionCard from '../components/common/SectionCard';
import ReportPreview from '../components/reports/ReportPreview';

export default function Reports({ students, reports, onGenerateReport }) {
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  const latestReport = useMemo(() => {
    return reports.find((report) => report.studentId === selectedStudentId) || null;
  }, [reports, selectedStudentId]);

  const handleGenerate = async () => {
    if (!selectedStudentId) {
      return;
    }

    await onGenerateReport(selectedStudentId);
  };

  return (
    <div className="content-grid reports-grid">
      <SectionCard title="Generate Report" subtitle="Create bilingual report comments in one click">
        <div className="report-controls">
          <select value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)}>
            {students.length === 0 ? <option value="">No students available</option> : null}
            {students.map((student) => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>
          <button className="primary-button" onClick={handleGenerate} disabled={students.length === 0}>Generate Report</button>
        </div>
      </SectionCard>

      <SectionCard title="Report Result" subtitle="English and Hindi output">
        <ReportPreview report={latestReport} />
      </SectionCard>
    </div>
  );
}
