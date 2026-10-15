import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 日本時間の現在日時フォーマット (YYYY.MM.DD HH:mm)
const getJstVersion = () => {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(jst.getUTCDate()).padStart(2, '0');
  const hh = String(jst.getUTCHours()).padStart(2, '0');
  const mm = String(jst.getUTCMinutes()).padStart(2, '0');
  return `${y}.${m}.${d} ${hh}:${mm}`;
};

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(getJstVersion())
  },
  build: {
    outDir: 'docs'
  },
  server: {
    port: 5174,
    host: true
  }
})
