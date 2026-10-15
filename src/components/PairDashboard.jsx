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
        <div className="card-header" style={{ alignItems: "center", marginBottom: "0.6rem", paddingBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", minWidth: 0 }}>
            <span style={{ fontSize: "2.3rem", flexShrink: 0 }}>{profile.avatar}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* 1行目: 名前・日付・編集ボタンを横一列に並べる */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "nowrap", width: "100%" }}>
                <span style={{ fontWeight: 900, fontSize: "1.35rem", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {profile.name}
                </span>

                {/* 日付バッジ */}
                <span 
                  style={{ 
                    fontSize: "0.85rem", 
                    padding: "0.2rem 0.55rem", 
                    borderRadius: "var(--radius-full)",
                    background: "rgba(255, 255, 255, 0.12)",
                    border: `1.5px solid ${accentColor}`,
                    color: "#fff",
                    fontWeight: 900,
                    letterSpacing: "0.01em",
                    whiteSpace: "nowrap",
                    flexShrink: 0
                  }}
                >
                  📅 {latest.date ? latest.date.replace(/^\d{4}-/, "") : "未記録"}
                </span>

                {/* 編集ボタンを日付のすぐ横に配置 */}
                {latest.id && (
                  <button
                    onClick={() => onSelectLogToEdit(latest)}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.25)",
                      borderRadius: "var(--radius-full)",
                      padding: "0.2rem 0.6rem",
                      color: "#fff",
                      fontSize: "0.825rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      marginLeft: "auto"
                    }}
                  >
                    <Edit3 size={13} />
                    <span>編集</span>
                  </button>
                )}
              </div>

              {/* 2行目: 目標体重と（あと◯kg）を絶対に改行せず一行で表示 */}
              <div style={{ 
                fontSize: "1.05rem", 
                color: "var(--text-primary)", 
                marginTop: "0.3rem", 
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                flexWrap: "nowrap",
                whiteSpace: "nowrap",
                overflow: "hidden"
              }}>
                <span>目標: </span>
                <strong style={{ color: "#fff", fontSize: "1.15rem", marginLeft: "0.25rem" }}>
                  {profile.targetWeight ? `${profile.targetWeight}kg` : "未設定"}
                </strong>
                {toTarget && (
                  <span style={{ 
                    color: Number(toTarget) <= 0 ? "var(--accent-emerald)" : "#fca5a5", 
                    marginLeft: "0.45rem", 
                    fontWeight: 900,
                    fontSize: "0.98rem",
                    whiteSpace: "nowrap"
                  }}>
                    ({Number(toTarget) <= 0 ? "達成！🎉" : `あと ${toTarget}kg`})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3大指標（体重・体脂肪・ウエスト）- タップで即編集可能 */}
        <div 
          onClick={() => latest.id && onSelectLogToEdit(latest)}
          title="タップして数値を編集"
          className="metric-grid-3"
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))", 
            gap: "0.35rem", 
            marginTop: "0.75rem",
            cursor: "pointer",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          {/* 体重 */}
          <div className="metric-box" style={{ background: "rgba(15, 23, 42, 0.85)", padding: "0.65rem 0.15rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)", minWidth: 0, overflow: "hidden" }}>
            <div className="metric-lbl" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>体重</div>
            <div className="metric-val" style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", marginTop: "0.15rem", whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>
              {latest.weight ? `${latest.weight}kg` : "--"}
            </div>
            {diffWeight && (
              <div className="metric-diff" style={{ fontSize: "0.85rem", fontWeight: 900, marginTop: "0.15rem", color: Number(diffWeight) < 0 ? "var(--accent-emerald)" : Number(diffWeight) > 0 ? "var(--accent-rose)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                {Number(diffWeight) > 0 ? `+${diffWeight}kg` : `${diffWeight}kg`}
              </div>
            )}
          </div>

          {/* 体脂肪率 */}
          <div className="metric-box" style={{ background: "rgba(15, 23, 42, 0.85)", padding: "0.65rem 0.15rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)", minWidth: 0, overflow: "hidden" }}>
            <div className="metric-lbl" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>体脂肪率</div>
            <div className="metric-val" style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", marginTop: "0.15rem", whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>
              {latest.bodyFat ? `${latest.bodyFat}%` : "--"}
            </div>
            {diffFat && (
              <div className="metric-diff" style={{ fontSize: "0.85rem", fontWeight: 900, marginTop: "0.15rem", color: Number(diffFat) < 0 ? "var(--accent-emerald)" : Number(diffFat) > 0 ? "var(--accent-rose)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                {Number(diffFat) > 0 ? `+${diffFat}%` : `${diffFat}%`}
              </div>
            )}
          </div>

          {/* ウエスト */}
          <div className="metric-box" style={{ background: "rgba(15, 23, 42, 0.85)", padding: "0.65rem 0.15rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)", minWidth: 0, overflow: "hidden" }}>
            <div className="metric-lbl" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>ウエスト</div>
            <div className="metric-val" style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", marginTop: "0.15rem", whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>
              {latest.waist ? `${latest.waist}cm` : "--"}
            </div>
            {diffWaist && (
              <div className="metric-diff" style={{ fontSize: "0.85rem", fontWeight: 900, marginTop: "0.15rem", color: Number(diffWaist) < 0 ? "var(--accent-emerald)" : Number(diffWaist) > 0 ? "var(--accent-rose)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
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
            padding: "0.7rem 0.85rem", 
            background: "rgba(255,255,255,0.06)", 
            borderRadius: "var(--radius-md)", 
            fontSize: "0.95rem",
            cursor: "pointer",
            gap: "0.5rem",
            overflow: "hidden"
          }}
        >
          {/* 歩数は絶対に改行せず一行で表示 */}
          <div style={{ whiteSpace: "nowrap", flexShrink: 0, display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: 800 }}>今日の歩数:</span>
            <strong style={{ color: "#38bdf8", fontSize: "1.2rem", fontWeight: 900 }}>
              {latest.steps ? latest.steps.toLocaleString() : 0}
            </strong>
            <span style={{ color: "#38bdf8", fontWeight: 800, fontSize: "0.9rem" }}>歩</span>
          </div>

          {/* メモは空いたスペースに1行で綺麗に収め、長ければ...で省略 */}
          {latest.memo ? (
            <div style={{ 
              color: "var(--text-primary)", 
              fontWeight: 700, 
              fontSize: "0.88rem",
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              whiteSpace: "nowrap",
              minWidth: 0,
              textAlign: "right",
              background: "rgba(255,255,255,0.08)",
              padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-sm)"
            }}>
              💬 {latest.memo}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.825rem", whiteSpace: "nowrap", flexShrink: 0 }}>
              メモ追加 ➔
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
