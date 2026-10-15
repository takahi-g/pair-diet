import React, { useState } from "react";
import { TrendingDown } from "lucide-react";

export default function DietChart({ logs, profiles }) {
  const [metric, setMetric] = useState("weight"); // weight, bodyFat, waist

  const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));

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

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <TrendingDown size={22} style={{ color: "var(--accent-primary)" }} />
          <span>推移グラフ</span>
        </div>

        {/* 指標切り替え */}
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button
            onClick={() => setMetric("weight")}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: metric === "weight" ? "var(--gradient-primary)" : "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            体重
          </button>
          <button
            onClick={() => setMetric("bodyFat")}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: metric === "bodyFat" ? "var(--gradient-primary)" : "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            体脂肪
          </button>
          <button
            onClick={() => setMetric("waist")}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: metric === "waist" ? "var(--gradient-primary)" : "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            ウエスト
          </button>
        </div>
      </div>

      {/* 凡例 */}
      <div style={{ display: "flex", gap: "1.2rem", marginBottom: "1rem", fontSize: "0.95rem", fontWeight: 800 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#38bdf8", display: "inline-block" }} />
          <span>{profiles.husband.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#f472b6", display: "inline-block" }} />
          <span>{profiles.wife.name}</span>
        </div>
      </div>

      {/* SVGグラフエリア */}
      <div style={{ width: "100%", overflowX: "auto", background: "rgba(15, 23, 42, 0.8)", borderRadius: "var(--radius-md)", padding: "1.2rem 0.6rem" }}>
        <svg viewBox="0 0 340 160" style={{ width: "100%", height: "200px", overflow: "visible" }}>
          <line x1="10" y1="20" x2="330" y2="20" stroke="rgba(255,255,255,0.08)" strokeDasharray="3,3" />
          <line x1="10" y1="80" x2="330" y2="80" stroke="rgba(255,255,255,0.08)" strokeDasharray="3,3" />
          <line x1="10" y1="140" x2="330" y2="140" stroke="rgba(255,255,255,0.08)" strokeDasharray="3,3" />

          {/* 夫のライン */}
          {husbandData.points.length > 1 && (
            <path
              d={`M ${husbandData.points.map(p => `${p.x + 10},${p.y + 10}`).join(" L ")}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
          {husbandData.points.map((p, idx) => (
            <g key={`h-${idx}`}>
              <circle cx={p.x + 10} cy={p.y + 10} r="5" fill="#38bdf8" />
              <text x={p.x + 10} y={p.y - 1} fill="#e2e8f0" fontSize="12" fontWeight="800" textAnchor="middle">
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
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
          {wifeData.points.map((p, idx) => (
            <g key={`w-${idx}`}>
              <circle cx={p.x + 10} cy={p.y + 10} r="5" fill="#f472b6" />
              <text x={p.x + 10} y={p.y - 1} fill="#f472b6" fontSize="12" fontWeight="800" textAnchor="middle">
                {p.val}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* 履歴リスト */}
      <div style={{ marginTop: "1.2rem" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          直近の記録ログ
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {sortedLogs.slice(-5).reverse().map(l => {
            const isHusband = l.user === "husband";
            return (
              <div
                key={l.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.7rem 0.95rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.95rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>{isHusband ? "👨‍💻" : "👩‍🎨"}</span>
                  <span style={{ fontWeight: 800 }}>{l.date}</span>
                  {l.memo && <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>- {l.memo}</span>}
                </div>
                <div style={{ display: "flex", gap: "0.8rem", fontWeight: 900 }}>
                  {l.weight && <span style={{ color: isHusband ? "#38bdf8" : "#f472b6", fontSize: "1.05rem" }}>{l.weight}kg</span>}
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
