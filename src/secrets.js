const LIST = [
  { id: 'cat', name: 'Cat person', hint: 'Someone on this page likes head pats.' },
  { id: 'blackhole', name: 'Event horizon', hint: 'Press and hold on my name. Then let go.' },
  { id: 'atoms', name: 'Full valence', hint: 'Touch all five atoms.' },
  { id: 'twin', name: 'Tough interviewer', hint: 'Cover five topics with my twin.' },
  { id: 'paint', name: 'Wet paint', hint: 'Press P and make a mess.' },
  { id: 'hire', name: 'Root access', hint: 'Ctrl K knows a sudo command.' },
  { id: 'dance', name: 'Dance break', hint: '↑ ↑ ↓ ↓ ← → ← → B A' },
];
const KEY = 'cs-secrets';

/** Tracks which secrets a visitor has found. */
export function createSecrets({ button, panel, toast, onFind }) {
  let found = new Set();
  try { found = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { /* storage blocked */ }

  function render() {
    button.querySelector('b').textContent = found.size;
    panel.innerHTML = `<h3>Secrets ${found.size}/${LIST.length}</h3><ul>${LIST.map(s => found.has(s.id)
      ? `<li class="found"><i>✦</i><span>${s.name}</span><small>${s.hint}</small></li>`
      : `<li><i>·</i><span>???</span><small>${s.hint}</small></li>`).join('')}</ul>`;
  }

  button.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded', String(!panel.hidden));
  });
  document.addEventListener('click', e => {
    if (!panel.hidden && !panel.contains(e.target) && !button.contains(e.target)) { panel.hidden = true; button.setAttribute('aria-expanded', 'false'); }
  });
  render();

  return {
    find(id) {
      if (found.has(id)) return false;
      const s = LIST.find(x => x.id === id);
      if (!s) return false;
      found.add(id);
      try { localStorage.setItem(KEY, JSON.stringify([...found])); } catch { /* storage blocked */ }
      render();
      button.classList.remove('bump'); void button.offsetWidth; button.classList.add('bump');
      toast(`Secret found: <b>${s.name}</b> · ${found.size}/${LIST.length}`);
      onFind?.(found.size, LIST.length);
      return true;
    },
  };
}
