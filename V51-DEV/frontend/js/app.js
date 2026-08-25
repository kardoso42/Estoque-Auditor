import { initOptions } from './options.js';
import { initSearch } from './search.js';

const state = { catalogCount: 0, syncStatus: 'Ambiente de teste' };

function init() {
  initOptions();
  initSearch();
  renderState();
  document.getElementById('btn-scanner')?.addEventListener('click', () => {
    document.getElementById('sync-status').textContent = 'Scanner será integrado na próxima etapa';
  });
  document.getElementById('btn-count')?.addEventListener('click', () => {
    document.getElementById('sync-status').textContent = 'Módulo de contagem será integrado na próxima etapa';
  });
}

function renderState() {
  const count = document.getElementById('catalog-count');
  const sync = document.getElementById('sync-status');
  if (count) count.textContent = state.catalogCount ? state.catalogCount.toLocaleString('pt-BR') : '—';
  if (sync) sync.textContent = state.syncStatus;
}

init();
