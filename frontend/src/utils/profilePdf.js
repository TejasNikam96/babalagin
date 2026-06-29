// Shared "download profile as PDF" helper used by the View-Profile popup and the
// Single ID Search result. Opens a clean, branded print view (browser Save as
// PDF). Email and mobile are intentionally excluded from the document. All of
// the profile's photos are appended (large) after the details.
import { DEFAULT_AVATAR } from "./avatar";
import { fetchProfileImages } from "./images";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const prettyLabel = (k) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

function sectionHtml(heading, data, skip = [], extra = {}) {
  const rows = [];
  Object.entries(extra).forEach(([k, v]) => { if (v !== null && v !== "") rows.push([k, v]); });
  if (data) {
    Object.entries(data).forEach(([k, v]) => {
      if (skip.includes(k) || v === null || v === "" || typeof v === "object") return;
      rows.push([prettyLabel(k), String(v)]);
    });
  }
  if (!rows.length) return "";
  const cells = rows
    .map(([k, v]) => `<div class="row"><span class="k">${esc(k)}:</span> <span class="v">${esc(v)}</span></div>`)
    .join("");
  return `<h3>${esc(heading)}</h3><div class="grid">${cells}</div>`;
}

/**
 * Opens a print window for a profile and triggers print (Save as PDF). All of
 * the profile's photos are fetched and appended (large) after the details.
 * @param {object} detail full profile (registrationCode + personal/horoscope/... sections)
 * @param {string} [photoUrl] data URL for the header photo (falls back to detail.photo / default)
 * @returns {boolean} false if the popup was blocked
 */
export function downloadProfilePdf(detail, photoUrl) {
  if (!detail) return false;
  const d = detail;
  // Open the window synchronously (within the click) so it isn't pop-up blocked,
  // then fetch the images and write the document.
  const w = window.open("", "_blank");
  if (!w) return false;
  try { w.document.write("<p style='font-family:Arial;padding:24px;color:#6B0F2B'>Preparing profile…</p>"); } catch (_) {}

  const fullName = d.personal
    ? `${d.personal.firstName || ""} ${d.personal.lastName || ""}`.trim()
    : (d.registrationCode || "Profile");
  const heightStr = d.personal && d.personal.heightTotalInches != null
    ? `${Math.floor(d.personal.heightTotalInches / 12)}'${d.personal.heightTotalInches % 12}"` : null;

  const body =
    sectionHtml("Personal", d.personal,
      ["email", "mobile", "heightTotalInches", "heightFeet", "heightInches"],
      heightStr ? { Height: heightStr } : {}) +
    sectionHtml("Horoscope", d.horoscope) +
    sectionHtml("Education", d.education) +
    sectionHtml("Address", d.address) +
    sectionHtml("Family", d.family) +
    sectionHtml("Expectation", d.expectation);

  fetchProfileImages(d.registrationCode).then((imgs) => {
    const headerPhoto = photoUrl || (imgs && imgs[0]) || d.photo || DEFAULT_AVATAR;
    const gallery = (imgs && imgs.length)
      ? `<h3>Photos (${imgs.length})</h3><div class="gallery">`
        + imgs.map((u) => `<img class="photo" src="${u}" alt=""/>`).join("")
        + `</div>`
      : "";

    const html = `<!doctype html><html><head><meta charset="utf-8">
      <title>${esc(fullName)} - ${esc(d.registrationCode || "")}</title>
      <style>
        *{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;margin:0;color:#222}
        .header{background:#6B0F2B;color:#fff;padding:20px 28px;display:flex;align-items:center;gap:18px}
        .header img{width:96px;height:120px;object-fit:cover;border:2px solid #F2C14E;border-radius:8px;background:#3a0613}
        .brand{font-size:12px;letter-spacing:3px;color:#F2C14E;text-transform:uppercase}
        .name{font-size:24px;font-weight:bold;margin:2px 0}
        .meta{color:#f5d9b0;font-size:13px}
        .content{padding:22px 28px}
        h3{color:#7A2238;border-bottom:2px solid #f0e4c8;padding-bottom:4px;margin:18px 0 8px;font-size:15px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px}
        .row{font-size:13px}
        .k{color:#777}.v{color:#222;font-weight:600}
        .gallery{display:flex;flex-wrap:wrap;gap:12px}
        .photo{width:48%;max-height:520px;object-fit:contain;border:1px solid #eee;border-radius:8px;background:#faf7f0;page-break-inside:avoid}
        .foot{margin-top:26px;padding-top:10px;border-top:1px solid #eee;font-size:11px;color:#999;text-align:center}
      </style></head>
      <body>
        <div class="header">
          <img src="${headerPhoto}" alt=""/>
          <div>
            <div class="brand">BABA LAGIN Vadhu-Var Kendra</div>
            <div class="name">${esc(fullName)}</div>
            <div class="meta">${esc(d.registrationCode || "")} ${d.personal && d.personal.maritalStatus ? "&middot; " + esc(d.personal.maritalStatus) : ""}</div>
          </div>
        </div>
        <div class="content">${body}${gallery}
          <div class="foot">Generated from BABA LAGIN &middot; Contact details are shared only after an accepted connection.</div>
        </div>
        <script>
          function go(){ window.focus(); window.print(); }
          var imgs = document.images, left = imgs.length;
          window.onafterprint = function(){ window.close(); };
          if (!left) { go(); }
          else { for (var k=0;k<imgs.length;k++){ if(imgs[k].complete){ if(--left===0) go(); } else { imgs[k].onload = imgs[k].onerror = function(){ if(--left===0) go(); }; } } }
        </script>
      </body></html>`;

    try {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch (_) { /* window closed */ }
  });

  return true;
}
