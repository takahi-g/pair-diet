import React, { useRef, useEffect } from "react";

export default function WheelPicker({
  value,
  onChange,
  min = 30,
  max = 120,
  step = 0.1,
  unit = "kg",
  label = "体重",
  color = "#38bdf8"
}) {
  const scrollRef = useRef(null);
  const isInternalScroll = useRef(false);

  // 選択肢の配列を生成（小数点1桁の浮動小数点数誤差対策で四捨五入）
  const precision = step.toString().includes(".") ? step.toString().split(".")[1].length : 0;
  const items = [];
  for (let v = min; v <= max + 0.0001; v += step) {
    items.push(parseFloat(v.toFixed(precision)));
  }

  const itemHeight = 44; // 1行あたりの高さ (px)

  // value が外部から変わった時にスクロール位置を同期
  useEffect(() => {
    if (!scrollRef.current) return;
    const numericVal = parseFloat(value);
    if (isNaN(numericVal)) return;

    const closestIndex = items.findIndex(
      item => Math.abs(item - numericVal) < step / 2
    );

    if (closestIndex !== -1) {
      const targetTop = closestIndex * itemHeight;
      if (Math.abs(scrollRef.current.scrollTop - targetTop) > 2) {
        isInternalScroll.current = true;
        scrollRef.current.scrollTop = targetTop;
        setTimeout(() => {
          isInternalScroll.current = false;
        }, 150);
      }
    }
  }, [value, min, max, step]);

  // スクロール停止時に最も近い値を選択
  const handleScroll = (e) => {
    if (isInternalScroll.current) return;
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (index >= 0 && index < items.length) {
      const selectedVal = items[index];
      if (parseFloat(value) !== selectedVal) {
        onChange(selectedVal.toFixed(precision));
      }
    }
  };

  // ±クイック増減ボタン
  const adjustValue = (delta) => {
    const current = parseFloat(value) || items[Math.floor(items.length / 2)];
    const next = Math.min(max, Math.max(min, parseFloat((current + delta).toFixed(precision))));
    onChange(next.toFixed(precision));
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const selectedNumeric = parseFloat(value);

  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.9)",
      border: `1.5px solid rgba(255, 255, 255, 0.12)`,
      borderRadius: "var(--radius-md)",
      padding: "0.5rem 0.25rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: 0,
      width: "100%",
      position: "relative",
      boxSizing: "border-box"
    }}>
      {/* ラベル */}
      <div style={{
        fontSize: "0.82rem",
        fontWeight: 800,
        color: "var(--text-secondary)",
        marginBottom: "0.3rem",
        whiteSpace: "nowrap",
        textAlign: "center"
      }}>
        {label} ({unit})
      </div>

      {/* ＋ボタン（上にスクロール・増やす） */}
      <button
        type="button"
        onClick={() => adjustValue(step)}
        style={{
          width: "100%",
          maxWidth: "70px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "var(--radius-sm)",
          color: "#fff",
          fontSize: "1.1rem",
          fontWeight: 900,
          padding: "0.15rem 0",
          cursor: "pointer",
          marginBottom: "0.2rem"
        }}
      >
        ▲
      </button>

      {/* ドラムロール / ホイールピッカー本体 */}
      <div style={{
        position: "relative",
        height: `${itemHeight * 3}px`,
        width: "100%",
        overflow: "hidden"
      }}>
        {/* 中央の選択枠ハイライト */}
        <div style={{
          position: "absolute",
          top: `${itemHeight}px`,
          left: "2px",
          right: "2px",
          height: `${itemHeight}px`,
          background: "rgba(255, 255, 255, 0.08)",
          borderTop: `2px solid ${color}`,
          borderBottom: `2px solid ${color}`,
          borderRadius: "6px",
          pointerEvents: "none",
          zIndex: 1
        }} />

        {/* スクロール可能領域 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            height: "100%",
            overflowY: "auto",
            scrollSnapType: "y mandatory",
            WebkitOverflowScrolling: "touch",
            paddingTop: `${itemHeight}px`,
            paddingBottom: `${itemHeight}px`,
            boxSizing: "border-box",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
          className="wheel-scroll-container"
        >
          {items.map((itemVal, idx) => {
            const isCurrent = Math.abs(itemVal - selectedNumeric) < step / 2;
            return (
              <div
                key={idx}
                onClick={() => onChange(itemVal.toFixed(precision))}
                style={{
                  height: `${itemHeight}px`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scrollSnapAlign: "center",
                  cursor: "pointer",
                  fontSize: isCurrent ? "1.28rem" : "0.95rem",
                  fontWeight: isCurrent ? 900 : 600,
                  color: isCurrent ? "#fff" : "rgba(255, 255, 255, 0.35)",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap"
                }}
              >
                {itemVal.toFixed(precision)}
              </div>
            );
          })}
        </div>
      </div>

      {/* −ボタン（下にスクロール・減らす） */}
      <button
        type="button"
        onClick={() => adjustValue(-step)}
        style={{
          width: "100%",
          maxWidth: "70px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "var(--radius-sm)",
          color: "#fff",
          fontSize: "1.1rem",
          fontWeight: 900,
          padding: "0.15rem 0",
          cursor: "pointer",
          marginTop: "0.2rem"
        }}
      >
        ▼
      </button>

      {/* 現在値のダイレクト入力・微調整欄 */}
      <div style={{ marginTop: "0.4rem", width: "100%", maxWidth: "80px" }}>
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="数値"
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 800,
            textAlign: "center",
            padding: "0.25rem"
          }}
        />
      </div>
    </div>
  );
}
