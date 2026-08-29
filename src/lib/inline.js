// 安全地把 **粗體** 轉為 <strong>，其餘字元逸出，避免 CMS 內容注入 HTML
export function inline(str = '') {
  const esc = String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// 顯示型標題的「作者指定斷行」。
//
// 問題：中文大標常需要精準控制在哪裡換行，但若用空白鍵排版，
// 空白只是普通字元——桌機剛好斷在對的地方，換到手機寬度就變成
// 句子中間的空洞，且斷行位置完全失控。
//
// 解法：把作者的斷行意圖轉成真正的行，交給 CSS 以 block 呈現。
// 相容三種輸入寫法（可混用）：
//   1. 直接換行（建議，CMS 欄位需為 text widget）
//   2. 全形空白 U+3000（舊內容沿用，不必重打）
//   3. 連續兩個以上的半形空白
// 回傳已逸出並處理過 **粗體** 的字串陣列，每個元素為一行。
export function displayLines(str = '') {
  return String(str)
    .replace(/\r\n?/g, '\n')
    .split(/\n+|\u3000+|[ \t]{2,}/)
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) => inline(line));
}

// 直接產出可餵給 set:html 的字串，省去每個呼叫點重複 map/join
export function displayHtml(str = '') {
  return displayLines(str)
    .map((line) => `<span class="hl">${line}</span>`)
    .join('');
}
//  支援 watch?v=、youtu.be/、/embed/、/shorts/，以及直接填 11 碼 ID
export function youtubeId(url = '') {
  const s = String(url).trim();
  if (!s) return '';
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : '';
}
//  - 空行（一個以上）= 分段，各自包成 <p>
//  - 段落內單一換行 = <br>
//  - 一併支援 **粗體**（沿用 inline 的逸出邏輯，安全）
export function richText(str = '') {
  return String(str)
    .replace(/\r\n?/g, '\n')            // 正規化換行
    .trim()
    .split(/\n{2,}/)                    // 空行分段
    .filter((block) => block.trim() !== '')
    .map((block) => '<p>' + inline(block).replace(/\n/g, '<br>') + '</p>')
    .join('');
}
