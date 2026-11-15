const STOP = new Set('a an the is are was were do does did to of in on at for and or with it this that be been please me my i you your so can could would have has any some tell about what'.split(' '));
const stem = w => (w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '') : w);
const tok = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w && !STOP.has(w)).map(stem);
const wait = ms => new Promise(r => setTimeout(r, ms));

/** The interview: question cards, typed answers with sources, and a topic tracker. The orb in the 3D scene reacts while it answers. */
export function createTwin({ root, data, world, sound, goTo, onCovered }) {
  const log = root.querySelector('.twin-log'), cardsEl = root.querySelector('.twin-cards');
  const form = root.querySelector('.twin-form'), input = form.querySelector('input');
  const countEl = root.querySelector('.twin-count b'), verdict = root.querySelector('.twin-verdict');
  const topics = Object.fromEntries(data.topics.map(t => [t.id, t]));
  const byId = Object.fromEntries(data.entries.map(e => [e.id, e]));
  const index = data.entries.map(e => ({ e, kw: new Set(e.keywords.map(stem)), q: new Set(tok(e.q)) }));
  const asked = new Set(), covered = new Set();
  let run = 0, skip = false;

  function match(text) {
    const words = tok(text);
    let best = null, top = 0;
    for (const { e, kw, q } of index) {
      let s = 0;
      for (const w of words) s += kw.has(w) ? 3 : q.has(w) ? 1 : 0;
      if (s > top) { top = s; best = e; }
    }
    return top >= 3 ? best : null;
  }

  function deal() {
    let pool = data.cards.filter(id => !asked.has(id));
    if (pool.length < 2) { pool = data.cards.slice(); }
    cardsEl.innerHTML = pool.slice(0, 4).map(id => {
      const e = byId[id], t = topics[e.topic];
      return `<button class="qcard" data-id="${id}" style="--tc:${t.color}"><small>${t.label}</small>${e.q}</button>`;
    }).join('');
  }

  function bubble(cls, html) {
    const el = document.createElement('div');
    el.className = `msg ${cls}`; el.innerHTML = html;
    log.appendChild(el); log.scrollTop = log.scrollHeight;
    return el;
  }

  async function ask(text, entry) {
    const id = ++run;
    skip = true; // finish any answer still typing
    await wait(0);
    skip = false;
    bubble('q', text.replace(/[<>&]/g, ''));
    const e = entry || match(text);
    const color = e ? topics[e.topic].color : '#b3abc9';
    const el = bubble('a', `<span class="who">twin</span><span class="text"><span class="dots"><span></span><span></span><span></span></span></span>`);
    el.style.setProperty('--tc', color);
    world?.setThink(1);
    await wait(650);
    world?.setThink(0);
    if (id !== run) { el.remove(); return; }
    const answer = e ? e.a : data.fallback, textEl = el.querySelector('.text');
    el.classList.add('typing');
    world?.setSpeak(1, color);
    el.onclick = () => { skip = true; };
    textEl.textContent = '';
    for (let i = 0; i < answer.length; i++) {
      if (skip || id !== run) break;
      textEl.textContent += answer[i];
      if (i % 4 === 0) { log.scrollTop = log.scrollHeight; sound.blip(i); }
      await wait(answer[i] === '.' || answer[i] === ',' ? 90 : 13);
    }
    textEl.textContent = answer;
    el.classList.remove('typing'); el.onclick = null;
    if (id === run) world?.setSpeak(0);
    const src = e ? e.src : [{ label: 'Contact', to: 'contact' }];
    const s = document.createElement('div');
    s.className = 'srcs';
    s.innerHTML = src.map(x => `<button data-to="${x.to}">${x.label}</button>`).join('');
    el.appendChild(s); log.scrollTop = log.scrollHeight;
    if (e) {
      asked.add(e.id);
      if (!covered.has(e.topic)) {
        covered.add(e.topic);
        root.querySelector(`[data-topic="${e.topic}"]`)?.classList.add('on');
        countEl.textContent = covered.size;
        sound.note(covered.size);
        if (covered.size >= 5) { verdict.hidden = false; onCovered?.(covered.size); }
      }
    }
    deal();
  }

  cardsEl.addEventListener('click', ev => {
    const b = ev.target.closest('.qcard');
    if (b) ask(byId[b.dataset.id].q, byId[b.dataset.id]);
  });
  log.addEventListener('click', ev => { const b = ev.target.closest('[data-to]'); if (b) goTo(b.dataset.to); });
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    ask(v);
  });

  bubble('a', `<span class="who">twin</span><span class="text">${data.greeting}</span>`);
  deal();
  return { ask };
}
