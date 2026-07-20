// 安全地把 **粗體** 轉為 <strong>，其餘字元逸出，避免 CMS 內容注入 HTML
export function inline(str = '') {
  const esc = String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// 把 CMS 多行文字轉為段落 HTML：
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
