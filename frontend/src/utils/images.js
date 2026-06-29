// Fetches all profile images (data URLs, newest first) for a registration code.
export async function fetchProfileImages(code) {
  if (!code) return [];
  try {
    const r = await fetch(`/api/documents/images?registrationCode=${encodeURIComponent(code)}`);
    if (!r.ok) return [];
    const data = await r.json();
    return (data || []).map((d) => d.dataUrl).filter(Boolean);
  } catch (_) {
    return [];
  }
}
