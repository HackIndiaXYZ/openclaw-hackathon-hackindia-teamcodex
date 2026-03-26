import { Chip, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartSimple,
  faUsers,
  faCameraRetro,
  faSquarePollVertical,
  faFileLines,
  faUserShield,
  faArrowRightFromBracket,
  faBolt
} from '@fortawesome/free-solid-svg-icons';

const baseNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: faChartSimple },
  { id: 'students', label: 'Students', icon: faUsers },
  { id: 'attendance', label: 'Attendance', icon: faCameraRetro },
  { id: 'marks', label: 'Marks', icon: faSquarePollVertical },
  { id: 'reports', label: 'Reports', icon: faFileLines }
];

export default function Sidebar({ activePage, setActivePage, onLogout, currentUser }) {
  const isAdminOnlyUser = currentUser?.role === 'admin';
  const canAccessAdmin = currentUser?.role === 'admin' || currentUser?.role === 'dean';
  const navItems = isAdminOnlyUser
    ? [{ id: 'admin', label: 'Admin Panel', icon: faUserShield }]
    : canAccessAdmin
      ? [...baseNavItems, { id: 'admin', label: 'Admin', icon: faUserShield }]
      : baseNavItems;

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <FontAwesomeIcon icon={faBolt} />
          </div>
          <div>
            <Typography variant="h5" fontWeight={700}>EduTrack</Typography>
            <Typography variant="body2" className="sidebar__brandText">See. Analyze. Alert.</Typography>
          </div>
        </div>

        <Chip size="small" label={currentUser?.role || 'Professor'} color="secondary" className="sidebar__roleChip" />

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activePage === item.id ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}
              onClick={() => setActivePage(item.id)}
            >
              <span className="sidebar__linkIcon"><FontAwesomeIcon icon={item.icon} /></span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <button className="sidebar__logout" onClick={onLogout}>
        <span className="sidebar__linkIcon"><FontAwesomeIcon icon={faArrowRightFromBracket} /></span>
        <span>Logout</span>
      </button>
    </aside>
  );
}
