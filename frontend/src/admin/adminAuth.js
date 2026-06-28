// Admin auth state. The server issues a session token (X-Auth-Token) at login
// with a 30-minute idle timeout enforced server-side. We keep the token plus the
// server instance id (to detect a restart) in sessionStorage.

const TOKEN_KEY = "adminToken";
const INSTANCE_KEY = "adminInstance";

export function saveAuth(token, instanceId) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  if (instanceId) sessionStorage.setItem(INSTANCE_KEY, instanceId);
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getInstanceId() {
  return sessionStorage.getItem(INSTANCE_KEY);
}

/** Header sent on every admin API request. */
export function authHeader() {
  const t = getToken();
  return t ? { "X-Auth-Token": t } : {};
}

export function clearAuth() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(INSTANCE_KEY);
}

/** Tells the server to drop the session, then clears local state. */
export function logoutServer() {
  const t = getToken();
  if (t) {
    try {
      fetch("/api/admin/logout", { method: "POST", headers: { "X-Auth-Token": t } });
    } catch (_) { /* ignore */ }
  }
  clearAuth();
}

/** Logged in only if a token is present (server is the real authority). */
export function isLoggedIn() {
  return !!getToken();
}
