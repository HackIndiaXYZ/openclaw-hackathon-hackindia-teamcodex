// This badge helps us show status in a clean visual way.
export default function Badge({ label, tone = 'neutral' }) {
  return <span className={`badge badge--${tone}`}>{label}</span>;
}
