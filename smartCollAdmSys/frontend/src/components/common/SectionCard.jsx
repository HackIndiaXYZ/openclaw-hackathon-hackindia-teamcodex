import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';

export default function SectionCard({ title, subtitle, children, action }) {
  return (
    <Card className="section-card" elevation={0}>
      <CardContent>
        <Stack spacing={2}>
          <div className="section-card__header">
            <div>
              <Typography variant="h6" fontWeight={700}>{title}</Typography>
              {subtitle ? <Typography variant="body2" color="text.secondary">{subtitle}</Typography> : null}
            </div>
            {action ? <div>{action}</div> : null}
          </div>
          <Divider className="section-card__divider" />
          <div className="section-card__body">{children}</div>
        </Stack>
      </CardContent>
    </Card>
  );
}
