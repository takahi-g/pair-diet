import React, { useState, useMemo } from "react";
import { TrendingDown, Edit3, Calendar, Users, Eye } from "lucide-react";

// 期間フィルター定義
const TIME_RANGES = [
  { id: "1w", label: "1週間", days: 7 },
  { id: "1m", label: "1ヶ月", days: 30 },
  { id: "3m", label: "3ヶ月", days: 90 },
  { id: "6m", label: "6ヶ月", days: 180 },
  { id: "1y", label: "1年", days: 365 },
  { id: "2y", label: "2年", days: 730 },
  { id: "3y", label: "3年", days: 1095 },
  { id: "all", label: "全期間", days: 99999 }
];

export default function DietChart({ logs, profiles, onSelectLogToEdit }) {
  const [metric, setMetric] = useState("weight"); // weight, bodyFat, waist
  const [timeRange, setTimeRange] = useState("1m"); // 1w, 1m, 3m, 6m, 1y, 2y, 3y, all
  const [selectedUser, setSelectedUser] = useState("both"); // "both", "wife", "husband"
  const [inspectedPoint, setInspectedPoint] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const metricConfig = {
    weight: { label: "体重", unit: "kg", color: "#38bdf8" },
    bodyFat: { label: "体脂肪率", unit: "%", color: "#ec4899" },
    waist: { label: "ウエスト", unit: "cm", color: "#10b981" }
  };

  // 全ログを昇順（古い順）にソート
  const sortedAllLogs = useMemo(() => {
    return [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [logs]);

  // 期間に応じたフィルタリング（最新ログ日または現在日を基準に範囲計算）
  const { filteredLogs, startDateStr, endDateStr } = useMemo(() => {
    if (sortedAllLogs.length === 0) return { filteredLogs: [], startDateStr: "", endDateStr: "" };

    const rangeObj = TIME_RANGES.find(r => r.id === timeRange);
    
    // 最新の日付を基準にする（今日と最新記録の遅い方）
    const latestLogDate = new Date(sortedAllLogs[sortedAllLogs.length - 1].date);
    const today = new Date();
    const baseDate = latestLogDate > today ? latestLogDate : today;

    if (!rangeObj || rangeObj.id === "all") {
      return {
        filteredLogs: sortedAllLogs,
        startDateStr: sortedAllLogs[0].date,
        endDateStr: baseDate.toISOString().split("T")[0]
      };
    }

    const cutoff = new Date(baseDate.getTime());
    cutoff.setDate(cutoff.getDate() - rangeObj.days);
    const cutoffStr = cutoff.toISOString().split("T")[0];

    const fl = sortedAllLogs.filter(l => l.date >= cutoffStr);
    return {
      filteredLogs: fl,
      startDateStr: cutoffStr,
      endDateStr: baseDate.toISOString().split("T")[0]
    };
  }, [sortedAllLogs, timeRange]);

  // グラフ描画用の座標計算（日付を共通の時間軸Xにマッピング）
  const chartData = useMemo(() => {
    const validLogs = filteredLogs.filter(l => l[metric] != null && (selectedUser === "both" || l.user === selectedUser));
    if (validLogs.length === 0) {
      return { hasData: false };
    }

    // 全ての有効な数値からY軸の最小値・最大値を算出
    const allVals = validLogs.map(l => Number(l[metric]));
    const rawMin = Math.min(...allVals);
    const rawMax = Math.max(...allVals);
    
    // Y軸に余裕を持たせる（1目盛り分あける）
    const margin = metric === "weight" ? 1.5 : metric === "bodyFat" ? 1.5 : 2;
    const minY = Math.floor(rawMin - margin);
    const maxY = Math.ceil(rawMax + margin);
    const yRange = maxY - minY || 1;

    // SVG領域のサイズ
    const svgWidth = 360;
    const svgHeight = 220;
    const padLeft = 46;
    const padRight = 20;
    const padTop = 30;
    const padBottom = 35;
    const plotWidth = svgWidth - padLeft - padRight;
    const plotHeight = svgHeight - padTop - padBottom;

    // 時間軸（X軸）の範囲
    const startTime = new Date(startDateStr).getTime();
    const endTime = new Date(endDateStr).getTime();
    const timeSpan = Math.max(86400000, endTime - startTime);

    const calcPoint = (log) => {
      const t = new Date(log.date).getTime();
      const xRatio = Math.max(0, Math.min(1, (t - startTime) / timeSpan));
      const x = padLeft + xRatio * plotWidth;
      const val = Number(log[metric]);
      const yRatio = (val - minY) / yRange;
      const y = padTop + plotHeight - yRatio * plotHeight;
      return { x, y, val, date: log.date, user: log.user, rawLog: log };
    };

    const husbandPoints = validLogs.filter(l => l.user === "husband").map(calcPoint);
    const wifePoints = validLogs.filter(l => l.user === "wife").map(calcPoint);

    // Y軸目盛り（4本）
    const yTicks = [
      maxY,
      Math.round((maxY * 2 + minY) / 3 * 10) / 10,
      Math.round((maxY + minY * 2) / 3 * 10) / 10,
      minY
    ];

    // X軸目盛り（開始・中間・終了）
    const xTicks = [
      { label: startDateStr.replace(/^\d{4}-/, ""), ratio: 0 },
      { label: new Date(startTime + timeSpan / 2).toISOString().split("T")[0].replace(/^\d{4}-/, ""), ratio: 0.5 },
      { label: endDateStr.replace(/^\d{4}-/, ""), ratio: 1 }
    ];

    return {
      hasData: true,
      svgWidth,
      svgHeight,
      padLeft,
      padRight,
      padTop,
      padBottom,
      plotWidth,
      plotHeight,
      minY,
      maxY,
      yTicks,
      xTicks,
      husbandPoints,
      wifePoints
    };
  }, [filteredLogs, startDateStr, endDateStr, metric, selectedUser]);

  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
        <div className="card-title">
          <TrendingDown size={24} style={{ color: "var(--accent-primary)" }} />
          <span>推移グラフ</span>
        </div>

        {/* 指標切り替え (体重 / 体脂肪 / ウエスト) */}
        <div style={{ display: "flex", gap: "0.35rem" }}>
          <button
            onClick={() => setMetric("weight")}
            style={{
              padding: "0.45rem 0.85rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: metric === "weight" ? "var(--gradient-primary)" : "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: 900,
              cursor: "pointer"
            }}
          >
            体重
          </button>
          <button
            onClick={() => setMetric("bodyFat")}
            style={{
              padding: "0.45rem 0.85rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: metric === "bodyFat" ? "var(--gradient-primary)" : "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: 900,
              cursor: "pointer"
            }}
          >
            体脂肪
          </button>
          <button
            onClick={() => setMetric("waist")}
            style={{
              padding: "0.45rem 0.85rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: metric === "waist" ? "var(--gradient-primary)" : "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: 900,
              cursor: "pointer"
            }}
          >
            ウエスト
          </button>
        </div>
      </div>

      {/* 期間切り替えボタン（全期間・1ヶ月など） */}
      <div style={{ marginBottom: "0.85rem" }}>
        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800, marginBottom: "0.4rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Calendar size={14} /> 期間: {startDateStr} 〜 {endDateStr}
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
            ({filteredLogs.length}件の記録)
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.3rem" }}>
          {TIME_RANGES.map(r => {
            const isSelected = timeRange === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setTimeRange(r.id)}
                style={{
                  padding: "0.45rem 0.2rem",
                  borderRadius: "var(--radius-sm)",
                  border: isSelected ? "2px solid #6366f1" : "1px solid rgba(255,255,255,0.1)",
                  background: isSelected ? "var(--gradient-primary)" : "rgba(255,255,255,0.04)",
                  color: isSelected ? "#fff" : "var(--text-secondary)",
                  fontSize: "0.85rem",
                  fontWeight: 900,
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 凡例 & 表示切り替え（ふたり / ママだけ / パパだけ） */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        background: "rgba(255,255,255,0.05)", 
        padding: "0.45rem 0.75rem", 
        borderRadius: "var(--radius-md)", 
        marginBottom: "0.75rem" 
      }}>
        <div style={{ display: "flex", gap: "0.8rem", fontSize: "0.95rem", fontWeight: 900 }}>
          <div 
            onClick={() => setSelectedUser(prev => prev === "husband" ? "both" : "husband")}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.35rem", 
              cursor: "pointer",
              opacity: selectedUser === "wife" ? 0.35 : 1
            }}
          >
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#38bdf8", display: "inline-block" }} />
            <span>{profiles.husband.name}</span>
          </div>
          <div 
            onClick={() => setSelectedUser(prev => prev === "wife" ? "both" : "wife")}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.35rem", 
              cursor: "pointer",
              opacity: selectedUser === "husband" ? 0.35 : 1
            }}
          >
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#f472b6", display: "inline-block" }} />
            <span>{profiles.wife.name}</span>
          </div>
        </div>

        <button
          onClick={() => setSelectedUser("both")}
          style={{
            background: selectedUser === "both" ? "rgba(255,255,255,0.15)" : "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "var(--radius-full)",
            color: "#fff",
            fontSize: "0.78rem",
            padding: "0.2rem 0.55rem",
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          {selectedUser === "both" ? "2人とも表示中" : "2人表示に戻す"}
        </button>
      </div>

      {/* SVGグラフエリア */}
      <div style={{ 
        width: "100%", 
        background: "rgba(15, 23, 42, 0.95)", 
        borderRadius: "var(--radius-md)", 
        padding: "0.85rem 0.4rem 0.4rem 0.4rem",
        border: "1px solid rgba(255,255,255,0.1)",
        boxSizing: "border-box",
        position: "relative"
      }}>
        {!chartData.hasData ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 1rem", fontSize: "1rem", fontWeight: 800 }}>
            この期間の記録はありません
          </div>
        ) : (
          <div>
            <svg 
              viewBox={`0 0 ${chartData.svgWidth} ${chartData.svgHeight}`} 
              style={{ width: "100%", height: "230px", overflow: "visible" }}
            >
              {/* Y軸グリッド線 & 目盛り数値 */}
              {chartData.yTicks.map((yVal, idx) => {
                const yPos = chartData.padTop + (idx / (chartData.yTicks.length - 1)) * chartData.plotHeight;
                return (
                  <g key={`grid-y-${idx}`}>
                    <line 
                      x1={chartData.padLeft} 
                      y1={yPos} 
                      x2={chartData.svgWidth - chartData.padRight} 
                      y2={yPos} 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeDasharray="4,4" 
                    />
                    <text 
                      x={chartData.padLeft - 6} 
                      y={yPos + 4} 
                      fill="var(--text-muted)" 
                      fontSize="11" 
                      fontWeight="800" 
                      textAnchor="end"
                    >
                      {yVal}
                    </text>
                  </g>
                );
              })}

              {/* X軸目盛りラベル（開始・中間・終了） */}
              {chartData.xTicks.map((xItem, idx) => {
                const xPos = chartData.padLeft + xItem.ratio * chartData.plotWidth;
                return (
                  <text
                    key={`grid-x-${idx}`}
                    x={xPos}
                    y={chartData.svgHeight - 8}
                    fill="var(--text-secondary)"
                    fontSize="11"
                    fontWeight="800"
                    textAnchor={idx === 0 ? "start" : idx === 2 ? "end" : "middle"}
                  >
                    {xItem.label}
                  </text>
                );
              })}

              {/* 夫（パパ）の折れ線・面 */}
              {(selectedUser === "both" || selectedUser === "husband") && chartData.husbandPoints.length > 1 && (
                <path
                  d={`M ${chartData.husbandPoints.map(p => `${p.x},${p.y}`).join(" L ")}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* 妻（ママ）の折れ線・面 */}
              {(selectedUser === "both" || selectedUser === "wife") && chartData.wifePoints.length > 1 && (
                <path
                  d={`M ${chartData.wifePoints.map(p => `${p.x},${p.y}`).join(" L ")}`}
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* 夫（パパ）のプロット点 */}
              {(selectedUser === "both" || selectedUser === "husband") && chartData.husbandPoints.map((p, idx) => {
                const isInspected = inspectedPoint && inspectedPoint.date === p.date && inspectedPoint.user === "husband";
                return (
                  <g 
                    key={`h-pt-${idx}`} 
                    onClick={() => setInspectedPoint(p)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r={isInspected ? 8 : 5.5} 
                      fill="#38bdf8" 
                      stroke="#fff" 
                      strokeWidth={isInspected ? 2.5 : 1.5} 
                    />
                    <text 
                      x={p.x} 
                      y={p.y - 8} 
                      fill="#fff" 
                      fontSize="12" 
                      fontWeight="900" 
                      textAnchor="middle"
                      style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      {p.val}
                    </text>
                  </g>
                );
              })}

              {/* 妻（ママ）のプロット点 */}
              {(selectedUser === "both" || selectedUser === "wife") && chartData.wifePoints.map((p, idx) => {
                const isInspected = inspectedPoint && inspectedPoint.date === p.date && inspectedPoint.user === "wife";
                return (
                  <g 
                    key={`w-pt-${idx}`} 
                    onClick={() => setInspectedPoint(p)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r={isInspected ? 8 : 5.5} 
                      fill="#f472b6" 
                      stroke="#fff" 
                      strokeWidth={isInspected ? 2.5 : 1.5} 
                    />
                    <text 
                      x={p.x} 
                      y={p.y - 8} 
                      fill="#f472b6" 
                      fontSize="12" 
                      fontWeight="900" 
                      textAnchor="middle"
                      style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      {p.val}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* 点をタップした時の詳細インスペクター */}
            {inspectedPoint && (
              <div 
                className="animate-pop"
                style={{
                  marginTop: "0.6rem",
                  padding: "0.65rem 0.85rem",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: `1.5px solid ${inspectedPoint.user === "husband" ? "#38bdf8" : "#f472b6"}`,
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>
                    📅 {inspectedPoint.date} ({inspectedPoint.user === "husband" ? profiles.husband.name : profiles.wife.name})
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", marginTop: "0.1rem" }}>
                    {metricConfig[metric].label}: <span style={{ color: inspectedPoint.user === "husband" ? "#38bdf8" : "#f472b6" }}>{inspectedPoint.val} {metricConfig[metric].unit}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectLogToEdit && onSelectLogToEdit(inspectedPoint.rawLog)}
                  style={{
                    background: "var(--gradient-primary)",
                    border: "none",
                    borderRadius: "var(--radius-full)",
                    padding: "0.4rem 0.75rem",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem"
                  }}
                >
                  <Edit3 size={14} />
                  <span>編集</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 履歴リスト */}
      <div style={{ marginTop: "1.2rem" }}>
        <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-secondary)", marginBottom: "0.6rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>期間内の記録 ({filteredLogs.length}件)</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>タップで編集・メモ確認</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          {filteredLogs.slice(-15).reverse().map(l => {
            const isHusband = l.user === "husband";
            const userColor = isHusband ? "#38bdf8" : "#f472b6";
            const userName = isHusband ? profiles.husband.name : profiles.wife.name;
            const isMemoOpen = expandedId === l.id;

            return (
              <div
                key={l.id}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${isMemoOpen ? userColor : "rgba(255,255,255,0.08)"}`,
                  overflow: "hidden",
                  transition: "all 0.15s ease"
                }}
              >
                {/* 1行目: アイコン・日付・名前・体重数値・編集ボタン */}
                <div 
                  onClick={() => onSelectLogToEdit && onSelectLogToEdit(l)}
                  title="タップして編集"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 0.85rem",
                    cursor: "pointer",
                    gap: "0.5rem"
                  }}
                >
                  {/* 左側: アイコン & 名前 & 日付 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", minWidth: 0, flexShrink: 0 }}>
                    <span style={{ fontSize: "1.35rem" }}>{isHusband ? "👨‍💻" : "👩‍🎨"}</span>
                    <span style={{ fontWeight: 900, color: "#fff", fontSize: "0.95rem", whiteSpace: "nowrap" }}>
                      {l.date ? l.date.replace(/^\d{4}-/, "") : ""}
                    </span>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      padding: "0.1rem 0.45rem", 
                      borderRadius: "var(--radius-full)", 
                      background: isHusband ? "rgba(56, 189, 248, 0.2)" : "rgba(244, 114, 182, 0.2)",
                      color: userColor,
                      fontWeight: 800,
                      whiteSpace: "nowrap"
                    }}>
                      {userName}
                    </span>
                  </div>

                  {/* 右側: 体重・体脂肪率・ウエスト・編集ボタン */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontWeight: 900, flexShrink: 0 }}>
                    {l.weight && (
                      <span style={{ color: userColor, fontSize: "1.15rem", whiteSpace: "nowrap" }}>
                        {l.weight}kg
                      </span>
                    )}
                    {l.bodyFat && (
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                        {l.bodyFat}%
                      </span>
                    )}
                    {l.waist && (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                        {l.waist}cm
                      </span>
                    )}
                    <Edit3 size={15} style={{ color: "var(--text-muted)", marginLeft: "0.1rem" }} />
                  </div>
                </div>

                {/* メモがある場合：タップで表示できるボタン＆展開パネル */}
                {l.memo && (
                  <div style={{ borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
                    <div 
                      onClick={() => setExpandedId(prev => prev === l.id ? null : l.id)}
                      style={{
                        padding: "0.35rem 0.85rem",
                        background: "rgba(255,255,255,0.02)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        color: "#38bdf8",
                        fontWeight: 700
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        💬 メモあり {isMemoOpen ? "(タップで閉じる)" : "(タップで見る)"}
                      </span>
                      <span>{isMemoOpen ? "▲" : "▼"}</span>
                    </div>

                    {isMemoOpen && (
                      <div style={{
                        padding: "0.6rem 0.85rem",
                        background: "rgba(0,0,0,0.3)",
                        color: "#f8fafc",
                        fontSize: "0.9rem",
                        lineHeight: 1.4,
                        fontWeight: 600
                      }}>
                        {l.memo}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

