import React, { useState } from "react";
import { MessageSquareHeart, Send } from "lucide-react";
import { STAMPS } from "../utils/mockData";
import confetti from "canvas-confetti";

export default function ReactionCenter({ profiles, reactions, onSendReaction }) {
  const [sender, setSender] = useState("husband");
  const [selectedStamp, setSelectedStamp] = useState(STAMPS[0].id);
  const [message, setMessage] = useState("");

  const receiver = sender === "husband" ? "wife" : "husband";

  const handleSend = (e) => {
    e.preventDefault();
    const stampObj = STAMPS.find(s => s.id === selectedStamp);
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });

    onSendReaction({
      id: `react-${Date.now()}`,
      from: sender,
      to: receiver,
      stampId: selectedStamp,
      timestamp: new Date().toISOString(),
      message: message.trim() || stampObj.text
    });

    setMessage("");
  };

  return (
    <div>
      {/* スタンプ送信カード */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <MessageSquareHeart size={24} style={{ color: "var(--accent-pink)" }} />
            <span>ほめ合いスタンプを送る</span>
          </div>
        </div>

        {/* 送信者の選択 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", background: "rgba(255,255,255,0.05)", padding: "0.6rem 0.9rem", borderRadius: "var(--radius-md)" }}>
          <span style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontWeight: 800 }}>誰から送る？</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setSender("husband")}
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: sender === "husband" ? "var(--gradient-husband)" : "rgba(255,255,255,0.08)",
                color: sender === "husband" ? "#fff" : "var(--text-secondary)",
                fontSize: "0.95rem",
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              👨‍💻 パパから
            </button>
            <button
              type="button"
              onClick={() => setSender("wife")}
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: sender === "wife" ? "var(--gradient-wife)" : "rgba(255,255,255,0.08)",
                color: sender === "wife" ? "#fff" : "var(--text-secondary)",
                fontSize: "0.95rem",
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              👩‍🎨 ママから
            </button>
          </div>
        </div>

        {/* スタンプ選択グリッド */}
        <label style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
          スタンプを選ぶ
        </label>
        <div className="stamp-grid">
          {STAMPS.map(stamp => {
            const isSelected = selectedStamp === stamp.id;
            return (
              <button
                key={stamp.id}
                type="button"
                onClick={() => setSelectedStamp(stamp.id)}
                className="stamp-btn"
                style={{
                  border: isSelected ? `2.5px solid ${stamp.color}` : "1.5px solid rgba(255,255,255,0.1)",
                  background: isSelected ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)"
                }}
              >
                <span className="stamp-emoji">{stamp.emoji}</span>
                <span className="stamp-label" style={{ color: isSelected ? "#fff" : "var(--text-secondary)" }}>
                  {stamp.text.slice(0, 7)}...
                </span>
              </button>
            );
          })}
        </div>

        {/* メッセージ入力 */}
        <form onSubmit={handleSend} style={{ marginTop: "1.2rem" }}>
          <div className="form-group">
            <input
              type="text"
              placeholder={`メッセージを添える（例: 「今日のごはん美味しかった！」）`}
              className="input-style"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={40}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "1rem" }}>
            <Send size={18} />
            <span>{profiles[receiver].name} にスタンプを送る！</span>
          </button>
        </form>
      </div>

      {/* タイムライン・過去のやりとり */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>💌 ふたりのリアクション履歴</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {reactions.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "1.5rem", fontSize: "0.95rem" }}>
              まだリアクションはありません。スタンプを送って励まし合おう！
            </div>
          ) : (
            reactions.map(r => {
              const stampObj = STAMPS.find(s => s.id === r.stampId) || STAMPS[0];
              const fromProfile = profiles[r.from] || { name: r.from, avatar: "👤" };
              const toProfile = profiles[r.to] || { name: r.to, avatar: "👤" };
              const timeStr = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={r.id}
                  className="animate-pop"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.9rem",
                    padding: "0.85rem 1rem",
                    background: "rgba(15, 23, 42, 0.8)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}
                >
                  <span style={{ fontSize: "2.4rem" }}>{stampObj.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-secondary)" }}>
                        {fromProfile.avatar} {fromProfile.name} ➔ {toProfile.name}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{timeStr}</span>
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#fff", marginTop: "0.2rem" }}>
                      {r.message}
                    </div>
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
