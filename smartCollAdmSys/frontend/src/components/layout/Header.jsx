// The top bar gives page context without making the UI crowded.
export default function Header({ title, subtitle, user }) {
  return (
    <header className="page-header">
      <div>
        <p className="page-header__eyebrow">Smart College Admin System</p>
        <h1>{title}</h1>
        <p className="page-header__subtitle">{subtitle}</p>
      </div>
      <div className="page-header__user">
        <span>{user?.name || 'User'}</span>
        <small>{user?.role || 'Professor'}</small>
      </div>
    </header>
  );
}
