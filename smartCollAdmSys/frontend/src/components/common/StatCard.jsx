// This card is used for quick dashboard numbers.
export default function StatCard({ title, value, note }) {
  return (
    <div className="stat-card">
      <p className="stat-card__title">{title}</p>
      <h3 className="stat-card__value">{value}</h3>
      <p className="stat-card__note">{note}</p>
    </div>
  );
}
