

import { useState, useRef, useEffect } from "react";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste! Main Hoshi hoon. Kaise madad karun?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    }
    setLoading(false);
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-content">
          <img src="/vite.svg" alt="logo" className="logo" />
          <span className="app-title">OtakuSage Chat</span>
        </div>
      </header>
      <main className="app-main">
        <div className="chat-container">
          <div ref={chatRef} className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "chat-row user" : "chat-row assistant"}>
                <div className="chat-bubble-row">
                  {m.role === "assistant" && (
                    <span className="avatar assistant-avatar">
                      <img src="/src/assets/react.svg" alt="assistant" className="avatar-img" />
                    </span>
                  )}
                  <div className={m.role === "user" ? "chat-bubble user-bubble" : "chat-bubble assistant-bubble"}>
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <span className="avatar user-avatar">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#6366f1"/><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#fff">U</text></svg>
                    </span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-row assistant">
                <div className="chat-bubble-row">
                  <span className="avatar assistant-avatar">
                    <img src="/src/assets/react.svg" alt="assistant" className="avatar-img" />
                  </span>
                  <div className="chat-bubble assistant-bubble loading-bubble">...</div>
                </div>
              </div>
            )}
          </div>
          <div className="chat-input-bar">
            <form className="chat-form" onSubmit={e => { e.preventDefault(); send(); }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                className="chat-input"
                placeholder="Type a message..."
                onKeyDown={e => { if (e.key === "Enter") send(); }}
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                className={`send-btn${loading ? " loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" fill="none"/></svg>
                ) : (
                  <span>Send</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
