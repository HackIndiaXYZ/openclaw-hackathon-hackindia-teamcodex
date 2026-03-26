import SectionCard from '../components/common/SectionCard';
import StatCard from '../components/common/StatCard';
import AlertCard from '../components/alerts/AlertCard';

// This page gives a quick summary of the system in one view.
export default function Dashboard({ dashboardStats, alerts, students }) {
  const topStudents = students.slice(0, 3);

  return (
    <div className="page-grid">
      <div className="stats-grid">
        <StatCard title="Total Students" value={dashboardStats.totalStudents} note="Active student records" />
        <StatCard title="Attendance Avg" value={`${dashboardStats.attendanceAverage}%`} note="Current overall attendance" />
        <StatCard title="Active Alerts" value={dashboardStats.alertCount} note="Students needing attention" />
        <StatCard title="Reports Generated" value={dashboardStats.reportsGenerated} note="Bilingual AI-style comments" />
      </div>

      <div className="content-grid">
        <SectionCard title="Priority Alerts" subtitle="Students who need follow-up right now">
          <div className="alerts-list">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Student Spotlight" subtitle="Quick status check for your classroom">
          <div className="spotlight-list">
            {topStudents.map((student) => (
              <div key={student.id} className="spotlight-item">
                <div>
                  <h4>{student.name}</h4>
                  <p>{student.rollNumber} • {student.department}</p>
                </div>
                <div className="spotlight-item__meta">
                  <span>{student.attendancePercentage}% attendance</span>
                  <strong>{student.marksAverage}% marks</strong>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
