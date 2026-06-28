import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAuth } from './adminAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 401) {
        setError('Invalid username or password.');
        return;
      }
      if (res.status === 403) {
        setError('This account is not an administrator.');
        return;
      }
      if (!res.ok) {
        setError('Login failed. Please try again.');
        return;
      }
      const data = await res.json();
      // Store the server session token + instance id (restart invalidates it).
      saveAuth(data.token, data.instanceId);
      navigate('/admin');
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Admin Login</h1>
        <p style={styles.subtitle}>Sign in to manage registrations &amp; payments</p>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #3a0613 0%, #7a1224 100%)',
    fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
  card: {
    background: '#fff',
    padding: '36px 32px',
    borderRadius: 12,
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    width: 360,
    maxWidth: '90%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: { margin: '0 0 4px', color: '#3a0613', fontSize: 24, textAlign: 'center' },
  subtitle: { margin: '0 0 22px', color: '#888', fontSize: 13, textAlign: 'center' },
  label: { fontSize: 13, color: '#555', marginBottom: 6 },
  input: {
    padding: '11px 12px',
    marginBottom: 16,
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 15,
  },
  button: {
    padding: 12,
    background: '#f0b429',
    color: '#3a0613',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: 4,
  },
  error: {
    background: '#fdecea',
    color: '#b71c1c',
    padding: '10px 12px',
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 14,
  },
};
