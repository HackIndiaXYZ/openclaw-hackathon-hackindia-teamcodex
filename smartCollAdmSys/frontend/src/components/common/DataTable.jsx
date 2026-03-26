import Badge from './Badge';

// This simple table is reused across students, attendance and marks pages.
export default function DataTable({ columns, rows }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-row">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => {
                  const value = row[column.key];

                  if (typeof column.render === 'function') {
                    return <td key={column.key}>{column.render(row)}</td>;
                  }

                  if (column.type === 'badge') {
                    const tone = value === 'At Risk' ? 'danger' : value === 'On Track' ? 'success' : 'neutral';
                    return (
                      <td key={column.key}>
                        <Badge label={value} tone={tone} />
                      </td>
                    );
                  }

                  return <td key={column.key}>{value}</td>;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
