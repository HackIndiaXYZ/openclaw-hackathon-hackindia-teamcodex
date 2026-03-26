import { Card, CardContent, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTriangleExclamation, faChartLine, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  'Total Students': faUsers,
  'Active Alerts': faTriangleExclamation,
  'Attendance Avg': faChartLine,
  'Reports Generated': faWandMagicSparkles,
  'Faculty Users': faUsers,
  'Students': faUsers,
  'Subjects': faChartLine,
  'Assignments': faWandMagicSparkles
};

export default function StatCard({ title, value, note }) {
  return (
    <Card className="stat-card" elevation={0}>
      <CardContent>
        <div className="stat-card__iconWrap">
          <FontAwesomeIcon icon={iconMap[title] || faChartLine} />
        </div>
        <Typography className="stat-card__title">{title}</Typography>
        <Typography className="stat-card__value">{value}</Typography>
        <Typography className="stat-card__note">{note}</Typography>
      </CardContent>
    </Card>
  );
}
