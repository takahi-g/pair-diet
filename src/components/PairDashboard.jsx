import React from "react";
import { Edit3 } from "lucide-react";

export default function PairDashboard({ profiles, logs, onSelectLogToEdit }) {
  const husbandLogs = logs.filter(l => l.user === "husband").sort((a, b) => new Date(b.date) - new Date(a.date));
  const wifeLogs = logs.filter(l => l.user === "wife").sort((a, b) => new Date(b.date) - new Date(a.date));

  const renderUserCard = (userKey, userLogs) => {
    const profile = profiles[userKey];
    const latest = userLogs[0] || {};
    const previous = userLogs[1] || {};

    const diffWeight = latest.weight && previous.weight ? (latest.weight - previous.weight).toFixed(1) : null;
    const diffFat = latest.bodyFat && previous.bodyFat ? (latest.bodyFat - previous.bodyFat).toFixed(1) : null;
    const diffWaist = latest.waist && previous.waist ? (latest.waist - previous.waist).toFixed(1) : null;

    const toTarget = latest.weight && profile.targetWeight ? (latest.weight - profile.targetWeight).toFixed(1) : null;

    const isHusband = userKey === "husband";
    const accentColor = isHusband ? "var(--accent-husband)" : "var(--accent-wife)";

    return (
      <div 
        className="card" 
        style={{ 
          borderLeft: `6px solid ${accentColor}`,
          background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%), var(--bg-card)",
          position: "relative"
        }}
      >
        <div className="card-header" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <span style={{ fontSize: "2.4rem" }}>{profile.avatar}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontWeight: 900, fontSize: "1.45rem" }}>{profile.name}</span>
                {/* 日付を大きく目立たせる */}
                <span 
                  style={{ 
                    fontSize: "0.95rem", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "var(--radius-full)",
                    background: isHusband ? "rgba(56, 189, 248, 0.25)" : "rgba(244, 114, 182, 0.25)",
                    color: accentColor,
                    fontWeight: 900,
                    letterSpacing: "0.02em"
                  }}
                >
                  📅 {latest.date || "未記録"}
                </span>
              </div>
              <div style={{ fontSize: "1rem", color: "var(--text-secondary)", marginTop: "0.25rem", fontWeight: 700 }}>
                目標: {profile.targetWeight ? `${profile.targetWeight}kg` : "未設定"} 
                {toTarget && (
                  <span style={{ color: Number(toTarget) <= 0 ? "var(--accent-emerald)" : "#cbd5e1", marginLeft: "0.5rem", fontWeight: 800 }}>
                    ({Number(toTarget) <= 0 ? "達成！🎉" : `あと ${toTarget}kg`})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* タップして編集ボタン */}
          {latest.id && (
            <button
              onClick={() => onSelectLogToEdit(latest)}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1.5px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "var(--radius-full)",
                padding: "0.45rem 0.85rem",
                color: "#fff",
                fontSize: "0.9rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                cursor: "pointer"
              }}
            >
              <Edit3 size={16} />
              <span>編集</span>
            </button>
          )}
        </div>

        {/* 3大指標（体重・体脂肪・ウエスト）- タップで即編集可能 */}
        <div 
          onClick={() => latest.id && onSelectLogToEdit(latest)}
          title="タップして数値を編集"
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: "0.6rem", 
            marginTop: "0.6rem",
            cursor: "pointer"
          }}
        >
          {/* 体重 */}
          <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "0.85rem 0.5rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 800 }}>体重</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", marginTop: "0.2rem" }}>
              {latest.weight ? `${latest.weight}kg` : "--"}
            </div>
            {diffWeight && (
              <div style={{ fontSize: "0.9rem", fontWeight: 800, marginTop: "0.2rem", color: Number(diffWeight) < 0 ? "var(--accent-emerald)" : Number(diffWeight) > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                {Number(diffWeight) > 0 ? `+${diffWeight}kg` : `${diffWeight}kg`}
              </div>
            )}
          </div>

          {/* 体脂肪率 */}
          <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "0.85rem 0.5rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 800 }}>体脂肪率</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", marginTop: "0.2rem" }}>
              {latest.bodyFat ? `${latest.bodyFat}%` : "--"}
            </div>
            {diffFat && (
              <div style={{ fontSize: "0.9rem", fontWeight: 800, marginTop: "0.2rem", color: Number(diffFat) < 0 ? "var(--accent-emerald)" : Number(diffFat) > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                {Number(diffFat) > 0 ? `+${diffFat}%` : `${diffFat}%`}
              </div>
            )}
          </div>

          {/* ウエスト */}
          <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "0.85rem 0.5rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 800 }}>ウエスト</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", marginTop: "0.2rem" }}>
              {latest.waist ? `${latest.waist}cm` : "--"}
            </div>
            {diffWaist && (
              <div style={{ fontSize: "0.9rem", fontWeight: 800, marginTop: "0.2rem", color: Number(diffWaist) < 0 ? "var(--accent-emerald)" : Number(diffWaist) > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                {Number(diffWaist) > 0 ? `+${diffWaist}cm` : `${diffWaist}cm`}
              </div>
            )}
          </div>
        </div>

        {/* 今日の歩数 & メモ */}
        <div 
          onClick={() => latest.id && onSelectLogToEdit(latest)}
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginTop: "0.85rem", 
            padding: "0.75rem 1rem", 
            background: "rgba(255,255,255,0.05)", 
            borderRadius: "var(--radius-md)", 
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          <div>
            <span style={{ color: "var(--text-secondary)", fontWeight: 800 }}>今日の歩数: </span>
            <strong style={{ color: "#38bdf8", fontSize: "1.2rem" }}>{latest.steps ? latest.steps.toLocaleString() : 0} 歩</strong>
          </div>
          {latest.memo ? (
            <div style={{ color: "var(--text-primary)", fontWeight: 800, maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              💬 {latest.memo}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              タップでメモ編集 ➔
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderUserCard("husband", husbandLogs)}
      {renderUserCard("wife", wifeLogs)}
    </div>
  );
}
