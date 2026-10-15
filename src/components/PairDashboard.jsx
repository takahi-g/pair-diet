import React from "react";
import { Edit3 } from "lucide-react";

export default function PairDashboard({ profiles, logs, onSelectLogToEdit, primaryUser = "wife" }) {
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
        key={userKey}
        className="card" 
        style={{ 
          borderLeft: `6px solid ${accentColor}`,
          background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%), var(--bg-card)",
          position: "relative"
        }}
      >
        <div className="card-header" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: "2.4rem", flexShrink: 0 }}>{profile.avatar}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* 名前と日付：横並びで絶対に縦に折れないように nowrap 指定 */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "nowrap" }}>
                <span style={{ fontWeight: 900, fontSize: "1.45rem", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {profile.name}
                </span>
                {/* 日付をすっきり見やすい高コントラストデザインに */}
                <span 
                  style={{ 
                    fontSize: "0.95rem", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "var(--radius-full)",
                    background: "rgba(255, 255, 255, 0.12)",
                    border: `1.5px solid ${accentColor}`,
                    color: "#fff",
                    fontWeight: 900,
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap"
                  }}
                >
                  📅 {latest.date || "未記録"}
                </span>
              </div>

              {/* 目標体重を大きく強調表示 */}
              <div style={{ fontSize: "1.15rem", color: "var(--text-primary)", marginTop: "0.35rem", fontWeight: 800 }}>
                目標: <strong style={{ color: "#fff", fontSize: "1.25rem" }}>{profile.targetWeight ? `${profile.targetWeight}kg` : "未設定"}</strong>
                {toTarget && (
                  <span style={{ color: Number(toTarget) <= 0 ? "var(--accent-emerald)" : "#fca5a5", marginLeft: "0.5rem", fontWeight: 900 }}>
                    ({Number(toTarget) <= 0 ? "目標達成！🎉" : `あと ${toTarget}kg`})
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
                background: "rgba(255, 255, 255, 0.1)",
                border: "1.5px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "var(--radius-full)",
                padding: "0.45rem 0.85rem",
                color: "#fff",
                fontSize: "0.9rem",
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                cursor: "pointer",
                flexShrink: 0
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
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))", 
            gap: "0.45rem", 
            marginTop: "0.75rem",
            cursor: "pointer",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          {/* 体重 */}
          <div style={{ background: "rgba(15, 23, 42, 0.85)", padding: "0.75rem 0.25rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)", minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>体重</div>
            <div style={{ fontSize: "clamp(1.25rem, 5vw, 1.75rem)", fontWeight: 900, color: "#fff", marginTop: "0.2rem", whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
              {latest.weight ? `${latest.weight}kg` : "--"}
            </div>
            {diffWeight && (
              <div style={{ fontSize: "0.85rem", fontWeight: 900, marginTop: "0.2rem", color: Number(diffWeight) < 0 ? "var(--accent-emerald)" : Number(diffWeight) > 0 ? "var(--accent-rose)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                {Number(diffWeight) > 0 ? `+${diffWeight}kg` : `${diffWeight}kg`}
              </div>
            )}
          </div>

          {/* 体脂肪率 */}
          <div style={{ background: "rgba(15, 23, 42, 0.85)", padding: "0.75rem 0.25rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)", minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>体脂肪率</div>
            <div style={{ fontSize: "clamp(1.25rem, 5vw, 1.75rem)", fontWeight: 900, color: "#fff", marginTop: "0.2rem", whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
              {latest.bodyFat ? `${latest.bodyFat}%` : "--"}
            </div>
            {diffFat && (
              <div style={{ fontSize: "0.85rem", fontWeight: 900, marginTop: "0.2rem", color: Number(diffFat) < 0 ? "var(--accent-emerald)" : Number(diffFat) > 0 ? "var(--accent-rose)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                {Number(diffFat) > 0 ? `+${diffFat}%` : `${diffFat}%`}
              </div>
            )}
          </div>

          {/* ウエスト */}
          <div style={{ background: "rgba(15, 23, 42, 0.85)", padding: "0.75rem 0.25rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)", minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>ウエスト</div>
            <div style={{ fontSize: "clamp(1.25rem, 5vw, 1.75rem)", fontWeight: 900, color: "#fff", marginTop: "0.2rem", whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
              {latest.waist ? `${latest.waist}cm` : "--"}
            </div>
            {diffWaist && (
              <div style={{ fontSize: "0.85rem", fontWeight: 900, marginTop: "0.2rem", color: Number(diffWaist) < 0 ? "var(--accent-emerald)" : Number(diffWaist) > 0 ? "var(--accent-rose)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
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
            background: "rgba(255,255,255,0.06)", 
            borderRadius: "var(--radius-md)", 
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          <div>
            <span style={{ color: "var(--text-secondary)", fontWeight: 800 }}>今日の歩数: </span>
            <strong style={{ color: "#38bdf8", fontSize: "1.25rem" }}>{latest.steps ? latest.steps.toLocaleString() : 0} 歩</strong>
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

  // primaryUser（デフォルト表示順）に応じてカードの上下を入れ替え
  const userOrder = primaryUser === "wife" ? ["wife", "husband"] : ["husband", "wife"];

  return (
    <div>
      {userOrder.map(u => renderUserCard(u, u === "husband" ? husbandLogs : wifeLogs))}
    </div>
  );
}
