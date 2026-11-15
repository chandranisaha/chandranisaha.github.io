/** Ctrl K command palette. `commands` is [{ label, hint, run, hidden }]; hidden ones only match when typed. */
export function createPalette(dialog, commands) {
  dialog.innerHTML = `<input type="text" placeholder="Type a command…  try: sudo" aria-label="Command" autocomplete="off" spellcheck="false"><ul role="listbox"></ul>`;
  const input = dialog.querySelector('input'), list = dialog.querySelector('ul');
  let shown = [], sel = 0;

  function render() {
    const q = input.value.trim().toLowerCase();
    shown = commands.filter(c => (c.hidden ? q.length > 1 && c.label.startsWith(q.slice(0, c.label.length)) : c.label.toLowerCase().includes(q)));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.innerHTML = shown.length
      ? shown.map((c, i) => `<li role="option" data-i="${i}" class="${i === sel ? 'sel' : ''}">${c.label}<span>${c.hint || ''}</span></li>`).join('')
      : `<li class="empty">Permission denied. Try “sudo hire chandrani”.</li>`;
  }
  function exec(i) {
    const c = shown[i];
    if (!c) return;
    dialog.close();
    c.run();
  }
  const open = () => { if (dialog.open) return; input.value = ''; sel = 0; render(); dialog.showModal(); input.focus(); };

  input.addEventListener('input', () => { sel = 0; render(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { sel = Math.min(shown.length - 1, sel + 1); render(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); render(); e.preventDefault(); }
    else if (e.key === 'Enter') { exec(sel); e.preventDefault(); }
  });
  list.addEventListener('click', e => { const li = e.target.closest('[data-i]'); if (li) exec(+li.dataset.i); });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dialog.open ? dialog.close() : open(); }
  });
  return { open };
}
