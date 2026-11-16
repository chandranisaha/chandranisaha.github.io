/** The stage chapter: three acts. Picking one swaps the text and changes what the atom is doing. */
export function createStage({ root, acts, world, sound }) {
  const tabs = [...root.querySelectorAll('[data-act]')], ind = root.querySelector('.acts-ind'), panel = root.querySelector('.act-panel');
  let current = acts[0].id;

  function place() {
    const t = tabs.find(x => x.dataset.act === current);
    ind.style.width = `${t.offsetWidth}px`;
    ind.style.transform = `translateX(${t.offsetLeft}px)`;
  }

  function select(id, focus = false) {
    const a = acts.find(x => x.id === id);
    if (!a) return;
    current = id;
    for (const t of tabs) {
      const on = t.dataset.act === id;
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    }
    place();
    panel.innerHTML = `<h3>${a.title}</h3><p>${a.text}</p>${a.cta ? `<button class="btn" data-action="${a.cta.action}">${a.cta.label}</button>` : ''}`;
    world?.setStage(id);
  }

  root.querySelector('.acts').addEventListener('click', e => {
    const t = e.target.closest('[data-act]');
    if (t) { select(t.dataset.act); sound.note(tabs.indexOf(t) * 2 + 1); }
  });
  root.querySelector('.acts').addEventListener('keydown', e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const i = tabs.findIndex(t => t.dataset.act === current);
    select(tabs[(i + d + tabs.length) % tabs.length].dataset.act, true);
  });
  addEventListener('resize', place);
  document.fonts?.ready.then(place);
  select(current);
  return { select };
}
