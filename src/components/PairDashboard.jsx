import React from "react";
import { Activity, TrendingDown, Target, Eye, EyeOff, Award } from "lucide-react";

export default function PairDashboard({ profiles, logs, currentTabUser, onTogglePrivacy }) {
  // 夫と妻それぞれの最新データ
  const husbandLogs = logs.filter(l => l.user === "husband").sort((a, b) => new Date(b.date) - new Date(a.date));
  const wifeLogs = logs.filter(l => l.user === "wife").sort((a, b) => new Date(b.date) - new Date(a.date));

  const renderUserCard = (userKey, userLogs, colorTheme) => {
    const profile = profiles[userKey];
    const latest = userLogs[0] || {};
    const previous = userLogs[1] || {};

    const diffWeight = latest.weight && previous.weight ? (latest.weight - previous.weight).toFixed(1) : null;
    const diffFat = latest.bodyFat && previous.bodyFat ? (latest.bodyFat - previous.bodyFat).toFixed(1) : null;
    const diffWaist = latest.waist && previous.waist ? (latest.waist - previous.waist).toFixed(1) : null;

    // 目標まで
    const toTarget = latest.weight && profile.targetWeight ? (latest.weight - profile.targetWeight).toFixed(1) : null;

    const isHusband = userKey === "husband";
    const accentColor = isHusband ? "var(--accent-husband)" : "var(--accent-wife)";
    const bgGradient = isHusband ? "var(--gradient-husband)" : "var(--gradient-wife)";

    return (
      <div 
        className="card" 
        style={{ 
          borderLeft: `4px solid ${accentColor}`,
          background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%), var(--bg-card)"
        }}
      >
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.75rem" }}>{profile.avatar}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>{profile.name}</span>
                <span 
                  style={{ 
                    fontSize: "0.65rem", 
                    padding: "0.15rem 0.45rem", 
                    borderRadius: "var(--radius-full)",
                    background: isHusband ? "rgba(56, 189, 248, 0.15)" : "rgba(244, 114, 182, 0.15)",
                    color: accentColor,
                    fontWeight: 700
                  }}
                >
                  {latest.date || "未記録"}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>
                目標: {profile.targetWeight ? `${profile.targetWeight}kg` : "未設定"} 
                {toTarget && (
                  <span style={{ color: Number(toTarget) <= 0 ? "var(--accent-emerald)" : "var(--text-muted)", marginLeft: "0.3rem", fontWeight: 700 }}>
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
              background: profile.hideRawNumbers ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${profile.hideRawNumbers ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
              borderRadius: "var(--radius-full)",
              padding: "0.3rem 0.6rem",
              color: profile.hideRawNumbers ? "#f87171" : "var(--text-secondary)",
              fontSize: "0.7rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer"
            }}
          >
            {profile.hideRawNumbers ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{profile.hideRawNumbers ? "プライベート" : "公開中"}</span>
          </button>
        </div>

        {/* 3大指標（体重・体脂肪・ウエスト） */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginTop: "0.5rem" }}>
          {/* 体重 */}
          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "0.75rem 0.5rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700 }}>体重</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", marginTop: "0.15rem" }}>
              {profile.hideRawNumbers ? (
                <span style={{ fontSize: "1rem", color: accentColor }}>*** kg</span>
              ) : (
                latest.weight ? `${latest.weight}kg` : "--"
              )}
            </div>
            {diffWeight && (
              <div style={{ fontSize: "0.68rem", fontWeight: 700, marginTop: "0.15rem", color: Number(diffWeight) < 0 ? "var(--accent-emerald)" : Number(diffWeight) > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                {Number(diffWeight) > 0 ? `+${diffWeight}kg` : `${diffWeight}kg`}
              </div>
            )}
          </div>

          {/* 体脂肪率 */}
          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "0.75rem 0.5rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700 }}>体脂肪率</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", marginTop: "0.15rem" }}>
              {latest.bodyFat ? `${latest.bodyFat}%` : "--"}
            </div>
            {diffFat && (
              <div style={{ fontSize: "0.68rem", fontWeight: 700, marginTop: "0.15rem", color: Number(diffFat) < 0 ? "var(--accent-emerald)" : Number(diffFat) > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                {Number(diffFat) > 0 ? `+${diffFat}%` : `${diffFat}%`}
              </div>
            )}
          </div>

          {/* ウエスト */}
          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "0.75rem 0.5rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700 }}>ウエスト</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", marginTop: "0.15rem" }}>
              {latest.waist ? `${latest.waist}cm` : "--"}
            </div>
            {diffWaist && (
              <div style={{ fontSize: "0.68rem", fontWeight: 700, marginTop: "0.15rem", color: Number(diffWaist) < 0 ? "var(--accent-emerald)" : Number(diffWaist) > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                {Number(diffWaist) > 0 ? `+${diffWaist}cm` : `${diffWaist}cm`}
              </div>
            )}
          </div>
        </div>

        {/* 今日の歩数 & メモ */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem", padding: "0.45rem 0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem" }}>
          <div>
            <span style={{ color: "var(--text-secondary)" }}>今日の歩数: </span>
            <strong style={{ color: "#38bdf8" }}>{latest.steps ? latest.steps.toLocaleString() : 0} 歩</strong>
          </div>
          {latest.memo && (
            <div style={{ color: "var(--text-secondary)", fontStyle: "italic", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              💬 {latest.memo}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 2人の最新カード */}
      {renderUserCard("husband", husbandLogs, "husband")}
      {renderUserCard("wife", wifeLogs, "wife")}
    </div>
  );
}
