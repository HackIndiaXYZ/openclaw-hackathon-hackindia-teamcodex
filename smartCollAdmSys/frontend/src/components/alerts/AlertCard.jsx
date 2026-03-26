import Badge from '../common/Badge';

// This component shows one alert in a friendly card layout.
export default function AlertCard({ alert }) {
  const tone = alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'success';

  return (
    <div className="alert-card">
      <div className="alert-card__top">
        <div>
          <h4>{alert.title}</h4>
          <p>{alert.studentName}</p>
        </div>
        <Badge label={alert.severity} tone={tone} />
      </div>
      <p className="alert-card__message">{alert.message}</p>
    </div>
  );
}
