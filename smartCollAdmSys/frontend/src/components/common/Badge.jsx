import { Chip } from '@mui/material';

export default function Badge({ label, tone = 'neutral' }) {
  const colorMap = {
    danger: 'error',
    warning: 'warning',
    success: 'success',
    neutral: 'default'
  };

  return <Chip label={label} color={colorMap[tone] || 'default'} size="small" variant={tone === 'neutral' ? 'outlined' : 'filled'} />;
}
