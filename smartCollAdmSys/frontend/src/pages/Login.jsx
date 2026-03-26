import { useState } from 'react';

// This page supports both login and registration so the backend can be used immediately.
export default function Login({ onLogin, onRegister, authLoading, errorMessage }) {
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

    await onLogin({
      email: formData.email,
      password: formData.password
    });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__hero">
          <span className="hero-badge">Hackathon MVP</span>
          <h1>EduTrack</h1>
          <p>
            Smart attendance, smart reports, and a calmer workflow for professors.
          </p>
          <div className="login-tip-box">
            <strong>First time here?</strong>
            <p>Create a professor account using register mode, then start adding students.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="mode-switch">
            <button
              type="button"
              className={mode === 'login' ? 'mode-switch__button mode-switch__button--active' : 'mode-switch__button'}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'mode-switch__button mode-switch__button--active' : 'mode-switch__button'}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          {mode === 'register' ? (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
          ) : null}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          {mode === 'register' ? (
            <div className="form-grid">
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="professor">Professor</option>
                <option value="admin">Admin</option>
                <option value="dean">Dean</option>
              </select>
              <input
                name="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
              />
            </div>
          ) : null}

          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

          <button type="submit" className="primary-button primary-button--full" disabled={authLoading}>
            {authLoading ? 'Please wait...' : mode === 'login' ? 'Enter Dashboard' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
