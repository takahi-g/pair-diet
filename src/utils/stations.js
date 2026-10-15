// 日本一周ウォークのチェックポイント
// 出発地点: 福岡県筑紫野市・JR二日市駅！
// 九州〜本州〜四国〜日本海〜東北〜北海道〜九州・二日市駅ゴール！
// 1歩あたり約 0.7m (0.0007km)
export const DEPARTURE_DATE = "2026年10月16日（金）"; // 明日出発！
export const START_STATION_NAME = "福岡・JR二日市駅（筑紫野市）";

export const STATIONS = [
  { id: 1, name: "JR二日市駅（筑紫野市）", pref: "福岡県", targetKm: 0, spot: "夫婦ふたりの日本一周スタート地点！武蔵寺・二日市温泉の街", icon: "🚉", reward: "二日市温泉手ぬぐい" },
  { id: 2, name: "太宰府天満宮", pref: "福岡県", targetKm: 5, spot: "学問・至誠の神様！名物梅ヶ枝餅でエネルギーチャージ", icon: "⛩️", reward: "梅ヶ枝餅バッジ" },
  { id: 3, name: "博多・中洲屋台街", pref: "福岡県", targetKm: 25, spot: "豚骨ラーメンと活気ある那珂川の夜景", icon: "🍜", reward: "博多ラーメンどんぶり" },
  { id: 4, name: "門司港レトロ・関門海峡", pref: "福岡県/山口県", targetKm: 95, spot: "関門人道トンネルを歩いて本州へ上陸！", icon: "🚢", reward: "関門海峡突破メダル" },
  { id: 5, name: "秋吉台・秋芳洞", pref: "山口県", targetKm: 180, spot: "日本最大級のカルスト台地と大鍾乳洞", icon: "🏞️", reward: "カルスト台地スタンプ" },
  { id: 6, name: "広島・宮島（厳島神社）", pref: "広島県", targetKm: 310, spot: "海に浮かぶ大鳥居ともみじ饅頭", icon: "⛩️", reward: "宮島しゃもじストラップ" },
  { id: 7, name: "道後温泉", pref: "愛媛県", targetKm: 460, spot: "しまなみ海道を渡り四国へ！日本最古の名湯", icon: "♨️", reward: "湯巡り名人バッジ" },
  { id: 8, name: "讃岐うどん・金刀比羅宮", pref: "香川県", targetKm: 600, spot: "本場の讃岐うどん！こんぴらさんの長い石段を踏破", icon: "🍲", reward: "さぬきうどん箸" },
  { id: 9, name: "淡路島・明石海峡大橋", pref: "兵庫県", targetKm: 720, spot: "大鳴門橋と明石海峡大橋を渡り関西へ！", icon: "🌉", reward: "淡路島玉ねぎ勲章" },
  { id: 10, name: "大阪・道頓堀", pref: "大阪府", targetKm: 810, spot: "食い倒れの街！夫婦でグリコポーズ", icon: "🐙", reward: "たこ焼きマイスター" },
  { id: 11, name: "京都・清水寺", pref: "京都府", targetKm: 870, spot: "清水の舞台から京都の街を一望！", icon: "🏯", reward: "京八ッ橋スタンプ" },
  { id: 12, name: "伊勢神宮", pref: "三重県", targetKm: 1000, spot: "夫婦円満・開運祈願のお伊勢参り！おかげ横丁でひと休み", icon: "⛩️", reward: "夫婦円満・開運お守り" },
  { id: 13, name: "名古屋城・金の鯱", pref: "愛知県", targetKm: 1130, spot: "尾張名古屋は城でもつ！", icon: "🏯", reward: "金のシャチホコバッジ" },
  { id: 14, name: "静岡・富士山五合目", pref: "静岡県", targetKm: 1350, spot: "日本一の霊峰！雲海のパノラマビュー", icon: "🗻", reward: "富士山マスター称号" },
  { id: 15, name: "東京・日本橋", pref: "東京都", targetKm: 1500, spot: "日本の道路の起点！銀座やスカイツリーの街", icon: "🗼", reward: "江戸前寿司バッジ" },
  { id: 16, name: "日光東照宮", pref: "栃木県", targetKm: 1650, spot: "見ざる・言わざる・聞かざる！豪華絢爛な陽明門", icon: "🙈", reward: "三猿スタンプ" },
  { id: 17, name: "仙台・青葉城址", pref: "宮城県", targetKm: 1950, spot: "伊達政宗公が見守る杜の都", icon: "🌙", reward: "ずんだ餅スタンプ" },
  { id: 18, name: "青森・ねぶたの里", pref: "青森県", targetKm: 2300, spot: "ラッセラー！迫力満点の夏の火祭り", icon: "🏮", reward: "金魚ねぶたバッジ" },
  { id: 19, name: "函館・五稜郭", pref: "北海道", targetKm: 2450, spot: "青函トンネルを抜け北の大地へ！星型の城郭", icon: "⭐", reward: "函館夜景ダイヤモンド" },
  { id: 20, name: "札幌・大通公園", pref: "北海道", targetKm: 2700, spot: "テレビ塔と涼やかな北の都！", icon: "🌽", reward: "時計台の鐘バッジ" },
  { id: 21, name: "金沢・兼六園", pref: "石川県", targetKm: 3400, spot: "日本海側を南下！加賀百万石の風雅な名園", icon: "🌸", reward: "金箔ソフトスタンプ" },
  { id: 22, name: "出雲大社", pref: "島根県", targetKm: 3850, spot: "縁結びの神様！夫婦の絆がさらに深まる", icon: "🙏", reward: "縁結びの赤い糸" },
  { id: 23, name: "別府温泉・地獄めぐり", pref: "大分県", targetKm: 4100, spot: "九州へ帰還！もくもく湯けむりと海地獄", icon: "♨️", reward: "温泉名人メダル" },
  { id: 24, name: "日本一周ゴール！JR二日市駅", pref: "福岡県筑紫野市", targetKm: 4200, spot: "おかえりなさい！夫婦で歩ききった約4,200km！大感動のゴール！！🎉", icon: "🏆", reward: "筑紫野凱旋・夫婦の絆金メダル" }
];

export const TOTAL_KM = 4200;
export const KM_PER_STEP = 0.0007; // 1歩あたり約70cm = 0.0007km
