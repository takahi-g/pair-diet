import React, { useState } from "react";
import { Settings, UserCheck, Shield, Cloud, Save, RefreshCw } from "lucide-react";

export default function SettingsModal({ profiles, onUpdateProfiles, onClose, syncStatus, onManualSync }) {
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
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      zIndex: 999
    }}>
      <div 
        className="card animate-pop" 
        style={{ 
          maxWidth: "460px", 
          width: "100%", 
          maxHeight: "90vh", 
          overflowY: "auto",
          border: "1px solid rgba(255,255,255,0.15)"
        }}
      >
        <div className="card-header">
          <div className="card-title">
            <Settings size={20} style={{ color: "var(--accent-primary)" }} />
            <span>設定 & 夫婦同期情報</span>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: "none", 
              border: "none", 
              color: "var(--text-secondary)", 
              fontSize: "1.2rem", 
              cursor: "pointer" 
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* 夫の設定 */}
          <div style={{ padding: "0.75rem", background: "rgba(56, 189, 248, 0.05)", borderRadius: "var(--radius-md)", border: "1px solid rgba(56, 189, 248, 0.2)", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#38bdf8", marginBottom: "0.5rem" }}>
              👨‍💻 旦那さんの目標設定
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>ニックネーム</label>
                <input 
                  type="text" 
                  className="input-style" 
                  value={formData.husband.name} 
                  onChange={(e) => handleChange("husband", "name", e.target.value)} 
                />
              </div>
              <div>
                <label style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>目標体重 (kg)</label>
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
          <div style={{ padding: "0.75rem", background: "rgba(244, 114, 182, 0.05)", borderRadius: "var(--radius-md)", border: "1px solid rgba(244, 114, 182, 0.2)", marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#f472b6", marginBottom: "0.5rem" }}>
              👩‍🎨 奥さんの目標設定
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>ニックネーム</label>
                <input 
                  type="text" 
                  className="input-style" 
                  value={formData.wife.name} 
                  onChange={(e) => handleChange("wife", "name", e.target.value)} 
                />
              </div>
              <div>
                <label style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>目標体重 (kg)</label>
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
          <div style={{ padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)", marginBottom: "1rem", fontSize: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <span style={{ fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Cloud size={14} /> 夫婦データ同期
              </span>
              <button
                type="button"
                onClick={onManualSync}
                style={{
                  background: "none",
                  border: "none",
                  color: "#38bdf8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  fontSize: "0.7rem"
                }}
              >
                <RefreshCw size={11} /> 今すぐ手動同期
              </button>
            </div>
            <div style={{ color: "var(--text-muted)", lineHeight: 1.4 }}>
              家計簿アプリと同様に、ローカル保護 ＋ クラウドリアルタイム共有に対応しています。
            </div>
          </div>

          {/* 保存ボタン */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Save size={16} /> 保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
