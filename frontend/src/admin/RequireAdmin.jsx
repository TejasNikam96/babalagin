import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { isLoggedIn, getToken, getInstanceId, clearAuth } from './adminAuth';

/**
 * Route guard for admin pages. The 30-minute idle timeout is enforced by the
 * server (the session token expires after inactivity and a restart wipes it);
 * this component:
 *  - polls GET /api/session/validate and logs out on 401 (idle/restart),
 *  - sends a heartbeat on real user activity to extend the window,
 *  - also catches a restart via the server instance id.
 */
export default function RequireAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) return;

    const forceLogout = () => { clearAuth(); navigate('/admin/login', { replace: true }); };

    const validate = () => {
      const token = getToken();
      if (!token) { forceLogout(); return; }
      fetch('/api/session/validate', { headers: { 'X-Auth-Token': token } })
        .then((r) => { if (r.status === 401) forceLogout(); })
        .catch(() => { /* network blip: leave as-is */ });
    };

    // Backend restart check (instance id changed -> session is gone anyway).
    fetch('/api/login/server-info')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d && getInstanceId() && d.instanceId !== getInstanceId()) forceLogout(); })
      .catch(() => {});

    validate();
    const timer = setInterval(validate, 60 * 1000);

    // Sliding window: heartbeat on activity (throttled to once per 60s).
    let last = 0;
    const onActivity = () => {
      const now = Date.now();
      const token = getToken();
      if (token && now - last > 60 * 1000) {
        last = now;
        fetch('/api/session/heartbeat', { method: 'POST', headers: { 'X-Auth-Token': token } })
          .then((r) => { if (r.status === 401) forceLogout(); })
          .catch(() => {});
      }
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    return () => {
      clearInterval(timer);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [navigate]);

  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
