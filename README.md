# 陳家輝 個人網站（Astro + Decap CMS）

議題溝通與專案執行 ／ Project Planner — Content, Engagement & Training
可視覺化後台編輯（文字＋圖片），部署於 Netlify。

---

## 內容來源
所有文案以《陳家輝個人網站文案 v2.1 鎖定版》為唯一有效來源，存放於 `src/data/*.json`。
請勿放回已刪除／未確認內容（電話、地址、裝備類型、未驗證數字、統籌字樣等）。

## 檔案結構
```
.
├─ src/
│  ├─ data/            ← 所有可編輯內容（後台實際改的就是這些）
│  │  ├─ site.json         首頁/關於/頁尾/SEO
│  │  ├─ capabilities.json 核心能力
│  │  ├─ projects.json     精選專案（3）
│  │  ├─ more.json         更多經歷（4）
│  │  ├─ experience.json   工作經歷
│  │  ├─ skills.json       技能與工具
│  │  ├─ education.json    教育與培訓
│  │  └─ contact.json      聯絡
│  ├─ layouts/Base.astro   <head>、SEO/OG、favicon、載入 CSS/JS
│  ├─ pages/index.astro    單頁組裝
│  ├─ lib/inline.js        **粗體** → <strong> 轉換
│  └─ styles-global.css    全站樣式
├─ public/
│  ├─ admin/               ← Decap CMS 後台
│  │  ├─ index.html
│  │  └─ config.yml
│  ├─ assets/images/       圖片（後台上傳也存這）
│  ├─ assets/resume/       履歷 PDF 放這
│  ├─ favicon.svg
│  ├─ main.js              導覽/scrollspy/展開/淡入
│  └─ _redirects
├─ astro.config.mjs
├─ netlify.toml
└─ package.json
```

## 文字裡的粗體
內容欄位中用 `**文字**` 標記的會顯示為粗體（給人資快速掃描的重點）。
後台編輯時保留或自行增減 `**...**` 即可，不需要碰程式碼。

---

## 本機預覽（選用）
需 Node 18+：
```
npm install
npm run dev      # http://localhost:4321 即時預覽
npm run build    # 產出 dist/（Netlify 會自動做這步）
```

---

## 部署到 Netlify（含後台登入）—— 逐步

### 步驟 1：把專案放上 GitHub
1. 在 GitHub 建一個新的 repo（可設 Private）。
2. 把本資料夾所有檔案（不含 node_modules、dist）push 上去，分支名 `main`。

### 步驟 2：在 Netlify 建立站台
1. 到 app.netlify.com → Add new site → Import an existing project → 連 GitHub → 選這個 repo。
2. 建置設定會自動讀 `netlify.toml`：Build command `npm run build`、Publish directory `dist`。直接 Deploy。
3. 完成後得到一個 `xxxx.netlify.app` 網址。

### 步驟 3：開啟後台登入（Netlify Identity + Git Gateway）
後台 `/admin` 要能登入並寫回內容，需啟用兩個開關：
1. Netlify 站台 → **Integrations／Identity** →「Enable Identity」。
   （新版介面可能在 Site configuration → Identity；若找不到，搜尋 "Identity"。）
2. Identity → Registration 建議設為 **Invite only**（只有你能登入）。
3. Identity → Services → **Enable Git Gateway**。
4. Identity → Emails 可自訂邀請信（選用）。

### 步驟 4：邀請自己成為後台使用者
1. Identity 頁 → **Invite users** → 填你的 Email → 送出。
2. 收信 → 點連結 → 設定密碼。

### 步驟 5：進後台
1. 打開 `https://你的網址/admin/`
2. 用剛才的 Email／密碼登入。
3. 左側可看到「網站內容」各區塊，改文字、上傳圖片、儲存 → 會自動 commit 回 GitHub → Netlify 自動重新部署（約 1–2 分鐘後生效）。

### 步驟 6：綁定自訂網域後
把以下兩處的 `YOUR-DOMAIN` 換成正式網域：
- `astro.config.mjs` 的 `site`
（canonical 與 og:url、og:image 會依此自動生成。）

---

## 部署前待補
- [ ] 履歷 PDF：後台「聯絡 → 履歷」上傳，或放 `public/assets/resume/resume.pdf` 後在 contact.json 填路徑；下載鈕會自動出現。
- [ ] 專案圖 ×2（training、mazu）：後台「精選專案」對應項目上傳原創照，佔位會自動消失。
- [ ] 綁網域後替換 `astro.config.mjs` 的 `YOUR-DOMAIN`。

## 已知限制
- 後台文字修改後需等 Netlify 重新建置（約 1–2 分鐘）才會反映在正式站，非即時。
- 目前為中文單一語系；未來雙語需另開語系結構（可再議）。
