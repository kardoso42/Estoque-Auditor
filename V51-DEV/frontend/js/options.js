const KEY_DARK = 'v51_dark_mode';
const KEY_CONTINUOUS = 'v51_continuous_mode';
const KEY_BLIND = 'v51_blind_mode';

export function initOptions() {
  const modal = document.getElementById('options-modal');
  const open = document.getElementById('btn-options');
  const closeButtons = document.querySelectorAll('[data-close-options]');
  const dark = document.getElementById('dark-mode');
  const continuous = document.getElementById('continuous-mode');
  const blind = document.getElementById('blind-mode');

  if (!modal || !open) return;
  open.addEventListener('click', () => { modal.hidden = false; });
  closeButtons.forEach(btn => btn.addEventListener('click', () => { modal.hidden = true; }));

  dark.checked = localStorage.getItem(KEY_DARK) === '1';
  continuous.checked = localStorage.getItem(KEY_CONTINUOUS) === '1';
  blind.checked = localStorage.getItem(KEY_BLIND) === '1';
  applyDark(dark.checked);

  dark.addEventListener('change', () => { localStorage.setItem(KEY_DARK, dark.checked ? '1' : '0'); applyDark(dark.checked); });
  continuous.addEventListener('change', () => localStorage.setItem(KEY_CONTINUOUS, continuous.checked ? '1' : '0'));
  blind.addEventListener('change', () => localStorage.setItem(KEY_BLIND, blind.checked ? '1' : '0'));
}

function applyDark(enabled) {
  document.documentElement.style.setProperty('--bg', enabled ? '#0f172a' : '#f6f8fb');
  document.documentElement.style.setProperty('--text', enabled ? '#f1f5f9' : '#172033');
}
