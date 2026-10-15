import React from "react";
import { Activity, TrendingDown, Target, Eye, EyeOff, Award } from "lucide-react";

export default function PairDashboard({ profiles, logs, onTogglePrivacy }) {
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
          background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%), var(--bg-card)"
        }}
      >
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "2.3rem" }}>{profile.avatar}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontWeight: 900, fontSize: "1.3rem" }}>{profile.name}</span>
                <span 
                  style={{ 
                    fontSize: "0.8rem", 
                    padding: "0.2rem 0.6rem", 
                    borderRadius: "var(--radius-full)",
                    background: isHusband ? "rgba(56, 189, 248, 0.2)" : "rgba(244, 114, 182, 0.2)",
                    color: accentColor,
                    fontWeight: 800
                  }}
                >
                  {latest.date || "未記録"}
                </span>
              </div>
              <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.2rem", fontWeight: 700 }}>
                目標: {profile.targetWeight ? `${profile.targetWeight}kg` : "未設定"} 
                {toTarget && (
                  <span style={{ color: Number(toTarget) <= 0 ? "var(--accent-emerald)" : "#cbd5e1", marginLeft: "0.4rem", fontWeight: 800 }}>
                    ({Number(toTarget) <= 0 ? "達成！🎉" : `あと ${toTarget}kg`})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* プライバシー切り替えボタン */}
          <button
            onClick={() => onTogglePrivacy(userKey)}
            title="体重の生数値を隠して増減のみ表示"
            style={{
              background: profile.hideRawNumbers ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.08)",
              border: `1.5px solid ${profile.hideRawNumbers ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.2)"}`,
              borderRadius: "var(--radius-full)",
              padding: "0.45rem 0.85rem",
              color: profile.hideRawNumbers ? "#fca5a5" : "var(--text-primary)",
              fontSize: "0.85rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              cursor: "pointer"
            }}
          >
            {profile.hideRawNumbers ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{profile.hideRawNumbers ? "非公開中" : "公開中"}</span>
          </button>
        </div>

        {/* 3大指標（体重・体脂肪・ウエスト） */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem", marginTop: "0.6rem" }}>
          {/* 体重 */}
          <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "0.85rem 0.5rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>体重</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", marginTop: "0.2rem" }}>
              {profile.hideRawNumbers ? (
                <span style={{ fontSize: "1.2rem", color: accentColor }}>*** kg</span>
              ) : (
                latest.weight ? `${latest.weight}kg` : "--"
              )}
            </div>
            {diffWeight && (
              <div style={{ fontSize: "0.85rem", fontWeight: 800, marginTop: "0.2rem", color: Number(diffWeight) < 0 ? "var(--accent-emerald)" : Number(diffWeight) > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                {Number(diffWeight) > 0 ? `+${diffWeight}kg` : `${diffWeight}kg`}
              </div>
            )}
          </div>

          {/* 体脂肪率 */}
          <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "0.85rem 0.5rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>体脂肪率</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", marginTop: "0.2rem" }}>
              {latest.bodyFat ? `${latest.bodyFat}%` : "--"}
            </div>
            {diffFat && (
              <div style={{ fontSize: "0.85rem", fontWeight: 800, marginTop: "0.2rem", color: Number(diffFat) < 0 ? "var(--accent-emerald)" : Number(diffFat) > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                {Number(diffFat) > 0 ? `+${diffFat}%` : `${diffFat}%`}
              </div>
            )}
          </div>

          {/* ウエスト */}
          <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "0.85rem 0.5rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>ウエスト</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", marginTop: "0.2rem" }}>
              {latest.waist ? `${latest.waist}cm` : "--"}
            </div>
            {diffWaist && (
              <div style={{ fontSize: "0.85rem", fontWeight: 800, marginTop: "0.2rem", color: Number(diffWaist) < 0 ? "var(--accent-emerald)" : Number(diffWaist) > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                {Number(diffWaist) > 0 ? `+${diffWaist}cm` : `${diffWaist}cm`}
              </div>
            )}
          </div>
        </div>

        {/* 今日の歩数 & メモ */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.85rem", padding: "0.6rem 0.95rem", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)", fontSize: "0.95rem" }}>
          <div>
            <span style={{ color: "var(--text-secondary)", fontWeight: 700 }}>今日の歩数: </span>
            <strong style={{ color: "#38bdf8", fontSize: "1.1rem" }}>{latest.steps ? latest.steps.toLocaleString() : 0} 歩</strong>
          </div>
          {latest.memo && (
            <div style={{ color: "var(--text-primary)", fontWeight: 700, maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              💬 {latest.memo}
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
