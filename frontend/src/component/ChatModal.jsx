import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Chat window for two accepted-connected profiles.
 * Layout per requirement: the message input box is on top, the chat history
 * is shown below it (most recent first). Polls for new messages while open.
 */
export default function ChatModal({ me, other, otherName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const load = useCallback(() => {
    fetch(`/api/messages?code=${encodeURIComponent(me)}&withCode=${encodeURIComponent(other)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => { if (mounted.current) setMessages(Array.isArray(data) ? data : []); })
      .catch(() => { /* keep existing on transient error */ })
      .finally(() => { if (mounted.current) setLoading(false); });
  }, [me, other]);

  useEffect(() => {
    mounted.current = true;
    load();
    const id = setInterval(load, 5000); // light polling while open
    return () => { mounted.current = false; clearInterval(id); };
  }, [load]);

  const send = (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setSending(true);
    setError("");
    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromCode: me, toCode: other, content }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(() => { setText(""); load(); })
      .catch(() => setError("Could not send. The connection may have been removed."))
      .finally(() => setSending(false));
  };

  const fmt = (s) => {
    if (!s) return "";
    try { return new Date(s).toLocaleString(); } catch (_) { return String(s); }
  };

  // Show only the last 20 messages in the popup (most recent first).
  const history = [...messages].slice(-20).reverse();

  // Download the FULL chat (all messages) as a printable transcript (Save as PDF).
  const downloadChat = () => {
    if (!messages.length) { setError("No messages to download yet."); return; }
    const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    const rows = messages.map((m) => {
      const who = m.fromCode === me ? "You" : (otherName || m.fromCode);
      const mine = m.fromCode === me;
      return `<div class="row ${mine ? "me" : "them"}"><div class="meta">${esc(who)} · ${esc(fmt(m.createdDate))}</div><div class="bubble">${esc(m.content)}</div></div>`;
    }).join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Chat with ${esc(otherName || other)}</title>
      <style>
        *{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;margin:0;color:#222}
        .header{background:#6B0F2B;color:#fff;padding:16px 24px}
        .brand{font-size:11px;letter-spacing:2px;color:#F2C14E;text-transform:uppercase}
        .title{font-size:20px;font-weight:bold;margin-top:2px}
        .sub{font-size:11px;color:#f5d9b0;margin-top:2px}
        .content{padding:18px 24px}
        .row{margin-bottom:10px;max-width:80%}
        .row.me{margin-left:auto;text-align:right}
        .meta{font-size:10px;color:#888;margin-bottom:2px}
        .bubble{display:inline-block;padding:8px 12px;border-radius:12px;font-size:13px;white-space:pre-wrap;word-break:break-word}
        .me .bubble{background:#6B0F2B;color:#fff}
        .them .bubble{background:#eee;color:#222}
      </style></head>
      <body>
        <div class="header">
          <div class="brand">BABA LAGIN Messages</div>
          <div class="title">Chat with ${esc(otherName || other)}</div>
          <div class="sub">${messages.length} message(s)</div>
        </div>
        <div class="content">${rows}</div>
        <script>window.onload=function(){window.focus();window.print();};window.onafterprint=function(){window.close();};</script>
      </body></html>`;
    const w = window.open("", "_blank");
    if (!w) { setError("Please allow pop-ups to download the chat."); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1200]" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-br from-[#6B0F2B] to-[#8B1538] text-white px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-amber-200/90">Messages</p>
            <h3 className="font-bold">{otherName || other}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={downloadChat}
              title="Download full chat"
              aria-label="Download full chat"
              className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/15 text-white/90 text-base"
            >
              ⬇
            </button>
            <button onClick={onClose} aria-label="Close" className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/15 text-white/90 text-2xl leading-none">×</button>
          </div>
        </div>

        {/* Input box on top */}
        <form onSubmit={send} className="p-4 border-b border-gray-100">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(e); } }}
            placeholder={`Write a message to ${otherName || "this profile"}…`}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017] resize-none"
          />
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="bg-[#6B0F2B] hover:bg-[#8B1538] text-white text-sm font-semibold px-5 py-2 rounded-full disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </form>

        {/* Chat history below the input box */}
        <div className="px-4 py-3 max-h-[50vh] overflow-y-auto bg-[#FAF7F0] space-y-2">
          {messages.length > 20 && (
            <p className="text-center text-[11px] text-gray-500 mb-1">
              Showing last 20 of {messages.length} messages · use ⬇ to download the full chat
            </p>
          )}
          {loading ? (
            <p className="text-center text-sm text-gray-400 py-6">Loading…</p>
          ) : history.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">No messages yet. Say hello 👋</p>
          ) : (
            history.map((m) => {
              const mine = m.fromCode === me;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${mine ? "bg-[#6B0F2B] text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"}`}>
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    <p className={`text-[10px] mt-1 ${mine ? "text-amber-200/80" : "text-gray-400"}`}>{fmt(m.createdDate)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
