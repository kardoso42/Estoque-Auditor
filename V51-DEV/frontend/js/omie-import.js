import { mapearProduto } from './catalogo.js';

const ALIASES = {
  local: ['Local','Localização','Localizacao','Almoxarifado','Depósito','Deposito'],
  familia: ['Família','Familia','Grupo','Categoria'],
  pendente: ['Pendente','Pendentes','Status'],
  quantidade: ['Quantidade','Estoque','Estoque Atual','Saldo','Qtd. Estoque']
};

function normalizar(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')}
function get(row, names){const entries=Object.entries(row||{});for(const n of names){const key=normalizar(n);const hit=entries.find(([k])=>normalizar(k)===key);if(hit)return hit[1]}return ''}

export async function lerOmie(file){
  if(!window.XLSX) throw new Error('Biblioteca XLSX não carregada.');
  const buffer=await file.arrayBuffer();
  const wb=XLSX.read(buffer,{type:'array',cellDates:true});
  const sheet=wb.Sheets[wb.SheetNames[0]];
  const rows=XLSX.utils.sheet_to_json(sheet,{defval:''});
  return {file:file.name,sheets:wb.SheetNames,rows};
}

export function prepararOmie(rows, filtros={}){
  const locais=new Set(); const familias=new Set();
  rows.forEach(r=>{const l=String(get(r,ALIASES.local)).trim();const f=String(get(r,ALIASES.familia)).trim();if(l)locais.add(l);if(f)familias.add(f)});
  let selecionados=rows.slice();
  if(filtros.locais?.length) selecionados=selecionados.filter(r=>filtros.locais.includes(String(get(r,ALIASES.local)).trim()));
  if(filtros.familias?.length) selecionados=selecionados.filter(r=>filtros.familias.includes(String(get(r,ALIASES.familia)).trim()));
  if(filtros.pendentes) selecionados=selecionados.filter(r=>{const v=normalizar(get(r,ALIASES.pendente));return v.includes('pend')||v==='sim'||v==='true'});
  const produtos=selecionados.map(mapearProduto).filter(p=>p.nome||p.sku||p.gtin);
  return {produtos,totalLido:rows.length,totalSelecionado:selecionados.length,locais:[...locais].sort(),familias:[...familias].sort()};
}

export function exportarCatalogoLocal(produtos){localStorage.setItem('v51_catalogo_local',JSON.stringify(produtos));return produtos.length}
