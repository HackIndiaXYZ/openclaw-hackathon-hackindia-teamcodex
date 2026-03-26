const baseNavItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'students', label: 'Students' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'marks', label: 'Marks' },
  { id: 'reports', label: 'Reports' }
];

export default function Sidebar({ activePage, setActivePage, onLogout, currentUser }) {
  const canAccessAdmin = currentUser?.role === 'admin' || currentUser?.role === 'dean';
  const navItems = canAccessAdmin ? [...baseNavItems, { id: 'admin', label: 'Admin' }] : baseNavItems;

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">E</div>
        <div>
          <h2>EduTrack</h2>
          <p>See. Analyze. Alert.</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={activePage === item.id ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button className="sidebar__logout" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}
