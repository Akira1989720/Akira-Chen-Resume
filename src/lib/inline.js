// 安全地把 **粗體** 轉為 <strong>，其餘字元逸出，避免 CMS 內容注入 HTML
export function inline(str = '') {
  const esc = String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// 從各種 YouTube 網址取出影片 ID
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
