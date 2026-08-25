const STORAGE_KEY = 'v51_catalogo_local';

function normalizarCabecalho(valor) {
  return String(valor ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function encontrarLinhaCabecalho(rows) {
  const aliases = new Set(['gtin','ean','codigo','codigoproduto','sku','produto','nomeproduto','descricaoproduto','descricao','nome']);
  for (let i = 0; i < Math.min(rows.length, 15); i++) {
    const keys = Object.keys(rows[i] || {}).map(normalizarCabecalho);
    if (keys.some(k => aliases.has(k))) return i;
  }
  return 0;
}

function valor(row, nomes) {
  const entries = Object.entries(row || {});
  for (const nome of nomes) {
    const alvo = normalizarCabecalho(nome);
    const hit = entries.find(([key]) => normalizarCabecalho(key) === alvo);
    if (hit && hit[1] !== undefined && hit[1] !== null && String(hit[1]).trim() !== '') return hit[1];
  }
  return '';
}

export function mapearProduto(row) {
  return {
    gtin: String(valor(row, ['GTIN','EAN','Código de Barras','Codigo de Barras'])).trim(),
    sku: String(valor(row, ['SKU','Código','Codigo','Código Produto','Codigo Produto'])).trim(),
    nome: String(valor(row, ['Produto','Nome do Produto','Nome','Descrição','Descricao'])).trim(),
    familia: String(valor(row, ['Família','Familia'])).trim(),
    local: String(valor(row, ['Local','Localização','Localizacao'])).trim(),
    quantidade: Number(valor(row, ['Quantidade','Estoque','Estoque Atual','Saldo'])) || 0
  };
}

export function importarPlanilha(file) {
  if (!window.XLSX) throw new Error('Biblioteca XLSX não carregada.');
  return file.arrayBuffer().then(buffer => {
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    const produtos = rows.map(mapearProduto).filter(p => p.nome || p.sku || p.gtin);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
    return { produtos, total: produtos.length, arquivo: file.name };
  });
}

export function lerCatalogoLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

export function limparCatalogoLocal() {
  localStorage.removeItem(STORAGE_KEY);
}

export function buscarProdutos(query) {
  const q = normalizarCabecalho(query);
  if (!q) return [];
  return lerCatalogoLocal().filter(p => [p.gtin,p.sku,p.nome].some(v => normalizarCabecalho(v).includes(q)));
}
