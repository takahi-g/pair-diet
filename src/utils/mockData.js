// デフォルトのスタンプ一覧
export const STAMPS = [
  { id: "praise", emoji: "💮", text: "大変よくできました！", color: "#f43f5e" },
  { id: "fight", emoji: "💪", text: "ナイスファイト！", color: "#6366f1" },
  { id: "great", emoji: "👏", text: "すごい！さすが！", color: "#eab308" },
  { id: "heart", emoji: "❤️", text: "いつもありがとう！", color: "#ec4899" },
  { id: "tired", emoji: "🍵", text: "今日もお疲れさま〜", color: "#10b981" },
  { id: "walk", emoji: "👟", text: "いっぱい歩いたね！", color: "#06b6d4" },
  { id: "eat", emoji: "🥗", text: "ヘルシーごはん最高！", color: "#84cc16" },
  { id: "fire", emoji: "🔥", text: "脂肪燃焼中！メラメラ", color: "#f97316" }
];

// 夫婦の初期プロファイル設定（パパ & ママ）
export const DEFAULT_PROFILES = {
  husband: {
    name: "パパ",
    avatar: "👨‍💻",
    targetWeight: 68.0,
    targetFat: 18.0,
    targetWaist: 82.0,
    hideRawNumbers: false
  },
  wife: {
    name: "ママ",
    avatar: "👩‍🎨",
    targetWeight: 50.0,
    targetFat: 22.0,
    targetWaist: 64.0,
    hideRawNumbers: false
  }
};

// 初期記録（デモデータを削除して空からスタート）
export const DEFAULT_LOGS = [];

// 初期リアクション履歴
export const DEFAULT_REACTIONS = [];
