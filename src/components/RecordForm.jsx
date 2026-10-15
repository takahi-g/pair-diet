import React, { useState, useEffect } from "react";
import { PlusCircle, Calendar, Footprints, Sparkles } from "lucide-react";

export default function RecordForm({ profiles, onAddLog, defaultUser = "wife" }) {
  const [user, setUser] = useState(defaultUser);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [waist, setWaist] = useState("");
  const [steps, setSteps] = useState("");
  const [memo, setMemo] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setUser(defaultUser);
  }, [defaultUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight && !steps && !bodyFat && !waist) {
      alert("体重または歩数のどちらかを入力してください！");
      return;
    }

    const newLog = {
      id: `log-${Date.now()}`,
      date,
      user,
      weight: weight ? parseFloat(weight) : null,
      bodyFat: bodyFat ? parseFloat(bodyFat) : null,
      waist: waist ? parseFloat(waist) : null,
      steps: steps ? parseInt(steps, 10) : 0,
      memo: memo.trim(),
      createdAt: new Date().toISOString()
    };

    onAddLog(newLog);

    setWeight("");
    setBodyFat("");
    setWaist("");
    setSteps("");
    setMemo("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isHusband = user === "husband";
  // defaultUser がママの場合はママを左（最初）に表示
  const buttonsOrder = defaultUser === "wife" ? ["wife", "husband"] : ["husband", "wife"];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <PlusCircle size={24} style={{ color: "var(--accent-emerald)" }} />
          <span>今日の記録をつける</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 記録者の選択（defaultUserに応じて左/右を入れ替え） */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1.2rem" }}>
          {buttonsOrder.map(uKey => {
            const isSelected = user === uKey;
            const isH = uKey === "husband";
            const color = isH ? "var(--accent-husband)" : "var(--accent-wife)";
            const bg = isH ? "rgba(56, 189, 248, 0.2)" : "rgba(244, 114, 182, 0.2)";

            return (
              <button
                key={uKey}
                type="button"
                onClick={() => setUser(uKey)}
                style={{
                  padding: "0.85rem 0.5rem",
                  borderRadius: "var(--radius-md)",
                  border: `2.5px solid ${isSelected ? color : "rgba(255,255,255,0.12)"}`,
                  background: isSelected ? bg : "rgba(255,255,255,0.04)",
                  color: isSelected ? (isH ? "#38bdf8" : "#f472b6") : "var(--text-secondary)",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{profiles[uKey].avatar}</span>
                <span>{profiles[uKey].name}</span>
              </button>
            );
          })}
        </div>

        {/* 日付 */}
        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Calendar size={18} /> 記録日付
          </label>
          <input
            type="date"
            className="input-style"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* 体重・体脂肪率・ウエスト入力 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
          <div className="form-group">
            <label>体重 (kg)</label>
            <input
              type="number"
              step="0.1"
              placeholder="例: 52.8"
              className="input-style"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>体脂肪率 (%)</label>
            <input
              type="number"
              step="0.1"
              placeholder="例: 23.5"
              className="input-style"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>ウエスト (cm)</label>
            <input
              type="number"
              step="0.5"
              placeholder="例: 66.5"
              className="input-style"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
            />
          </div>
        </div>

        {/* 歩数入力 */}
        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Footprints size={18} style={{ color: "#38bdf8" }} /> 今日の歩数 (日本一周に加算！)
          </label>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <input
              type="number"
              placeholder="例: 8000"
              className="input-style"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
            />
            {/* クイック加算ボタン */}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                type="button"
                onClick={() => setSteps(String((parseInt(steps || "0", 10) + 1000)))}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1.5px solid var(--border-color)",
                  color: "#fff",
                  borderRadius: "var(--radius-md)",
                  padding: "0 0.8rem",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                +1,000
              </button>
              <button
                type="button"
                onClick={() => setSteps(String((parseInt(steps || "0", 10) + 5000)))}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1.5px solid var(--border-color)",
                  color: "#fff",
                  borderRadius: "var(--radius-md)",
                  padding: "0 0.8rem",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                +5,000
              </button>
            </div>
          </div>
        </div>

        {/* ひと言メモ */}
        <div className="form-group">
          <label>ひと言メモ / 今日の頑張り</label>
          <input
            type="text"
            placeholder="例: たくさん歩いた！お野菜食べた！"
            className="input-style"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={60}
          />
        </div>

        {/* 登録ボタン */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "0.6rem", padding: "1rem" }}
        >
          <Sparkles size={20} />
          <span>記録を保存する</span>
        </button>

        {showSuccess && (
          <div
            className="animate-pop"
            style={{
              marginTop: "0.85rem",
              padding: "0.85rem",
              background: "rgba(16, 185, 129, 0.2)",
              border: "1.5px solid rgba(16, 185, 129, 0.5)",
              borderRadius: "var(--radius-md)",
              color: "#34d399",
              fontSize: "1rem",
              fontWeight: 800,
              textAlign: "center"
            }}
          >
            🎉 記録しました！日本一周マップに歩数が反映されました！
          </div>
        )}
      </form>
    </div>
  );
}
