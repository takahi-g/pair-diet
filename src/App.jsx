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

  // デフォルト操作ユーザー（"wife" = ママ または "husband" = パパ）
  const [defaultUser, setDefaultUser] = useState(() => {
    return localStorage.getItem("pair_diet_default_user") || "wife";
  });

  const handleUpdateDefaultUser = (userKey) => {
    setDefaultUser(userKey);
    localStorage.setItem("pair_diet_default_user", userKey);
  };

  // 1. プロファイル (デフォルトおよびクラウド取得時も確実にパパ & ママに変換)
  const sanitizeProfiles = (rawProfiles) => {
    if (!rawProfiles) return DEFAULT_PROFILES;
    const p = { ...rawProfiles };
    if (!p.husband || p.husband.name === "旦那さん" || !p.husband.name) {
      p.husband = { ...(p.husband || DEFAULT_PROFILES.husband), name: "パパ" };
    }
    if (!p.wife || p.wife.name === "奥さん" || !p.wife.name) {
      p.wife = { ...(p.wife || DEFAULT_PROFILES.wife), name: "ママ" };
    }
    return p;
  };

  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem("pair_diet_profiles");
      return saved ? sanitizeProfiles(JSON.parse(saved)) : DEFAULT_PROFILES;
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
          const cleanProfiles = sanitizeProfiles(cloudData.profiles);
          setProfiles(cleanProfiles);
          if (cloudData.logs && Array.isArray(cloudData.logs)) setLogs(cloudData.logs);
          if (cloudData.reactions && Array.isArray(cloudData.reactions)) setReactions(cloudData.reactions);
          
          // クラウド上が古い名前（旦那さん/奥さん）だった場合、即座にパパ/ママで上書き保存
          if (cloudData.profiles?.husband?.name === "旦那さん" || cloudData.profiles?.wife?.name === "奥さん") {
            await saveDietDataToGitHub({
              profiles: cleanProfiles,
              logs: cloudData.logs || logs,
              reactions: cloudData.reactions || reactions,
              updatedAt: new Date().toISOString()
            });
          }
          setDbSyncStatus("success");
        } else {
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

  // トースト通知メッセージ管理
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  // 既存記録の更新（タップ編集）
  const handleUpdateLog = (updatedLog) => {
    const updatedLogs = logs.map(l => l.id === updatedLog.id ? updatedLog : l);
    setLogs(updatedLogs);
    syncToCloud(profiles, updatedLogs, reactions);
    showToast("変更を保存しました");
  };

  // 記録の削除
  const handleDeleteLog = (logId) => {
    const updatedLogs = logs.filter(l => l.id !== logId);
    setLogs(updatedLogs);
    syncToCloud(profiles, updatedLogs, reactions);
    showToast("記録を削除しました");
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
    showToast("変更を保存しました");
  };

  // 手動再同期・更新ステート
  const [isUpdating, setIsUpdating] = useState(false);

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
        if (cloudData.profiles) setProfiles(sanitizeProfiles(cloudData.profiles));
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
        showToast("最新データに更新しました！");
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
        <div className="header-top-bar">
          {/* 左側：バージョン番号 */}
          <span className="version-pill">
            v{typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "2026.10.15 15:25"}
          </span>

          {/* 右側：文字特大、更新、設定の3つのボタンをすっきり整列 */}
          <div className="header-action-group">
            <button
              onClick={handleToggleTextSize}
              className="header-btn"
              title="文字サイズ切り替え"
              style={{
                background: textSize === "large" ? "var(--gradient-primary)" : "rgba(255, 255, 255, 0.08)",
                color: "#fff"
              }}
            >
              <span>{textSize === "large" ? "🔍 文字特大" : "文字標準"}</span>
            </button>

            <button
              onClick={handleManualSync}
              disabled={isUpdating}
              className="header-btn header-btn-refresh"
              title="タップして最新データに更新"
            >
              <RefreshCw size={14} className={isUpdating ? "animate-spin" : ""} />
              <span>{isUpdating ? "更新中..." : "更新"}</span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="header-btn header-btn-icon"
              title="設定"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* トースト通知 */}
        {toastMessage && (
          <div className="update-toast animate-pop">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
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
            primaryUser={defaultUser}
            onSelectLogToEdit={(log) => setEditingLog(log)}
          />
        )}

        {activeTab === "record" && (
          <RecordForm
            profiles={profiles}
            logs={logs}
            defaultUser={defaultUser}
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
          defaultUser={defaultUser}
          onUpdateDefaultUser={handleUpdateDefaultUser}
        />
      )}
    </div>
  );
}
