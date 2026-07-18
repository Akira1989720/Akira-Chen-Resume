// 安全地把 **粗體** 轉為 <strong>，其餘字元逸出，避免 CMS 內容注入 HTML
export function inline(str = '') {
  const esc = String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
