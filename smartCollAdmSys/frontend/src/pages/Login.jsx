import { useState } from 'react';
import { Box, Button, Chip, IconButton, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro, faBrain, faBolt } from '@fortawesome/free-solid-svg-icons';

export default function Login({ onLogin, onRegister, authLoading, errorMessage, themeMode, onToggleTheme }) {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: 'professor@edutrack.com',
    password: '123456',
    role: 'professor',
    department: 'Computer Science'
  });

  const handleChange = (event) => {
    setFormData((previousData) => ({
      ...previousData,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === 'register') {
      await onRegister(formData);
      return;
    }

    await onLogin({ email: formData.email, password: formData.password });
  };

  return (
    <div className="login-page">
      <Paper className="login-card" elevation={0}>
        <div className="login-card__hero">
          <div className="login-card__topbar">
            <Chip label="Hackathon Ready" color="secondary" className="hero-badge" />
            <IconButton className="theme-toggle-button login-theme-toggle" onClick={onToggleTheme} color="inherit">
              {themeMode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
            </IconButton>
          </div>

          <div className="login-hero__logo">
            <FontAwesomeIcon icon={faBolt} />
          </div>
          <Typography variant="h1">EduTrack</Typography>
          <Typography className="login-card__heroText">
            Smart attendance, smoother admin workflows, and bilingual reports for modern colleges.
          </Typography>

          <div className="hero-feature-list">
            <div className="hero-feature-item"><FontAwesomeIcon icon={faCameraRetro} /><span>OpenCV powered recognition</span></div>
            <div className="hero-feature-item"><FontAwesomeIcon icon={faBrain} /><span>AI-style reports in Hindi and English</span></div>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <div className="mode-switch">
              <button type="button" className={mode === 'login' ? 'mode-switch__button mode-switch__button--active' : 'mode-switch__button'} onClick={() => setMode('login')}>Login</button>
              <button type="button" className={mode === 'register' ? 'mode-switch__button mode-switch__button--active' : 'mode-switch__button'} onClick={() => setMode('register')}>Register</button>
            </div>

            {mode === 'register' ? <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth /> : null}
            <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth />
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth />

            {mode === 'register' ? (
              <Box className="form-grid">
                <TextField select label="Role" name="role" value={formData.role} onChange={handleChange} fullWidth>
                  <MenuItem value="professor">Professor</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="dean">Dean</MenuItem>
                </TextField>
                <TextField label="Department" name="department" value={formData.department} onChange={handleChange} fullWidth />
              </Box>
            ) : null}

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <Button type="submit" variant="contained" size="large" className="primary-button primary-button--full" disabled={authLoading}>
              {authLoading ? 'Please wait...' : mode === 'login' ? 'Enter Dashboard' : 'Create Account'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </div>
  );
}
