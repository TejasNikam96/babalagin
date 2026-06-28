import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authHeader, clearAuth } from './adminAuth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const logout = useCallback(() => {
    clearAuth();
    navigate('/admin/login');
  }, [navigate]);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payment', { headers: authHeader() });
      if (res.status === 401 || res.status === 403) {
        logout();
        return;
      }
      if (!res.ok) {
        setError(`Failed to load payments (status ${res.status}).`);
        return;
      }
      const data = await res.json();
      // newest first
      data.sort((a, b) => (b.id || 0) - (a.id || 0));
      setPayments(data);
    } catch (e) {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const updateStatus = async (id, status) => {
    const note = window.prompt(`Optional note for marking #${id} ${status}:`, '') || '';
    setBusyId(id);
    try {
      const res = await fetch(`/api/payment/${id}/status`, {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      });
      if (res.status === 401 || res.status === 403) {
        logout();
        return;
      }
      if (!res.ok) {
        alert(`Update failed (status ${res.status}).`);
        return;
      }
      await loadPayments();
    } catch (e) {
      alert('Could not reach the server.');
    } finally {
      setBusyId(null);
    }
  };

  const viewScreenshot = async (id) => {
    try {
      const res = await fetch(`/api/payment/${id}/screenshot`, { headers: authHeader() });
      if (!res.ok) {
        alert('No screenshot available.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e) {
      alert('Could not load screenshot.');
    }
  };

  const badge = (status) => {
    const map = {
      VERIFIED: '#1b7a3d',
      REJECTED: '#b71c1c',
      PENDING_VERIFICATION: '#b8860b',
    };
    return {
      background: map[status] || '#666',
      color: '#fff',
      padding: '3px 9px',
      borderRadius: 12,
      fontSize: 12,
      whiteSpace: 'nowrap',
    };
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h1 style={{ margin: 0, color: '#3a0613', fontSize: 20 }}>Payments</h1>
        <button style={styles.refreshBtn} onClick={loadPayments}>Refresh</button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <p style={{ padding: 24 }}>Loading…</p>
      ) : payments.length === 0 ? (
        <p style={{ padding: 24 }}>No payments submitted yet.</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['ID', 'Reg. ID', 'Transaction', 'UPI', 'Amount', 'Status', 'Note', 'Created', 'Screenshot', 'Actions']
                  .map((h) => <th key={h} style={styles.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} style={styles.tr}>
                  <td style={styles.td}>{p.id}</td>
                  <td style={styles.td}>{p.registrationId}</td>
                  <td style={styles.td}>{p.transactionId}</td>
                  <td style={styles.td}>{p.upiId}</td>
                  <td style={styles.td}>₹{p.amount}</td>
                  <td style={styles.td}><span style={badge(p.status)}>{p.status}</span></td>
                  <td style={styles.td}>{p.statusNote || '—'}</td>
                  <td style={styles.td}>{p.createdAt ? p.createdAt.replace('T', ' ').slice(0, 19) : ''}</td>
                  <td style={styles.td}>
                    {p.screenshotFilename
                      ? <button style={styles.linkBtn} onClick={() => viewScreenshot(p.id)}>View</button>
                      : '—'}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.actionBtn, background: '#1b7a3d' }}
                      disabled={busyId === p.id || p.status === 'VERIFIED'}
                      onClick={() => updateStatus(p.id, 'VERIFIED')}
                    >
                      Verify
                    </button>
                    <button
                      style={{ ...styles.actionBtn, background: '#b71c1c' }}
                      disabled={busyId === p.id || p.status === 'REJECTED'}
                      onClick={() => updateStatus(p.id, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif', background: '#f4f5f7', minHeight: '100vh' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 24px', background: '#3a0613', color: '#fff',
  },
  title: { margin: 0, fontSize: 20 },
  refreshBtn: {
    marginRight: 10, padding: '8px 14px', background: '#f0b429', color: '#3a0613',
    border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold',
  },
  logoutBtn: {
    padding: '8px 14px', background: 'transparent', color: '#fff',
    border: '1px solid #fff', borderRadius: 6, cursor: 'pointer',
  },
  error: { background: '#fdecea', color: '#b71c1c', padding: '10px 16px', margin: 16, borderRadius: 6 },
  tableWrap: { padding: 16, overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  th: { textAlign: 'left', padding: '10px 12px', background: '#fbeec9', color: '#3a0613', fontSize: 13, borderBottom: '2px solid #f0e4c8' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '10px 12px', fontSize: 13, color: '#333', verticalAlign: 'middle' },
  linkBtn: { background: 'none', border: 'none', color: '#1a5dab', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: 13 },
  actionBtn: {
    color: '#fff', border: 'none', borderRadius: 5, padding: '6px 10px',
    marginRight: 6, cursor: 'pointer', fontSize: 12,
  },
};
