import { Avatar, Chip, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

export default function Header({ title, subtitle, user, themeMode, onToggleTheme }) {
  return (
    <header className="page-header">
      <div>
        <div className="page-header__eyebrowRow">
          <Chip
            size="small"
            color="secondary"
            label="Smart College Admin System"
            icon={<FontAwesomeIcon icon={faBolt} />}
            className="page-header__eyebrowChip"
          />
        </div>
        <Typography variant="h3" component="h1">{title}</Typography>
        <Typography className="page-header__subtitle">{subtitle}</Typography>
      </div>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <Tooltip title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <IconButton className="theme-toggle-button" onClick={onToggleTheme} color="primary">
            {themeMode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
          </IconButton>
        </Tooltip>

        <Paper elevation={0} className="page-header__userCard">
          <Avatar className="page-header__avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</Avatar>
          <div>
            <Typography fontWeight={700}>{user?.name || 'User'}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.role || 'Professor'}</Typography>
          </div>
        </Paper>
      </Stack>
    </header>
  );
}

