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

// サンプルの直近記録
export const DEFAULT_LOGS = [
  {
    id: "log-1",
    date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
    user: "husband",
    weight: 73.2,
    bodyFat: 21.5,
    waist: 86.0,
    steps: 8200,
    memo: "夜ウォーキング30分"
  },
  {
    id: "log-2",
    date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
    user: "wife",
    weight: 53.4,
    bodyFat: 24.2,
    waist: 67.5,
    steps: 6400,
    memo: "買い物でたくさん歩いた"
  },
  {
    id: "log-3",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    user: "husband",
    weight: 72.8,
    bodyFat: 21.2,
    waist: 85.5,
    steps: 9500,
    memo: "エレベーター使わず階段！"
  },
  {
    id: "log-4",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    user: "wife",
    weight: 53.0,
    bodyFat: 23.9,
    waist: 67.0,
    steps: 7100,
    memo: "ヘルシーサラダ作ったよ"
  },
  {
    id: "log-5",
    date: new Date().toISOString().split("T")[0],
    user: "husband",
    weight: 72.5,
    bodyFat: 20.9,
    waist: 85.0,
    steps: 6300,
    memo: "朝からいい調子！"
  },
  {
    id: "log-6",
    date: new Date().toISOString().split("T")[0],
    user: "wife",
    weight: 52.8,
    bodyFat: 23.7,
    waist: 66.8,
    steps: 5800,
    memo: "水分たくさん摂る"
  }
];

// 初期リアクション履歴
export const DEFAULT_REACTIONS = [
  {
    id: "react-1",
    from: "wife",
    to: "husband",
    stampId: "praise",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    message: "階段使ったのえらい！👏"
  },
  {
    id: "react-2",
    from: "husband",
    to: "wife",
    stampId: "heart",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    message: "サラダ美味しかった！ありがとう❤️"
  }
];
