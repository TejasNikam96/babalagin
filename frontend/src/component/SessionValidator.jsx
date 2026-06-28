import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Slices/authSlice";

/**
 * Guards the logged-in profile session. The 30-minute idle timeout is enforced
 * by the server (the session token expires after inactivity and a restart wipes
 * it). This component:
 *  - polls GET /api/session/validate and logs out on 401 (idle / restart),
 *  - sends a heartbeat on real user activity to extend the window,
 *  - also catches a restart via the stored server instance id.
 */
export default function SessionValidator() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  // Restart check (runs once on mount).
  useEffect(() => {
    if (!user) return;
    fetch("/api/login/server-info")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || !user.serverInstanceId || d.instanceId !== user.serverInstanceId) {
          dispatch(logout());
        }
      })
      .catch(() => { /* network issue: leave as-is */ });
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Server-side idle validation + heartbeat.
  useEffect(() => {
    const validate = () => {
      const u = userRef.current;
      if (!u) return;
      if (!u.token) { return; } // legacy session without a token; restart check covers it
      fetch("/api/session/validate", { headers: { "X-Auth-Token": u.token } })
        .then((r) => { if (r.status === 401) dispatch(logout()); })
        .catch(() => {});
    };

    validate();
    const timer = setInterval(validate, 60 * 1000);

    let last = 0;
    const onActivity = () => {
      const u = userRef.current;
      const now = Date.now();
      if (u && u.token && now - last > 60 * 1000) {
        last = now;
        fetch("/api/session/heartbeat", { method: "POST", headers: { "X-Auth-Token": u.token } })
          .then((r) => { if (r.status === 401) dispatch(logout()); })
          .catch(() => {});
      }
    };
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    return () => {
      clearInterval(timer);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [dispatch]);

  return null;
}
