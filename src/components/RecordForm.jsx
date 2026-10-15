import React, { useState, useEffect } from "react";
import { PlusCircle, Calendar, Footprints, Sparkles, SlidersHorizontal, Keyboard } from "lucide-react";
import WheelPicker from "./WheelPicker";

export default function RecordForm({ profiles, logs = [], onAddLog, defaultUser = "wife" }) {
  const [user, setUser] = useState(defaultUser);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [waist, setWaist] = useState("");
  const [steps, setSteps] = useState("");
  const [memo, setMemo] = useState("");
  const [inputMode, setInputMode] = useState("wheel"); // "wheel" (くるくるドラムロール) or "direct" (通常入力)
  const [showSuccess, setShowSuccess] = useState(false);

  // ユーザー切り替え時や初期表示時に、そのユーザーの最新記録を初期値にセット（今の数字からくるくる回せるように）
  useEffect(() => {
    const userLogs = logs
      .filter(l => l.user === user)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const latest = userLogs[0];
    if (latest) {
      if (latest.weight) setWeight(String(latest.weight));
      if (latest.bodyFat) setBodyFat(String(latest.bodyFat));
      if (latest.waist) setWaist(String(latest.waist));
    } else {
      // ログがない場合の初期値
      if (user === "wife") {
        setWeight("52.8");
        setBodyFat("23.5");
        setWaist("66.5");
      } else {
        setWeight("68.0");
        setBodyFat("21.0");
        setWaist("82.0");
      }
    }
  }, [user, logs]);

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

    setSteps("");
    setMemo("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isHusband = user === "husband";
  const buttonsOrder = defaultUser === "wife" ? ["wife", "husband"] : ["husband", "wife"];
  const accentColor = isHusband ? "var(--accent-husband)" : "var(--accent-wife)";

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

        {/* 入力モード切り替えバー（くるくるピッカー / 直接数字入力） */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "0.65rem",
          padding: "0 0.2rem"
        }}>
          <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-secondary)" }}>
            数値入力（前回値から設定）
          </span>
          <button
            type="button"
            onClick={() => setInputMode(prev => prev === "wheel" ? "direct" : "wheel")}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "var(--radius-full)",
              padding: "0.25rem 0.65rem",
              fontSize: "0.8rem",
              fontWeight: 800,
              color: "#38bdf8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem"
            }}
          >
            {inputMode === "wheel" ? (
              <>
                <Keyboard size={14} />
                <span>キーボード入力にする</span>
              </>
            ) : (
              <>
                <SlidersHorizontal size={14} />
                <span>くるくるピッカーにする</span>
              </>
            )}
          </button>
        </div>

        {/* 体重・体脂肪率・ウエストの「くるくる回せる」ドラムロールピッカー */}
        {inputMode === "wheel" ? (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))", 
            gap: "0.45rem", 
            marginBottom: "1rem",
            width: "100%",
            boxSizing: "border-box"
          }}>
            {/* 体重ピッカー (30.0kg 〜 120.0kg) */}
            <WheelPicker
              label="体重"
              unit="kg"
              value={weight}
              onChange={setWeight}
              min={35.0}
              max={110.0}
              step={0.1}
              color={accentColor}
            />

            {/* 体脂肪率ピッカー (5.0% 〜 55.0%) */}
            <WheelPicker
              label="体脂肪率"
              unit="%"
              value={bodyFat}
              onChange={setBodyFat}
              min={8.0}
              max={50.0}
              step={0.1}
              color="#ec4899"
            />

            {/* ウエストピッカー (45.0cm 〜 130.0cm) */}
            <WheelPicker
              label="ウエスト"
              unit="cm"
              value={waist}
              onChange={setWaist}
              min={50.0}
              max={120.0}
              step={0.5}
              color="#10b981"
            />
          </div>
        ) : (
          /* 直接入力モード */
          <div className="grid-3-inputs" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.45rem", marginBottom: "1rem" }}>
            <div className="form-group" style={{ minWidth: 0 }}>
              <label style={{ whiteSpace: "nowrap", textAlign: "center" }}>体重 (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="例: 52.8"
                className="input-style"
                style={{ padding: "0.75rem 0.35rem", textAlign: "center" }}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ minWidth: 0 }}>
              <label style={{ whiteSpace: "nowrap", textAlign: "center" }}>体脂肪率 (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="例: 23.5"
                className="input-style"
                style={{ padding: "0.75rem 0.35rem", textAlign: "center" }}
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ minWidth: 0 }}>
              <label style={{ whiteSpace: "nowrap", textAlign: "center" }}>ウエスト (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="例: 66.5"
                className="input-style"
                style={{ padding: "0.75rem 0.35rem", textAlign: "center" }}
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
            </div>
          </div>
        )}

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
              padding: "0.75rem",
              background: "rgba(16, 185, 129, 0.2)",
              border: "1.5px solid rgba(16, 185, 129, 0.5)",
              borderRadius: "var(--radius-md)",
              color: "#34d399",
              fontSize: "1.05rem",
              fontWeight: 900,
              textAlign: "center"
            }}
          >
            保存しました
          </div>
        )}
      </form>
    </div>
  );
}
