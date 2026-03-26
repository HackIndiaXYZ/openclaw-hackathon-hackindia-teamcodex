import { Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faCircleCheck, faTriangleExclamation, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import SectionCard from '../components/common/SectionCard';
import StatCard from '../components/common/StatCard';
import AlertCard from '../components/alerts/AlertCard';

export default function Dashboard({ dashboardStats, alerts, students }) {
  const topStudents = students.slice(0, 3);
  const atRiskStudents = students.filter((student) => student.status === 'At Risk').length;
  const onTrackStudents = students.filter((student) => student.status === 'On Track').length;

  return (
    <div className="page-grid dashboard-premium">
      <SectionCard
        title="Today at a Glance"
        subtitle="A calmer, smarter view of your academic workflow with the most important movement highlighted first."
      >
        <div className="premium-hero-grid">
          <div className="premium-hero-card premium-hero-card--primary">
            <div className="premium-hero-card__icon"><FontAwesomeIcon icon={faArrowTrendUp} /></div>
            <Typography variant="h5" fontWeight={700}>Attendance momentum is steady</Typography>
            <Typography color="text.secondary">Current overall attendance is {dashboardStats.attendanceAverage}% across tracked students.</Typography>
            <LinearProgress variant="determinate" value={Math.min(dashboardStats.attendanceAverage, 100)} className="premium-progress" />
          </div>

          <div className="premium-chip-list">
            <Chip color="error" icon={<FontAwesomeIcon icon={faTriangleExclamation} />} label={`${atRiskStudents} at-risk students`} />
            <Chip color="success" icon={<FontAwesomeIcon icon={faCircleCheck} />} label={`${onTrackStudents} on-track students`} />
            <Chip color="secondary" icon={<FontAwesomeIcon icon={faWandMagicSparkles} />} label={`${dashboardStats.reportsGenerated} reports generated`} />
          </div>
        </div>
      </SectionCard>

      <div className="stats-grid">
        <StatCard title="Total Students" value={dashboardStats.totalStudents} note="Active student records" />
        <StatCard title="Attendance Avg" value={`${dashboardStats.attendanceAverage}%`} note="Current overall attendance" />
        <StatCard title="Active Alerts" value={dashboardStats.alertCount} note="Students needing attention" />
        <StatCard title="Reports Generated" value={dashboardStats.reportsGenerated} note="Bilingual AI-style comments" />
      </div>

      <div className="content-grid">
        <SectionCard title="Priority Alerts" subtitle="Students who need follow-up right now">
          <div className="alerts-list">
            {alerts.length ? alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />) : <p className="inline-note">No active alerts right now. Your classroom is looking healthy.</p>}
          </div>
        </SectionCard>

        <SectionCard title="Student Spotlight" subtitle="Quick performance snapshots with the strongest classroom signals">
          <div className="spotlight-list">
            {topStudents.length ? topStudents.map((student) => (
              <div key={student.id} className="spotlight-item premium-spotlight-item">
                <div>
                  <h4>{student.name}</h4>
                  <p>{student.rollNumber} • {student.department}</p>
                </div>
                <div className="spotlight-item__meta">
                  <span>{student.attendancePercentage}% attendance</span>
                  <strong>{student.marksAverage}% marks</strong>
                </div>
              </div>
            )) : <p className="inline-note">Add a few students and marks to see spotlight insights here.</p>}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
