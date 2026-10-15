import React, { useMemo } from "react";
import { MapPin, Footprints, Award, Flag, ChevronRight, Sparkles } from "lucide-react";
import { STATIONS, TOTAL_KM, KM_PER_STEP } from "../utils/stations";

export default function JapanWalkGame({ logs, profiles }) {
  // 夫と妻の総歩数と距離
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
    const husbandKm = (husbandSteps * KM_PER_STEP).toFixed(1);
    const wifeKm = (wifeSteps * KM_PER_STEP).toFixed(1);

    // 現在到達しているステーションを特定
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
    
    // 次の駅までの残り距離
    const distToNext = nextStation ? Math.max(0, (nextStation.targetKm - Number(totalKm))).toFixed(1) : 0;
    const stepsToNext = Math.ceil(Number(distToNext) / KM_PER_STEP);

    // 進捗率
    const progressPercent = Math.min(100, ((Number(totalKm) / TOTAL_KM) * 100)).toFixed(1);

    return {
      husbandSteps,
      wifeSteps,
      totalSteps,
      totalKm,
      husbandKm,
      wifeKm,
      currentStation,
      currentStationIndex,
      nextStation,
      distToNext,
      stepsToNext,
      progressPercent
    };
  }, [logs]);

  return (
    <div>
      {/* 2人の総歩数・現在地ハイライトカード */}
      <div 
        className="card"
        style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%), var(--bg-card)",
          border: "1px solid rgba(16, 185, 129, 0.3)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="card-title" style={{ color: "#34d399" }}>
            <Footprints size={20} />
            <span>2人の日本一周ウォーク</span>
          </div>
          <span 
            style={{ 
              fontSize: "0.75rem", 
              fontWeight: 800, 
              background: "rgba(16, 185, 129, 0.2)", 
              color: "#34d399", 
              padding: "0.2rem 0.6rem", 
              borderRadius: "var(--radius-full)" 
            }}
          >
            進捗 {stats.progressPercent}%
          </span>
        </div>

        {/* 総歩数 & 距離 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", margin: "0.85rem 0" }}>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "0.75rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700 }}>2人の合計歩数</div>
            <div style={{ fontSize: "1.45rem", fontWeight: 900, color: "#38bdf8", marginTop: "0.15rem" }}>
              {stats.totalSteps.toLocaleString()} <span style={{ fontSize: "0.85rem" }}>歩</span>
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              👨‍💻 {stats.husbandSteps.toLocaleString()}歩 ＋ 👩‍🎨 {stats.wifeSteps.toLocaleString()}歩
            </div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "0.75rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", fontWeight: 700 }}>踏破した総距離</div>
            <div style={{ fontSize: "1.45rem", fontWeight: 900, color: "#34d399", marginTop: "0.15rem" }}>
              {stats.totalKm} <span style={{ fontSize: "0.85rem" }}>km</span>
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              全行程 4,200km中
            </div>
          </div>
        </div>

        {/* 日本一周プログレスバー */}
        <div style={{ marginTop: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
            <span>🚩 東京・日本橋</span>
            <span>🏆 ゴール (4,200km)</span>
          </div>
          <div style={{ width: "100%", height: "12px", background: "rgba(255,255,255,0.08)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
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
        <div style={{ marginTop: "1rem", background: "rgba(0, 0, 0, 0.3)", borderRadius: "var(--radius-md)", padding: "0.85rem", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "2rem" }}>{stats.currentStation.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 800 }}>現在地（チェックポイント）</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff" }}>
                {stats.currentStation.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>
                {stats.currentStation.spot}
              </div>
            </div>
          </div>

          {stats.nextStation && stats.nextStation.id !== stats.currentStation.id && (
            <div style={{ marginTop: "0.75rem", paddingTop: "0.6rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.75rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>次の目的地: </span>
                <strong>{stats.nextStation.name}</strong> ({stats.nextStation.pref})
              </div>
              <div style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: 800 }}>
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
            <MapPin size={18} style={{ color: "var(--accent-primary)" }} />
            <span>日本一周ルート（ご当地バッジ）</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {STATIONS.map((station, index) => {
            const isReached = Number(stats.totalKm) >= station.targetKm;
            const isCurrent = station.id === stats.currentStation.id;

            return (
              <div
                key={station.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  background: isCurrent 
                    ? "rgba(16, 185, 129, 0.15)" 
                    : isReached 
                    ? "rgba(255,255,255,0.04)" 
                    : "rgba(255,255,255,0.01)",
                  border: isCurrent 
                    ? "2px solid #10b981" 
                    : isReached 
                    ? "1px solid rgba(16, 185, 129, 0.3)" 
                    : "1px solid rgba(255,255,255,0.04)",
                  opacity: isReached ? 1 : 0.5
                }}
              >
                <div style={{ fontSize: "1.75rem", filter: isReached ? "none" : "grayscale(100%)" }}>
                  {station.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.9rem", color: isReached ? "#fff" : "var(--text-muted)" }}>
                      {station.name}
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                      {station.targetKm}km
                    </span>
                    {isCurrent && (
                      <span style={{ fontSize: "0.65rem", background: "#10b981", color: "#fff", fontWeight: 800, padding: "0.1rem 0.4rem", borderRadius: "var(--radius-full)" }}>
                        現在地
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.725rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                    {station.spot}
                  </div>
                </div>

                {/* 報酬・獲得バッジ */}
                <div>
                  {isReached ? (
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.65rem", color: "#f59e0b", fontWeight: 800, display: "block" }}>
                        🏆 獲得！
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-primary)" }}>
                        {station.reward}
                      </span>
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
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
