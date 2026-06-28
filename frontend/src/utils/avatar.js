// Local (inline) default avatar — no third-party image services.
export const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='320'>" +
      "<rect width='240' height='320' fill='#fdf3da'/>" +
      "<circle cx='120' cy='118' r='58' fill='#7a1224'/>" +
      "<path d='M40 300c0-56 36-96 80-96s80 40 80 96z' fill='#7a1224'/>" +
      "<text x='120' y='314' font-family='Arial' font-size='14' fill='#fff' text-anchor='middle'>No Photo</text>" +
      "</svg>"
  );

/** Returns a profile's DB photo (data URL) or the local default. */
export function photoOf(p) {
  return p && p.photo ? p.photo : DEFAULT_AVATAR;
}
