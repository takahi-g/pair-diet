import React, { useState } from "react";
import { TrendingDown, Calendar } from "lucide-react";

export default function DietChart({ logs, profiles }) {
  const [metric, setMetric] = useState("weight"); // weight, bodyFat, waist
  const [selectedUser, setSelectedUser] = useState("all"); // all, husband, wife

  // 日付順にソート（昇順）
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));

  // 日付リスト（重複除外）
  const dates = Array.from(new Set(sortedLogs.map(l => l.date)));

  // SVG描画用の簡易折れ線グラフ計算
  const getPoints = (userKey) => {
    const userLogs = sortedLogs.filter(l => l.user === userKey && l[metric] != null);
    if (userLogs.length === 0) return { points: [], values: [] };

    const values = userLogs.map(l => l[metric]);
    const minVal = Math.min(...values) * 0.95;
    const maxVal = Math.max(...values) * 1.05;
    const range = maxVal - minVal || 1;

    const width = 320;
    const height = 140;

    const points = userLogs.map((l, index) => {
      const x = (index / (Math.max(1, userLogs.length - 1))) * width;
      const y = height - ((l[metric] - minVal) / range) * height;
      return { x, y, val: l[metric], date: l.date };
    });

    return { points, minVal, maxVal, values };
  };

  const husbandData = getPoints("husband");
  const wifeData = getPoints("wife");

  const metricLabel = metric === "weight" ? "体重 (kg)" : metric === "bodyFat" ? "体脂肪率 (%)" : "ウエスト (cm)";

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <TrendingDown size={18} style={{ color: "var(--accent-primary)" }} />
          <span>推移グラフ</span>
        </div>

        {/* 指標切り替え */}
        <div style={{ display: "flex", gap: "0.3rem" }}>
          <button
            onClick={() => setMetric("weight")}
            style={{
              padding: "0.25rem 0.55rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: metric === "weight" ? "var(--gradient-primary)" : "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: "0.7rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            体重
          </button>
          <button
            onClick={() => setMetric("bodyFat")}
            style={{
              padding: "0.25rem 0.55rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: metric === "bodyFat" ? "var(--gradient-primary)" : "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: "0.7rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            体脂肪
          </button>
          <button
            onClick={() => setMetric("waist")}
            style={{
              padding: "0.25rem 0.55rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: metric === "waist" ? "var(--gradient-primary)" : "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: "0.7rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            ウエスト
          </button>
        </div>
      </div>

      {/* 凡例 */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem", fontSize: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#38bdf8", display: "inline-block" }} />
          <span>{profiles.husband.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f472b6", display: "inline-block" }} />
          <span>{profiles.wife.name}</span>
        </div>
      </div>

      {/* SVGグラフエリア */}
      <div style={{ width: "100%", overflowX: "auto", background: "rgba(15, 23, 42, 0.7)", borderRadius: "var(--radius-md)", padding: "1rem 0.5rem" }}>
        <svg viewBox="0 0 340 160" style={{ width: "100%", height: "180px", overflow: "visible" }}>
          {/* グリッド線 */}
          <line x1="10" y1="20" x2="330" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
          <line x1="10" y1="80" x2="330" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
          <line x1="10" y1="140" x2="330" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />

          {/* 夫のライン */}
          {husbandData.points.length > 1 && (
            <path
              d={`M ${husbandData.points.map(p => `${p.x + 10},${p.y + 10}`).join(" L ")}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          {husbandData.points.map((p, idx) => (
            <g key={`h-${idx}`}>
              <circle cx={p.x + 10} cy={p.y + 10} r="4" fill="#38bdf8" />
              <text x={p.x + 10} y={p.y + 3} fill="#94a3b8" fontSize="9" textAnchor="middle">
                {p.val}
              </text>
            </g>
          ))}

          {/* 妻のライン */}
          {wifeData.points.length > 1 && (
            <path
              d={`M ${wifeData.points.map(p => `${p.x + 10},${p.y + 10}`).join(" L ")}`}
              fill="none"
              stroke="#f472b6"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          {wifeData.points.map((p, idx) => (
            <g key={`w-${idx}`}>
              <circle cx={p.x + 10} cy={p.y + 10} r="4" fill="#f472b6" />
              <text x={p.x + 10} y={p.y + 3} fill="#f472b6" fontSize="9" textAnchor="middle">
                {p.val}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* 履歴リスト */}
      <div style={{ marginTop: "1rem" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
          直近の記録ログ
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {sortedLogs.slice(-5).reverse().map(l => {
            const isHusband = l.user === "husband";
            return (
              <div
                key={l.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0.75rem",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span>{isHusband ? "👨‍💻" : "👩‍🎨"}</span>
                  <span style={{ fontWeight: 700 }}>{l.date}</span>
                  {l.memo && <span style={{ color: "var(--text-secondary)" }}>- {l.memo}</span>}
                </div>
                <div style={{ display: "flex", gap: "0.6rem", fontWeight: 800 }}>
                  {l.weight && <span style={{ color: isHusband ? "#38bdf8" : "#f472b6" }}>{l.weight}kg</span>}
                  {l.bodyFat && <span style={{ color: "var(--text-secondary)" }}>{l.bodyFat}%</span>}
                  {l.waist && <span style={{ color: "var(--text-muted)" }}>{l.waist}cm</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
