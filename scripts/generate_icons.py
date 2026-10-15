import math
from PIL import Image, ImageDraw, ImageFont

# 512x512のキャンバスを作成
size = 512
img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# 1. 背景グラデーション（ダークサイバーネイビー: #0f172a -> #1e1b4b -> #090d16）
for y in range(size):
    ratio = y / size
    r = int(15 * (1 - ratio) + 9 * ratio)
    g = int(23 * (1 - ratio) + 13 * ratio)
    b = int(42 * (1 - ratio) + 22 * ratio)
    if ratio > 0.3 and ratio < 0.8:
        # 中間に紫がかったトーン
        mid_r = (ratio - 0.3) / 0.5
        r = int(r + 15 * math.sin(mid_r * math.pi))
        b = int(b + 35 * math.sin(mid_r * math.pi))
    draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

# 2. 体重計の本体プレート（角丸四角形）
scale_box = [64, 64, 448, 448]
draw.rounded_rectangle(scale_box, radius=56, fill=(30, 41, 59, 255), outline=(255, 255, 255, 60), width=4)

# 体重計インナーリング
draw.rounded_rectangle([80, 80, 432, 432], radius=44, outline=(255, 255, 255, 20), width=2)

# 3. 上部デジタルLEDディスプレイ
draw.rounded_rectangle([170, 96, 342, 160], radius=18, fill=(9, 13, 22, 255), outline=(56, 189, 248, 140), width=3)

# ディスプレイ内テキスト（PAiR）
try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 36)
except:
    font = ImageFont.load_default()
draw.text((256, 126), "PAiR", fill=(56, 189, 248, 255), font=font, anchor="mm")

# 4. 中央のペアハート（パパ水色 & ママピンク）
# パパ左ハート (#38bdf8) & ママ右ハート (#f472b6)
cx, cy = 256, 286

# ハート形状のポリゴンポイントを計算
def heart_points(side="both", scale=12.0):
    pts = []
    # t: 0 -> 2pi
    steps = 120
    for i in range(steps):
        t = i * 2 * math.pi / steps
        # 伝統的なハート方程式
        x = 16 * (math.sin(t) ** 3)
        y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
        
        px = cx + x * scale
        py = cy + y * scale + 15
        
        if side == "left" and px <= cx + 1:
            pts.append((px, py))
        elif side == "right" and px >= cx - 1:
            pts.append((px, py))
        elif side == "both":
            pts.append((px, py))
    return pts

# 左半分：パパ（水色）
left_pts = [(cx, cy - 80)] + [p for p in heart_points("left", 7.8)] + [(cx, cy + 125)]
draw.polygon(left_pts, fill=(56, 189, 248, 245))

# 右半分：ママ（ピンク）
right_pts = [(cx, cy - 80)] + [p for p in heart_points("right", 7.8)] + [(cx, cy + 125)]
draw.polygon(right_pts, fill=(244, 114, 182, 245))

# 境界のハイライト線
draw.line([(cx, cy - 75), (cx, cy + 120)], fill=(255, 255, 255, 120), width=2)

# 5. ペアの足あと（パパ水色側＆ママピンク側）
# パパの足あと（白抜きの軽快なステップ）
draw.ellipse([cx - 75, cy + 20, cx - 45, cy + 65], fill=(255, 255, 255, 220)) # かかと
draw.ellipse([cx - 80, cy - 2, cx - 70, cy + 10], fill=(255, 255, 255, 220))  # 指
draw.ellipse([cx - 68, cy - 8, cx - 58, cy + 4], fill=(255, 255, 255, 220))
draw.ellipse([cx - 56, cy - 7, cx - 46, cy + 5], fill=(255, 255, 255, 220))
draw.ellipse([cx - 44, cy - 2, cx - 34, cy + 10], fill=(255, 255, 255, 220))

# ママの足あと（白抜きの軽快なステップ）
draw.ellipse([cx + 45, cy + 20, cx + 75, cy + 65], fill=(255, 255, 255, 220)) # かかと
draw.ellipse([cx + 34, cy - 2, cx + 44, cy + 10], fill=(255, 255, 255, 220))
draw.ellipse([cx + 46, cy - 7, cx + 56, cy + 5], fill=(255, 255, 255, 220))
draw.ellipse([cx + 58, cy - 8, cx + 68, cy + 4], fill=(255, 255, 255, 220))
draw.ellipse([cx + 70, cy - 2, cx + 80, cy + 10], fill=(255, 255, 255, 220))

# 6. 中央の星（シェイプアップ成功）
star_cx, star_cy = cx, cy - 85
star_pts = []
for i in range(10):
    r = 22 if i % 2 == 0 else 9
    ang = i * math.pi / 5 - math.pi / 2
    star_pts.append((star_cx + r * math.cos(ang), star_cy + r * math.sin(ang)))
draw.polygon(star_pts, fill=(250, 204, 21, 255))

# 7. 画像をPNG保存（各サイズ）
# apple-touch-icon用 (180x180, 192x192, 512x512)
img_rgb = img.convert("RGB") # iOSのapple-touch-iconは背景透過よりRGB黒/濃紺地が最も確実に描画される
img_rgb.save("public/apple-touch-icon.png", "PNG")
img_rgb.save("public/icon-512.png", "PNG")
img_rgb.resize((192, 192), Image.LANCZOS).save("public/icon-192.png", "PNG")
img_rgb.resize((180, 180), Image.LANCZOS).save("public/apple-touch-icon-180x180.png", "PNG")
img_rgb.resize((32, 32), Image.LANCZOS).save("public/favicon-32x32.png", "PNG")

print("PNG icons generated successfully!")
