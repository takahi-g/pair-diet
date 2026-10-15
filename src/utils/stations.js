// 日本一周ウォークのチェックポイント（東海道〜関西〜四国〜九州〜日本海〜東北〜北海道〜東京ゴール）
// 1歩あたり約 0.7m (0.0007km)
export const STATIONS = [
  { id: 1, name: "東京・日本橋", pref: "東京都", targetKm: 0, spot: "旅の出発点！夫婦ふたりの日本一周スタート！", icon: "🗼", reward: "旅立ちの草鞋" },
  { id: 2, name: "横浜・みなとみらい", pref: "神奈川県", targetKm: 30, spot: "赤レンガ倉庫と観覧車の夜景", icon: "🎡", reward: "横浜中華街肉まんバッジ" },
  { id: 3, name: "箱根温泉・芦ノ湖", pref: "神奈川県", targetKm: 95, spot: "天下の険！絶景富士山と温泉街", icon: "♨️", reward: "箱根寄木細工スタンプ" },
  { id: 4, name: "静岡・富士山五合目", pref: "静岡県", targetKm: 180, spot: "日本一の霊峰！雲海のパノラマビュー", icon: "🗻", reward: "富士山マスター称号" },
  { id: 5, name: "浜名湖", pref: "静岡県", targetKm: 270, spot: "名物うなぎと爽やかな湖畔ロード", icon: "🌊", reward: "うなぎパワーメダル" },
  { id: 6, name: "名古屋城・金の鯱", pref: "愛知県", targetKm: 360, spot: "尾張名古屋は城でもつ！", icon: "🏯", reward: "金のシャチホコバッジ" },
  { id: 7, name: "伊勢神宮", pref: "三重県", targetKm: 480, spot: "一生に一度はお伊勢参り。おかげ横丁でひと休み", icon: "⛩️", reward: "夫婦円満・開運お守り" },
  { id: 8, name: "京都・清水寺", pref: "京都府", targetKm: 610, spot: "清水の舞台から京都の街を一望！", icon: "⛩️", reward: "京八ッ橋スタンプ" },
  { id: 9, name: "大阪・道頓堀", pref: "大阪府", targetKm: 670, spot: "食い倒れの街！夫婦でグリコポーズ", icon: "🐙", reward: "たこ焼きマイスター" },
  { id: 10, name: "神戸・ハーバーランド", pref: "兵庫県", targetKm: 710, spot: "百万ドルの夜景と港町ポートタワー", icon: "⚓", reward: "神戸スイーツバッジ" },
  { id: 11, name: "淡路島・明石海峡大橋", pref: "兵庫県", targetKm: 760, spot: "世界屈指の吊り橋を渡って四国へ！", icon: "🌉", reward: "淡路島玉ねぎ勲章" },
  { id: 12, name: "道後温泉", pref: "愛媛県", targetKm: 970, spot: "日本最古の温泉で歩き疲れた体を癒やす", icon: "♨️", reward: "湯巡り名人バッジ" },
  { id: 13, name: "博多・中洲屋台街", pref: "福岡県", targetKm: 1250, spot: "豚骨ラーメンと賑やかな九州の夜", icon: "🍜", reward: "博多ラーメンどんぶり" },
  { id: 14, name: "熊本城・阿蘇山", pref: "熊本県", targetKm: 1370, spot: "雄大なカルデラと名城の威容", icon: "🌋", reward: "阿蘇の大自然トロフィー" },
  { id: 15, name: "出雲大社", pref: "島根県", targetKm: 1750, spot: "縁結びの神様！夫婦の絆がさらに深まる", icon: "🙏", reward: "縁結びの赤い糸" },
  { id: 16, name: "鳥取砂丘", pref: "鳥取県", targetKm: 1910, spot: "風紋が美しい日本海の大砂丘", icon: "🐪", reward: "砂丘のラクダバッジ" },
  { id: 17, name: "金沢・兼六園", pref: "石川県", targetKm: 2210, spot: "加賀百万石の風雅な名園", icon: "🌸", reward: "金箔ソフトスタンプ" },
  { id: 18, name: "富山湾・立山連峰", pref: "富山県", targetKm: 2280, spot: "海越しに望む3000m級の北アルプス", icon: "🏔️", reward: "白えびキングバッジ" },
  { id: 19, name: "新潟・魚沼の棚田", pref: "新潟県", targetKm: 2530, spot: "黄金色に輝く日本一の米どころ", icon: "🌾", reward: "コシヒカリ一合枡" },
  { id: 20, name: "仙台・青葉城址", pref: "宮城県", targetKm: 2840, spot: "伊達政宗公が見守る杜の都", icon: "🌙", reward: "ずんだ餅スタンプ" },
  { id: 21, name: "青森・ねぶたの里", pref: "青森県", targetKm: 3200, spot: "ラッセラー！迫力満点の夏の火祭り", icon: "🏮", reward: "金魚ねぶたバッジ" },
  { id: 22, name: "函館・五稜郭", pref: "北海道", targetKm: 3350, spot: "青函トンネルを抜け北の大地へ！星型の城郭", icon: "⭐", reward: "函館夜景ダイヤモンド" },
  { id: 23, name: "札幌・大通公園", pref: "北海道", targetKm: 3600, spot: "テレビ塔とライラック、涼やかな北の都", icon: "🌽", reward: "時計台の鐘バッジ" },
  { id: 24, name: "日本一周達成！東京・日本橋", pref: "ゴール", targetKm: 4200, spot: "夫婦で歩ききった約4,200km！おめでとう！！🎉", icon: "🏆", reward: "日本一周制覇・夫婦の絆金メダル" }
];

export const TOTAL_KM = 4200;
export const KM_PER_STEP = 0.0007; // 1歩あたり約70cm = 0.0007km
