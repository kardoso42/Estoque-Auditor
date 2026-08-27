const STORAGE_KEY = 'v51_catalogo_local';

export const CAMPOS = ['codigo','sku','gtin','nome','familia','local','quantidade','unidade','custo'];

export function normalizar(valor){return String(valor??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')}

export function detectarMapeamento(headers){
  const regras={codigo:['codigo','codigoproduto','idproduto','id'],sku:['sku','codigosku'],gtin:['gtin','ean','codigoebar','codigobarras','codigobarras'],nome:['produto','nome','nomeproduto','descricao','descricaoproduto'],familia:['familia','familiadeproduto','grupo','categoria'],local:['local','localestoque','localizacao','deposito','almoxarifado'],quantidade:['quantidade','qtd','qtdestoque','estoque','estoqueatual','saldo','saldodisponivel'],unidade:['unidade','und'],custo:['custo','custounitario','valorcusto']};
  const result={};
  for(const campo of CAMPOS){const aliases=regras[campo]||[];result[campo]=headers.find(h=>aliases.includes(normalizar(h)))||''}
  return result;
}

export function mapearProduto(row,mapeamento={}){const get=c=>mapeamento[c]?row[mapeamento[c]]:'';return{codigo:String(get('codigo')).trim(),sku:String(get('sku')).trim(),gtin:String(get('gtin')).trim(),nome:String(get('nome')).trim(),familia:String(get('familia')).trim(),local:String(get('local')).trim(),quantidade:Number(String(get('quantidade')).replace(',','.'))||0,unidade:String(get('unidade')).trim(),custo:Number(String(get('custo')).replace(',','.'))||0}}

export function prepararImportacao(rows,mapeamento){return rows.map(r=>mapearProduto(r,mapeamento)).filter(p=>p.nome||p.codigo||p.sku||p.gtin)}

export function salvarCatalogo(produtos){localStorage.setItem(STORAGE_KEY,JSON.stringify(produtos));return produtos.length}
export function lerCatalogoLocal(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{return[]}}
export function limparCatalogoLocal(){localStorage.removeItem(STORAGE_KEY)}
export function buscarProdutos(query){const q=normalizar(query);if(!q)return[];return lerCatalogoLocal().filter(p=>[p.codigo,p.sku,p.gtin,p.nome].some(v=>normalizar(v).includes(q)))}
