import React, { useState } from "react";
import { MessageSquareHeart, Send, Sparkles } from "lucide-react";
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
    
    // 紙吹雪エフェクト
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
            <MessageSquareHeart size={20} style={{ color: "var(--accent-pink)" }} />
            <span>ほめ合いスタンプを送る</span>
          </div>
        </div>

        {/* 送信者の選択 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem", background: "rgba(255,255,255,0.03)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>誰から送る？</span>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => setSender("husband")}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: sender === "husband" ? "var(--gradient-husband)" : "rgba(255,255,255,0.06)",
                color: sender === "husband" ? "#fff" : "var(--text-secondary)",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              👨‍💻 旦那さんから
            </button>
            <button
              type="button"
              onClick={() => setSender("wife")}
              style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: sender === "wife" ? "var(--gradient-wife)" : "rgba(255,255,255,0.06)",
                color: sender === "wife" ? "#fff" : "var(--text-secondary)",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              👩‍🎨 奥さんから
            </button>
          </div>
        </div>

        {/* スタンプ選択グリッド */}
        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
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
                  border: isSelected ? `2px solid ${stamp.color}` : "1px solid rgba(255,255,255,0.08)",
                  background: isSelected ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)"
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
        <form onSubmit={handleSend} style={{ marginTop: "1rem" }}>
          <div className="form-group">
            <input
              type="text"
              placeholder={`メッセージを添える（例: 「今日のごはんありがとう！」）`}
              className="input-style"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={40}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.75rem" }}>
            <Send size={16} />
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

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {reactions.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "1.5rem", fontSize: "0.85rem" }}>
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
                    gap: "0.75rem",
                    padding: "0.65rem 0.85rem",
                    background: "rgba(15, 23, 42, 0.6)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>{stampObj.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                        {fromProfile.avatar} {fromProfile.name} ➔ {toProfile.name}
                      </span>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{timeStr}</span>
                    </div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#fff", marginTop: "0.15rem" }}>
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
