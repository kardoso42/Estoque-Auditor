import { enviarCatalogoNuvem, observarCatalogoNuvem } from './firebase.js';
import { salvarCatalogo } from './catalogo.js';

export async function sincronizarCatalogoV51(produtos) {
  if (!Array.isArray(produtos) || !produtos.length) throw new Error('Nenhum produto para sincronizar.');
  return enviarCatalogoNuvem(produtos);
}

export function iniciarSincronizacaoV51(onAtualizado, onErro) {
  return observarCatalogoNuvem(produtos => {
    salvarCatalogo(produtos);
    onAtualizado?.(produtos);
  }, onErro);
}
