export function initSearch() {
  const input = document.getElementById('product-search');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const query = input.value.trim();
    results.replaceChildren();
    if (!query) return;
    const item = document.createElement('div');
    item.textContent = `Pesquisa V51 preparada para: ${query}`;
    item.style.cssText = 'padding:10px;border:1px solid #e3e8ef;border-radius:10px;font-size:11px;color:#64748b';
    results.appendChild(item);
  });
}
