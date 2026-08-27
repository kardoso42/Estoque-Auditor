const STORAGE_KEY = 'v51_catalogo_local';

export const CAMPOS = ['codigo','sku','gtin','nome','familia','local','quantidade','unidade','custo'];

export function normalizar(valor){return String(valor??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')}

export function detectarMapeamento(headers){
  const regras={
    codigo:['codigo','codigoproduto','codigodoproduto','idproduto','id'],sku:['sku','codigosku','codigodasku'],gtin:['gtin','ean','codigoebar','codigobarras','codigodebarras','codigoeangt','codigoeangt'],nome:['produto','nome','nomeproduto','descricao','descricaoproduto','descricaodoproduto'],familia:['familia','familiadeproduto','familiadoproduto','grupo','categoria'],local:['local','localestoque','localdeestoque','localizacao','localizacaodeestoque','deposito','almoxarifado'],quantidade:['quantidade','qtd','qtdestoque','estoque','estoqueatual','saldo','saldodisponivel','quantidadedeestoque'],unidade:['unidade','und'],custo:['custo','custounitario','valorcusto','cmcunitario','cmctotal']};
  const result={};
  for(const campo of CAMPOS){const aliases=regras[campo]||[];result[campo]=headers.find(h=>aliases.includes(normalizar(h)))||''}
  return result;
}

export function detectarLinhaCabecalho(rows,maxRows=20){
  let melhor={index:0,headers:[],score:0};
  for(let i=0;i<Math.min(rows.length,maxRows);i++){
    const headers=Object.keys(rows[i]||{});const mapping=detectarMapeamento(headers);const score=CAMPOS.filter(c=>mapping[c]).length;
    if(score>melhor.score)melhor={index:i,headers,score};
  }
  return melhor;
}

export function prepararLinhas(rows,headerIndex){
  if(headerIndex===undefined||headerIndex===0)return rows;
  const first=rows[headerIndex];const headers=Object.values(first);
  return rows.slice(headerIndex+1).map(values=>{const obj={};Object.keys(values).forEach(k=>{obj[headers[Number(k)]??k]=values[k]});return obj});
}

function numero(valor){
  if(typeof valor==='number')return Number.isFinite(valor)?valor:0;
  let s=String(valor??'').trim();if(!s)return 0;
  s=s.replace(/\s/g,'');
  if(s.includes(',')&&s.includes('.'))s=s.lastIndexOf(',')>s.lastIndexOf('.')?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'');
  else if(s.includes(','))s=s.replace(',','.');
  return Number(s)||0;
}

export function mapearProduto(row,mapeamento={}){const get=c=>mapeamento[c]?row[mapeamento[c]]:'';return{codigo:String(get('codigo')).trim(),sku:String(get('sku')).trim(),gtin:String(get('gtin')).trim(),nome:String(get('nome')).trim(),familia:String(get('familia')).trim(),local:String(get('local')).trim(),quantidade:numero(get('quantidade')),unidade:String(get('unidade')).trim(),custo:numero(get('custo'))}}

export function prepararImportacao(rows,mapeamento){return rows.map(r=>mapearProduto(r,mapeamento)).filter(p=>p.nome||p.codigo||p.sku||p.gtin)}

export function salvarCatalogo(produtos){localStorage.setItem(STORAGE_KEY,JSON.stringify(produtos));return produtos.length}
export function lerCatalogoLocal(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{return[]}}
export function limparCatalogoLocal(){localStorage.removeItem(STORAGE_KEY)}
export function buscarProdutos(query){const q=normalizar(query);if(!q)return[];return lerCatalogoLocal().filter(p=>[p.codigo,p.sku,p.gtin,p.nome].some(v=>normalizar(v).includes(q)))}
