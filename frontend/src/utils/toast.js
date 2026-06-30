// Tiny global toast bus — call toast("msg") from anywhere (components or utils).
// A single <ToastContainer/> (mounted in WebRoutes) renders them.
export const TOAST_EVENT = "app-toast";

export function toast(message, type = "info") {
  if (typeof window === "undefined" || !message) return;
  const id = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { id, message, type } }));
}
