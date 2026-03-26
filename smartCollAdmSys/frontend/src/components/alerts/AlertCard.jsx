import { Card, CardContent, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Badge from '../common/Badge';

export default function AlertCard({ alert }) {
  const tone = alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'success';

  return (
    <Card className="alert-card" elevation={0}>
      <CardContent>
        <Stack spacing={1.5}>
          <div className="alert-card__top">
            <div>
              <Typography variant="subtitle1" fontWeight={700}>
                <FontAwesomeIcon icon={alert.severity === 'high' ? faTriangleExclamation : faBell} className="alert-card__icon" /> {alert.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">{alert.studentName}</Typography>
            </div>
            <Badge label={alert.severity} tone={tone} />
          </div>
          <Typography className="alert-card__message">{alert.message}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
