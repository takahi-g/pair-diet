import React, { useMemo } from "react";
import { MapPin, Footprints, Calendar, Sparkles } from "lucide-react";
import { STATIONS, TOTAL_KM, KM_PER_STEP, DEPARTURE_DATE, START_STATION_NAME } from "../utils/stations";

export default function JapanWalkGame({ logs }) {
  const stats = useMemo(() => {
    let husbandSteps = 0;
    let wifeSteps = 0;

    logs.forEach(l => {
      const s = Number(l.steps || 0);
      if (l.user === "husband") husbandSteps += s;
      if (l.user === "wife") wifeSteps += s;
    });

    const totalSteps = husbandSteps + wifeSteps;
    const totalKm = (totalSteps * KM_PER_STEP).toFixed(1);

    let currentStationIndex = 0;
    for (let i = 0; i < STATIONS.length; i++) {
      if (Number(totalKm) >= STATIONS[i].targetKm) {
        currentStationIndex = i;
      } else {
        break;
      }
    }

    const currentStation = STATIONS[currentStationIndex];
    const nextStation = STATIONS[currentStationIndex + 1] || currentStation;
    
    const distToNext = nextStation ? Math.max(0, (nextStation.targetKm - Number(totalKm))).toFixed(1) : 0;
    const stepsToNext = Math.ceil(Number(distToNext) / KM_PER_STEP);
    const progressPercent = Math.min(100, ((Number(totalKm) / TOTAL_KM) * 100)).toFixed(1);

    return {
      husbandSteps,
      wifeSteps,
      totalSteps,
      totalKm,
      currentStation,
      nextStation,
      distToNext,
      stepsToNext,
      progressPercent
    };
  }, [logs]);

  return (
    <div>
      {/* 出発情報＆ハイライトカード */}
      <div 
        className="card"
        style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%), var(--bg-card)",
          border: "1.5px solid rgba(16, 185, 129, 0.4)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="card-title" style={{ color: "#34d399", fontSize: "1.25rem" }}>
            <Footprints size={24} />
            <span>2人の日本一周ウォーク</span>
          </div>
          <span 
            style={{ 
              fontSize: "0.95rem", 
              fontWeight: 900, 
              background: "rgba(16, 185, 129, 0.25)", 
              color: "#34d399", 
              padding: "0.3rem 0.8rem", 
              borderRadius: "var(--radius-full)" 
            }}
          >
            進捗 {stats.progressPercent}%
          </span>
        </div>

        {/* 出発地 ＆ 出発日バナー */}
        <div style={{ margin: "0.85rem 0", padding: "0.75rem 0.95rem", background: "rgba(0,0,0,0.45)", borderRadius: "var(--radius-md)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#f59e0b", fontWeight: 900, fontSize: "0.95rem" }}>
            <Calendar size={16} />
            <span>出発日: {DEPARTURE_DATE}（明日スタート！）</span>
          </div>
          <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#fff", marginTop: "0.25rem" }}>
            🚩 出発地点: {START_STATION_NAME}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
            二日市駅を出発して日本全国を巡り、再び二日市駅へ戻ってくる大冒険！
          </div>
        </div>

        {/* 総歩数 & 距離 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", margin: "1rem 0" }}>
          <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "0.9rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>2人の合計歩数</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#38bdf8", marginTop: "0.2rem" }}>
              {stats.totalSteps.toLocaleString()} <span style={{ fontSize: "1rem" }}>歩</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.3rem", fontWeight: 700 }}>
              👨‍💻 {stats.husbandSteps.toLocaleString()}歩 ＋ 👩‍🎨 {stats.wifeSteps.toLocaleString()}歩
            </div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "0.9rem", borderRadius: "var(--radius-md)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>踏破した総距離</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#34d399", marginTop: "0.2rem" }}>
              {stats.totalKm} <span style={{ fontSize: "1rem" }}>km</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.3rem", fontWeight: 700 }}>
              全行程 4,200km中
            </div>
          </div>
        </div>

        {/* 日本一周プログレスバー */}
        <div style={{ marginTop: "0.6rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800, marginBottom: "0.4rem" }}>
            <span>🚩 JR二日市駅</span>
            <span>🏆 ゴール・二日市駅 (4,200km)</span>
          </div>
          <div style={{ width: "100%", height: "16px", background: "rgba(255,255,255,0.1)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
            <div 
              style={{ 
                width: `${stats.progressPercent}%`, 
                height: "100%", 
                background: "var(--gradient-walk)", 
                borderRadius: "var(--radius-full)",
                transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
              }} 
            />
          </div>
        </div>

        {/* 現在地 & 次のチェックポイント */}
        <div style={{ marginTop: "1.2rem", background: "rgba(0, 0, 0, 0.4)", borderRadius: "var(--radius-md)", padding: "1rem", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ fontSize: "2.6rem" }}>{stats.currentStation.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.85rem", color: "#34d399", fontWeight: 900 }}>現在地（チェックポイント）</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#fff", marginTop: "0.1rem" }}>
                {stats.currentStation.name}
              </div>
              <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.2rem", lineHeight: 1.4 }}>
                {stats.currentStation.spot}
              </div>
            </div>
          </div>

          {stats.nextStation && stats.nextStation.id !== stats.currentStation.id && (
            <div style={{ marginTop: "0.9rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.95rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>次の目的地: </span>
                <strong style={{ fontSize: "1.05rem" }}>{stats.nextStation.name}</strong> ({stats.nextStation.pref})
              </div>
              <div style={{ fontSize: "0.95rem", color: "#f59e0b", fontWeight: 900 }}>
                あと {stats.distToNext} km (約{stats.stepsToNext.toLocaleString()}歩)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* すごろく・ルートマップ一覧 */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <MapPin size={22} style={{ color: "var(--accent-primary)" }} />
            <span>筑紫野・二日市駅発 日本一周ルート</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {STATIONS.map((station) => {
            const isReached = Number(stats.totalKm) >= station.targetKm;
            const isCurrent = station.id === stats.currentStation.id;

            return (
              <div
                key={station.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.9rem",
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: isCurrent 
                    ? "rgba(16, 185, 129, 0.2)" 
                    : isReached 
                    ? "rgba(255,255,255,0.06)" 
                    : "rgba(255,255,255,0.02)",
                  border: isCurrent 
                    ? "2.5px solid #10b981" 
                    : isReached 
                    ? "1px solid rgba(16, 185, 129, 0.4)" 
                    : "1px solid rgba(255,255,255,0.05)",
                  opacity: isReached ? 1 : 0.6
                }}
              >
                <div style={{ fontSize: "2.3rem", filter: isReached ? "none" : "grayscale(100%)" }}>
                  {station.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 900, fontSize: "1.1rem", color: isReached ? "#fff" : "var(--text-muted)" }}>
                      {station.name}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 700 }}>
                      {station.targetKm}km
                    </span>
                    {isCurrent && (
                      <span style={{ fontSize: "0.75rem", background: "#10b981", color: "#fff", fontWeight: 900, padding: "0.15rem 0.5rem", borderRadius: "var(--radius-full)" }}>
                        現在地
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                    {station.spot}
                  </div>
                </div>

                <div>
                  {isReached ? (
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: 900, display: "block" }}>
                        🏆 獲得！
                      </span>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 800 }}>
                        {station.reward}
                      </span>
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 700 }}>
                      🔒 未到達
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
