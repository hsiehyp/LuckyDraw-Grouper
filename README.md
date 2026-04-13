<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🎲 LuckyDraw & Grouper

**抽籤與分組工具** — 支援 CSV 匯入、動畫抽獎、自動分組

[![Deploy](https://github.com/user/LuckyDraw-Grouper/actions/workflows/deploy.yml/badge.svg)](https://github.com/user/LuckyDraw-Grouper/actions/workflows/deploy.yml)

</div>

---

## ✨ 功能特色

- 🎯 **獎品抽籤** — 支援多獎項設定，附帶 Confetti 動畫效果
- 👥 **自動分組** — 從 CSV 或文字匯入名單，一鍵隨機分組
- 📊 **CSV 匯入** — 使用 PapaParse 解析 CSV 檔案
- 🎨 **精美 UI** — 基於 shadcn/ui + TailwindCSS v4 + Motion 動畫

## 🛠️ 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | React 19 + TypeScript |
| 建構工具 | Vite 6 |
| 樣式 | TailwindCSS v4 + shadcn/ui |
| 動畫 | Motion (Framer Motion) + Canvas Confetti |
| 圖示 | Lucide React |
| 通知 | Sonner |
| CSV 解析 | PapaParse |

## 🚀 快速開始

### 前置需求

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### 安裝與啟動

```bash
# 1. Clone 專案
git clone https://github.com/your-username/LuckyDraw-Grouper.git
cd LuckyDraw-Grouper

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
```

開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000)

### 可用指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器 (port 3000) |
| `npm run build` | TypeScript 型別檢查 + 打包 production |
| `npm run preview` | 預覽 production build |
| `npm run lint` | TypeScript 型別檢查 |
| `npm run clean` | 清除 `dist/` 目錄 |

## 📁 專案結構

```
LuckyDraw-Grouper/
├── .github/workflows/    # GitHub Actions 部署設定
│   └── deploy.yml
├── components/ui/        # shadcn/ui 元件
├── lib/
│   └── utils.ts          # 工具函式 (cn)
├── src/
│   ├── components/       # 業務元件
│   │   ├── DataSource.tsx    # 資料來源 (CSV/文字輸入)
│   │   ├── LuckyDraw.tsx     # 抽籤功能
│   │   └── Grouper.tsx       # 分組功能
│   ├── App.tsx           # 主要應用元件
│   ├── main.tsx          # React 進入點
│   ├── index.css         # 全域樣式 (TailwindCSS)
│   └── types.ts          # TypeScript 型別定義
├── index.html            # HTML 模板
├── vite.config.ts        # Vite 設定
├── tsconfig.json         # TypeScript 設定
├── components.json       # shadcn/ui 設定
└── package.json          # 專案依賴與指令
```

## 🚢 部署

### GitHub Pages（自動部署）

本專案已設定 GitHub Actions，推送到 `main` 分支即自動部署。

#### 設定步驟

1. 前往 GitHub Repo → **Settings** → **Pages**
2. **Source** 選擇 **GitHub Actions**
3. 推送到 `main` 分支即會自動觸發部署

部署完成後，網站會在 `https://<your-username>.github.io/LuckyDraw-Grouper/` 上線。

> [!IMPORTANT]
> 若你的 repo 名稱不是 `LuckyDraw-Grouper`，需修改 `vite.config.ts` 中的 `base` 為 `'./'` 或 `'/<repo-name>/'`。

### 手動部署

```bash
npm run build
# dist/ 資料夾即為靜態網站，可部署到任何靜態主機
```
 
## 📜 License

Apache-2.0

## 🙏 致謝

- [shadcn/ui](https://ui.shadcn.com/) — UI 元件庫
- [Vite](https://vitejs.dev/) — 次世代建構工具
- [TailwindCSS](https://tailwindcss.com/) — Utility-first CSS 框架
