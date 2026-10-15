import React, { useState } from "react";
import { Settings, Cloud, Save, RefreshCw, Type } from "lucide-react";

export default function SettingsModal({ 
  profiles, 
  onUpdateProfiles, 
  onClose, 
  syncStatus, 
  onManualSync,
  textSize,
  onToggleTextSize
}) {
  const [formData, setFormData] = useState({ ...profiles });

  const handleChange = (userKey, field, val) => {
    setFormData(prev => ({
      ...prev,
      [userKey]: {
        ...prev[userKey],
        [field]: val
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfiles(formData);
    onClose();
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
      zIndex: 999
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
            <Settings size={24} style={{ color: "var(--accent-primary)" }} />
            <span>設定 & 文字サイズ</span>
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

        {/* 文字サイズ切り替えスイッチ */}
        <div style={{ padding: "0.9rem", background: "rgba(99, 102, 241, 0.15)", borderRadius: "var(--radius-md)", border: "1.5px solid rgba(99, 102, 241, 0.4)", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Type size={22} style={{ color: "#a5b4fc" }} />
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 900, color: "#fff" }}>文字サイズ（老眼対応）</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>全体をさらに大きく見やすくします</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleTextSize}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: textSize === "large" ? "var(--gradient-primary)" : "rgba(255,255,255,0.12)",
                color: "#fff",
                fontWeight: 900,
                fontSize: "0.95rem",
                cursor: "pointer"
              }}
            >
              {textSize === "large" ? "🔍 特大モード中" : "標準サイズ"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave}>
          {/* 夫の設定 */}
          <div style={{ padding: "0.9rem", background: "rgba(56, 189, 248, 0.08)", borderRadius: "var(--radius-md)", border: "1.5px solid rgba(56, 189, 248, 0.3)", marginBottom: "0.9rem" }}>
            <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#38bdf8", marginBottom: "0.6rem" }}>
              👨‍💻 旦那さんの目標設定
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>名前</label>
                <input 
                  type="text" 
                  className="input-style" 
                  value={formData.husband.name} 
                  onChange={(e) => handleChange("husband", "name", e.target.value)} 
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>目標体重 (kg)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="input-style" 
                  value={formData.husband.targetWeight || ""} 
                  onChange={(e) => handleChange("husband", "targetWeight", parseFloat(e.target.value))} 
                />
              </div>
            </div>
          </div>

          {/* 妻の設定 */}
          <div style={{ padding: "0.9rem", background: "rgba(244, 114, 182, 0.08)", borderRadius: "var(--radius-md)", border: "1.5px solid rgba(244, 114, 182, 0.3)", marginBottom: "1.2rem" }}>
            <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#f472b6", marginBottom: "0.6rem" }}>
              👩‍🎨 奥さんの目標設定
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>名前</label>
                <input 
                  type="text" 
                  className="input-style" 
                  value={formData.wife.name} 
                  onChange={(e) => handleChange("wife", "name", e.target.value)} 
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 800 }}>目標体重 (kg)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="input-style" 
                  value={formData.wife.targetWeight || ""} 
                  onChange={(e) => handleChange("wife", "targetWeight", parseFloat(e.target.value))} 
                />
              </div>
            </div>
          </div>

          {/* クラウド同期ステータス */}
          <div style={{ padding: "0.85rem", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-md)", marginBottom: "1.2rem", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.95rem" }}>
                <Cloud size={16} /> 夫婦データ同期
              </span>
              <button
                type="button"
                onClick={onManualSync}
                style={{
                  background: "rgba(56, 189, 248, 0.15)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  color: "#38bdf8",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "var(--radius-full)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "0.8rem",
                  fontWeight: 800
                }}
              >
                <RefreshCw size={12} /> 手動再取得
              </button>
            </div>
            <div style={{ color: "var(--text-secondary)", lineHeight: 1.4 }}>
              クラウド（takahi-g/pair-diet/db.json）でリアルタイム同期中。どの端末からでも同じデータが反映されます。
            </div>
          </div>

          {/* 保存ボタン */}
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1, padding: "0.85rem" }}>
              閉じる
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "0.85rem" }}>
              <Save size={18} /> 保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
