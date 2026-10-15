import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Calendar, Scale, Footprints, Save, X } from "lucide-react";
import WheelPicker from "./WheelPicker";

export default function EditLogModal({ log, profiles, onSave, onDelete, onClose }) {
  const [date, setDate] = useState(log ? log.date : "");
  const [weight, setWeight] = useState(log && log.weight != null ? String(log.weight) : "");
  const [bodyFat, setBodyFat] = useState(log && log.bodyFat != null ? String(log.bodyFat) : "");
  const [waist, setWaist] = useState(log && log.waist != null ? String(log.waist) : "");
  const [steps, setSteps] = useState(log && log.steps != null ? String(log.steps) : "");
  const [memo, setMemo] = useState(log ? log.memo || "" : "");
  const [user, setUser] = useState(log ? log.user : "husband");

  if (!log) return null;

  const isHusband = user === "husband";
  const userColor = isHusband ? "var(--accent-husband)" : "var(--accent-wife)";
  const userProfile = profiles[user] || { name: isHusband ? "パパ" : "ママ", avatar: isHusband ? "👨‍💻" : "👩‍🎨" };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...log,
      date,
      user,
      weight: weight ? parseFloat(weight) : null,
      bodyFat: bodyFat ? parseFloat(bodyFat) : null,
      waist: waist ? parseFloat(waist) : null,
      steps: steps ? parseInt(steps, 10) : 0,
      memo: memo.trim()
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("この記録を削除してもよろしいですか？")) {
      onDelete(log.id);
      onClose();
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      zIndex: 1000
    }}>
      <div 
        className="card animate-pop" 
        style={{ 
          maxWidth: "480px", 
          width: "100%", 
          maxHeight: "90vh", 
          overflowY: "auto",
          border: "2px solid rgba(255,255,255,0.2)"
        }}
      >
        <div className="card-header">
          <div className="card-title" style={{ fontSize: "1.25rem" }}>
            <Edit2 size={22} style={{ color: "var(--accent-primary)" }} />
            <span>記録の編集 ({userProfile.name})</span>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: "none", 
              border: "none", 
              color: "var(--text-secondary)", 
              fontSize: "1.5rem", 
              cursor: "pointer",
              padding: "0.2rem 0.5rem"
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 記録者切り替え */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={() => setUser("husband")}
              style={{
                padding: "0.6rem",
                borderRadius: "var(--radius-md)",
                border: `2px solid ${isHusband ? "var(--accent-husband)" : "rgba(255,255,255,0.1)"}`,
                background: isHusband ? "rgba(56, 189, 248, 0.2)" : "rgba(255,255,255,0.04)",
                color: isHusband ? "#38bdf8" : "var(--text-secondary)",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer"
              }}
            >
              👨‍💻 {profiles.husband.name}
            </button>
            <button
              type="button"
              onClick={() => setUser("wife")}
              style={{
                padding: "0.6rem",
                borderRadius: "var(--radius-md)",
                border: `2px solid ${!isHusband ? "var(--accent-wife)" : "rgba(255,255,255,0.1)"}`,
                background: !isHusband ? "rgba(244, 114, 182, 0.2)" : "rgba(255,255,255,0.04)",
                color: !isHusband ? "#f472b6" : "var(--text-secondary)",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer"
              }}
            >
              👩‍🎨 {profiles.wife.name}
            </button>
          </div>

          {/* 日付 */}
          <div className="form-group">
            <label style={{ fontSize: "1rem", fontWeight: 800, color: "#fff" }}>
              📅 日付
            </label>
            <input
              type="date"
              className="input-style"
              style={{ fontSize: "1.2rem", fontWeight: 800 }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* 体重・体脂肪率・ウエスト */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))", 
            gap: "0.45rem", 
            marginBottom: "0.85rem",
            width: "100%",
            boxSizing: "border-box"
          }}>
            <WheelPicker
              label="体重"
              unit="kg"
              value={weight}
              onChange={setWeight}
              min={35.0}
              max={110.0}
              step={0.1}
              color={userColor}
            />
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

          {/* 歩数 */}
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Footprints size={18} style={{ color: "#38bdf8" }} /> 今日の歩数
            </label>
            <input
              type="number"
              className="input-style"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
            />
          </div>

          {/* メモ */}
          <div className="form-group">
            <label>ひと言メモ</label>
            <input
              type="text"
              className="input-style"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>

          {/* アクションボタン */}
          <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.2rem" }}>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1.5px solid rgba(239, 68, 68, 0.4)",
                color: "#f87171",
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-full)",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem"
              }}
            >
              <Trash2 size={16} /> 削除
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1, padding: "0.85rem" }}
            >
              キャンセル
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1.2, padding: "0.85rem" }}
            >
              <Save size={18} /> 保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
