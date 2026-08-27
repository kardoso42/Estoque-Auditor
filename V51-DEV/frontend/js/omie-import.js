import { detectarMapeamento, prepararImportacao, salvarCatalogo } from './catalogo.js';

export async function lerPlanilhaUniversal(file){
  if(!window.XLSX) throw new Error('Biblioteca XLSX não carregada.');
  const wb=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:true});
  const sheets=wb.SheetNames.map(name=>{const ws=wb.Sheets[name];return{name,rows:XLSX.utils.sheet_to_json(ws,{defval:'',raw:false})}});
  const principal=sheets.find(s=>s.rows.length)||sheets[0];
  if(!principal) throw new Error('A planilha não possui dados.');
  const headers=Object.keys(principal.rows[0]||{});
  return {file:file.name,sheets,rows:principal.rows,headers,mapeamento:detectarMapeamento(headers)};
}

export function analisarImportacao(dados,mapeamento=dados.mapeamento){
  const produtos=prepararImportacao(dados.rows,mapeamento);
  const preenchidos=Object.values(mapeamento).filter(Boolean).length;
  return {produtos,totalLido:dados.rows.length,totalProdutos:produtos.length,mapeamento,camposMapeados:preenchidos,totalCampos:9};
}

export function gravarImportacao(resultado){return salvarCatalogo(resultado.produtos)}
