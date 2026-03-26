// This report preview shows both English and Hindi comments clearly.
export default function ReportPreview({ report }) {
  if (!report) {
    return (
      <div className="report-preview report-preview--empty">
        <p>Select a student and generate a report to see the result here.</p>
      </div>
    );
  }

  return (
    <div className="report-preview">
      <div className="report-preview__header">
        <h4>{report.studentName}</h4>
        <span>Generated report</span>
      </div>
      <div className="report-preview__content">
        <div>
          <p className="report-preview__label">English</p>
          <p>{report.englishComment}</p>
        </div>
        <div>
          <p className="report-preview__label">Hindi</p>
          <p>{report.hindiComment}</p>
        </div>
      </div>
    </div>
  );
}
