import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  PlusCircle, 
  Footprints, 
  TrendingDown, 
  MessageSquareHeart, 
  Settings, 
  RefreshCw, 
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Heart
} from "lucide-react";
import PairDashboard from "./components/PairDashboard";
import RecordForm from "./components/RecordForm";
import JapanWalkGame from "./components/JapanWalkGame";
import DietChart from "./components/DietChart";
import ReactionCenter from "./components/ReactionCenter";
import SettingsModal from "./components/SettingsModal";
import EditLogModal from "./components/EditLogModal";
import { DEFAULT_PROFILES, DEFAULT_LOGS, DEFAULT_REACTIONS } from "./utils/mockData";
import { fetchDietDataFromGitHub, saveDietDataToGitHub } from "./utils/githubSync";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, record, walk, chart, reactions
  const [showSettings, setShowSettings] = useState(false);
  const [editingLog, setEditingLog] = useState(null); // タップして編集する対象ログ
  const [dbSyncStatus, setDbSyncStatus] = useState("local"); // local, syncing, success, error
  const isInitialLoad = useRef(true);

  // 1. プロファイル (デフォルトを確実にパパ & ママに)
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem("pair_diet_profiles");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.husband && (parsed.husband.name === "旦那さん" || !parsed.husband.name)) {
          parsed.husband.name = "パパ";
        }
        if (parsed.wife && (parsed.wife.name === "奥さん" || !parsed.wife.name)) {
          parsed.wife.name = "ママ";
        }
        return parsed;
      }
      return DEFAULT_PROFILES;
    } catch {
      return DEFAULT_PROFILES;
    }
  });

  // 2. ダイエット＆歩数ログ
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem("pair_diet_logs");
      return saved ? JSON.parse(saved) : DEFAULT_LOGS;
    } catch {
      return DEFAULT_LOGS;
    }
  });

  // 3. リアクション履歴
  const [reactions, setReactions] = useState(() => {
    try {
      const saved = localStorage.getItem("pair_diet_reactions");
      return saved ? JSON.parse(saved) : DEFAULT_REACTIONS;
    } catch {
      return DEFAULT_REACTIONS;
    }
  });

  // LocalStorageへの自動保存
  useEffect(() => {
    localStorage.setItem("pair_diet_profiles", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("pair_diet_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("pair_diet_reactions", JSON.stringify(reactions));
  }, [reactions]);

  // アプリ起動時に GitHub (db.json) からデータを自動読み込み
  useEffect(() => {
    const initFetch = async () => {
      setDbSyncStatus("syncing");
      try {
        const cloudData = await fetchDietDataFromGitHub();
        if (cloudData) {
          if (cloudData.profiles) setProfiles(cloudData.profiles);
          if (cloudData.logs && Array.isArray(cloudData.logs)) setLogs(cloudData.logs);
          if (cloudData.reactions && Array.isArray(cloudData.reactions)) setReactions(cloudData.reactions);
          setDbSyncStatus("success");
        } else {
          // クラウドに初回データがない場合は初期データをPush
          await saveDietDataToGitHub({ profiles, logs, reactions });
          setDbSyncStatus("success");
        }
      } catch (e) {
        console.warn("クラウド自動取得エラー (オフライン/ローカル利用可能):", e);
        setDbSyncStatus("error");
      } finally {
        isInitialLoad.current = false;
      }
    };
    initFetch();
  }, []);

  // クラウドへのデータ保存関数
  const syncToCloud = async (newProfiles = profiles, newLogs = logs, newReactions = reactions) => {
    setDbSyncStatus("syncing");
    try {
      await saveDietDataToGitHub({
        profiles: newProfiles,
        logs: newLogs,
        reactions: newReactions,
        updatedAt: new Date().toISOString()
      });
      setDbSyncStatus("success");
    } catch (e) {
      console.error("クラウド保存失敗:", e);
      setDbSyncStatus("error");
    }
  };

  // プライバシー切り替え
  const handleTogglePrivacy = (userKey) => {
    const updated = {
      ...profiles,
      [userKey]: {
        ...profiles[userKey],
        hideRawNumbers: !profiles[userKey].hideRawNumbers
      }
    };
    setProfiles(updated);
    syncToCloud(updated, logs, reactions);
  };

  // 既存記録の更新（タップ編集）
  const handleUpdateLog = (updatedLog) => {
    const updatedLogs = logs.map(l => l.id === updatedLog.id ? updatedLog : l);
    setLogs(updatedLogs);
    syncToCloud(profiles, updatedLogs, reactions);
  };

  // 記録の削除
  const handleDeleteLog = (logId) => {
    const updatedLogs = logs.filter(l => l.id !== logId);
    setLogs(updatedLogs);
    syncToCloud(profiles, updatedLogs, reactions);
  };

  // 新規記録の追加
  const handleAddLog = (newLog) => {
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    syncToCloud(profiles, updatedLogs, reactions);
  };

  // スタンプ・リアクションの送信
  const handleSendReaction = (newReaction) => {
    const updatedReactions = [newReaction, ...reactions];
    setReactions(updatedReactions);
    syncToCloud(profiles, logs, updatedReactions);
  };

  // プロファイル更新
  const handleUpdateProfiles = (newProfiles) => {
    setProfiles(newProfiles);
    syncToCloud(newProfiles, logs, reactions);
  };

  // 手動再同期・更新ステート
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  // 手動再同期（更新）ボタン
  const handleManualSync = async () => {
    setIsUpdating(true);
    setDbSyncStatus("syncing");
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    const startTime = Date.now();
    try {
      const cloudData = await fetchDietDataFromGitHub();
      if (cloudData) {
        if (cloudData.profiles) setProfiles(cloudData.profiles);
        if (cloudData.logs && Array.isArray(cloudData.logs)) setLogs(cloudData.logs);
        if (cloudData.reactions && Array.isArray(cloudData.reactions)) setReactions(cloudData.reactions);
      }
      setDbSyncStatus("success");
    } catch (e) {
      console.warn("手動更新エラー:", e);
      setDbSyncStatus("error");
    } finally {
      // ユーザーが更新されたことをしっかり視認できるように最低600msは回転を表示
      const elapsed = Date.now() - startTime;
      const waitTime = Math.max(0, 600 - elapsed);
      setTimeout(() => {
        setIsUpdating(false);
        setShowUpdateToast(true);
        setTimeout(() => setShowUpdateToast(false), 2500);
      }, waitTime);
    }
  };

  // 文字サイズ設定 (largeをデフォルトにして老眼でも見やすく)
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem("pair_diet_text_size") || "large";
  });

  const handleToggleTextSize = () => {
    setTextSize(prev => {
      const next = prev === "large" ? "normal" : "large";
      localStorage.setItem("pair_diet_text_size", next);
      return next;
    });
  };

  return (
    <div className={`container ${textSize === "large" ? "text-size-large" : ""}`}>
      {/* ヘッダー */}
      <header>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div className="badge-tag" style={{ margin: 0 }}>
              <Heart size={16} style={{ color: "#f472b6" }} />
              <span>夫婦ペアダイエット</span>
            </div>
            {/* バージョン情報（ビルド日時） */}
            <span 
              style={{ 
                fontSize: "0.75rem", 
                color: "var(--text-muted)", 
                background: "rgba(255,255,255,0.06)", 
                padding: "0.25rem 0.55rem", 
                borderRadius: "var(--radius-full)",
                fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              v{typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "2026.10.15 14:36"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* 文字大切り替えボタン（ヘッダーで即切り替え可能） */}
            <button
              onClick={handleToggleTextSize}
              title="文字サイズ切り替え"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.2rem",
                padding: "0.3rem 0.65rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.8rem",
                fontWeight: 900,
                background: textSize === "large" ? "var(--gradient-primary)" : "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                border: "1px solid var(--border-color)",
                cursor: "pointer"
              }}
            >
              <span>{textSize === "large" ? "🔍 文字特大" : "文字標準"}</span>
            </button>

            {/* 更新ボタン（タップして即座に最新データを同期＆更新） */}
            <button
              onClick={handleManualSync}
              disabled={isUpdating}
              title="タップして最新データに更新"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem 0.75rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.85rem",
                fontWeight: 900,
                background: isUpdating 
                  ? "rgba(56, 189, 248, 0.25)" 
                  : "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
                border: "1.5px solid rgba(56, 189, 248, 0.4)",
                cursor: isUpdating ? "wait" : "pointer",
                transition: "all 0.2s"
              }}
            >
              <RefreshCw size={14} className={isUpdating ? "animate-spin" : ""} />
              <span>{isUpdating ? "更新中..." : "更新"}</span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* 更新完了トースト通知 */}
        {showUpdateToast && (
          <div
            className="animate-pop"
            style={{
              position: "fixed",
              top: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              background: "rgba(16, 185, 129, 0.95)",
              color: "#fff",
              padding: "0.5rem 1.2rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.9rem",
              fontWeight: 900,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <CheckCircle2 size={16} />
            <span>最新データに更新しました！</span>
          </div>
        )}

        <h1 className="main-title">ふたりでダイエット</h1>
        <p className="subtitle">
          毎日の体重・体脂肪・ウエスト & 歩数で日本一周！
        </p>
      </header>

      {/* ナビゲーションタブ（全5タブをスライドさせずに並べて表示） */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <Users size={16} />
          <span>夫婦状況</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "record" ? "active" : ""}`}
          onClick={() => setActiveTab("record")}
        >
          <PlusCircle size={16} />
          <span>記録する</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "walk" ? "active" : ""}`}
          onClick={() => setActiveTab("walk")}
        >
          <Footprints size={16} />
          <span>日本一周</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "chart" ? "active" : ""}`}
          onClick={() => setActiveTab("chart")}
        >
          <TrendingDown size={16} />
          <span>グラフ</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "reactions" ? "active" : ""}`}
          onClick={() => setActiveTab("reactions")}
        >
          <MessageSquareHeart size={16} />
          <span>スタンプ</span>
        </button>
      </nav>

      {/* メインコンテンツ */}
      <main>
        {activeTab === "dashboard" && (
          <PairDashboard
            profiles={profiles}
            logs={logs}
            onSelectLogToEdit={(log) => setEditingLog(log)}
          />
        )}

        {activeTab === "record" && (
          <RecordForm
            profiles={profiles}
            onAddLog={handleAddLog}
          />
        )}

        {activeTab === "walk" && (
          <JapanWalkGame
            logs={logs}
            profiles={profiles}
          />
        )}

        {activeTab === "chart" && (
          <DietChart
            logs={logs}
            profiles={profiles}
            onSelectLogToEdit={(log) => setEditingLog(log)}
          />
        )}

        {activeTab === "reactions" && (
          <ReactionCenter
            profiles={profiles}
            reactions={reactions}
            onSendReaction={handleSendReaction}
          />
        )}
      </main>

      {/* 記録のタップ編集モーダル */}
      {editingLog && (
        <EditLogModal
          log={editingLog}
          profiles={profiles}
          onSave={handleUpdateLog}
          onDelete={handleDeleteLog}
          onClose={() => setEditingLog(null)}
        />
      )}

      {/* 設定モーダル */}
      {showSettings && (
        <SettingsModal
          profiles={profiles}
          onUpdateProfiles={handleUpdateProfiles}
          onClose={() => setShowSettings(false)}
          syncStatus={dbSyncStatus}
          onManualSync={handleManualSync}
          textSize={textSize}
          onToggleTextSize={handleToggleTextSize}
        />
      )}
    </div>
  );
}
