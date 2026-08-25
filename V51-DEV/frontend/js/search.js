import { buscarProdutos } from './catalogo.js';

export function initSearch() {
  const input = document.getElementById('product-search');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const query = input.value.trim();
    results.replaceChildren();
    if (!query) return;

    const produtos = buscarProdutos(query).slice(0, 30);
    if (!produtos.length) {
      const empty = document.createElement('div');
      empty.textContent = 'Nenhum produto encontrado.';
      empty.style.cssText = 'padding:10px;color:#64748b;font-size:11px';
      results.appendChild(empty);
      return;
    }

    produtos.forEach(produto => {
      const item = document.createElement('button');
      item.type = 'button';
      item.style.cssText = 'width:100%;padding:10px;margin:0 0 6px;text-align:left;border:1px solid #e3e8ef;border-radius:10px;background:#fff;color:#172033;display:block;text-transform:none';
      item.innerHTML = `<strong>${escapeHtml(produto.nome || 'Produto')}</strong><small style="display:block;color:#64748b;margin-top:3px">SKU: ${escapeHtml(produto.sku || '—')} • GTIN: ${escapeHtml(produto.gtin || '—')}</small>`;
      results.appendChild(item);
    });
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}
