import { chapters } from './content.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wait = ms => new Promise(r => setTimeout(r, ms));

/** Resolves once the element is on screen; rejects quietly (returns false) once it has left the page. */
async function whenVisible(el, state) {
  while (el.isConnected && !state.visible) await wait(300);
  return el.isConnected;
}
function watch(el) {
  const state = { visible: false };
  new IntersectionObserver(es => { state.visible = es[0].isIntersecting; }).observe(el);
  return state;
}

// A stylised session using the shell's own built-ins. Illustrative, not a recording.
const SESSION = [
  ['hop projects', []],
  ['reveal -l', ['c-shell/   xv6/   report.pdf']],
  ['sleep 30 &', ['[1] 4821']],
  ['activities', ['[4821] : sleep - Running']],
  ['cat log.txt | grep err > out.txt', []],
  ['snoop ./a.out', ['read 12   write 4   openat 3']],
];
const PROMPT = '<span class="pr">&lt;chandrani@iiith:~&gt;</span> ';

async function terminal(el, calm) {
  el.innerHTML = '<div class="term"><div class="term-bar"><i></i><i></i><i></i><span>shell.out</span></div><div class="term-body"></div></div>';
  const body = el.querySelector('.term-body');
  const line = html => { const d = document.createElement('div'); d.innerHTML = html; body.appendChild(d); while (body.children.length > 9) body.firstChild.remove(); return d; };
  if (calm) { SESSION.forEach(([cmd, out]) => { line(PROMPT + esc(cmd)); out.forEach(o => line(`<span class="out">${esc(o)}</span>`)); }); return; }
  const state = watch(el);
  while (await whenVisible(el, state)) {
    body.innerHTML = '';
    for (const [cmd, out] of SESSION) {
      if (!(await whenVisible(el, state))) return;
      const d = line(PROMPT + '<span class="cur"></span>'), cur = d.querySelector('.cur');
      await wait(380);
      for (const ch of cmd) { cur.textContent += ch; await wait(34 + Math.random() * 40); }
      await wait(260);
      cur.classList.remove('cur');
      for (const o of out) { line(`<span class="out">${esc(o)}</span>`); await wait(120); }
    }
    line(PROMPT + '<span class="cur"></span>');
    await wait(2600);
  }
}

const PUZZLE = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const SOLVED = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

async function sudoku(el, calm) {
  el.innerHTML = `<div class="sudoku"><div class="sgrid">${[...PUZZLE].map(c => `<span>${c === '.' ? '' : c}</span>`).join('')}</div>
    <div class="slegend"><div><b class="s-n">0</b>decisions</div><div><b class="s-b">0</b>backtracks</div><div>DPLL · unit propagation · VSIDS</div></div></div>`;
  const cells = [...el.querySelectorAll('.sgrid span')], nEl = el.querySelector('.s-n'), bEl = el.querySelector('.s-b');
  const empty = [...PUZZLE].map((c, i) => (c === '.' ? i : -1)).filter(i => i >= 0);
  if (calm) { empty.forEach(i => { cells[i].textContent = SOLVED[i]; cells[i].className = 'solved'; }); return; }
  const state = watch(el);
  while (await whenVisible(el, state)) {
    let n = 0, b = 0;
    empty.forEach(i => { cells[i].textContent = ''; cells[i].className = ''; });
    nEl.textContent = bEl.textContent = '0';
    await wait(700);
    for (const i of empty) {
      if (!(await whenVisible(el, state))) return;
      if (Math.random() < 0.16) {
        cells[i].textContent = String(((+SOLVED[i] + 3) % 9) + 1); cells[i].className = 'try';
        bEl.textContent = ++b; nEl.textContent = ++n;
        await wait(170);
      }
      cells[i].textContent = SOLVED[i]; cells[i].className = 'solved';
      nEl.textContent = ++n;
      await wait(62);
    }
    await wait(2800);
  }
}

const VISUALS = { terminal, sudoku };

/** Project cards: generated visuals, a hover tilt, and the case-study dialog. */
export function createShowcase({ calm }) {
  const projects = Object.fromEntries(chapters.flatMap(c => (c.projects || []).map(p => [p.id, { ...p, color: c.color }])));
  const dialog = document.getElementById('case');
  document.querySelectorAll('.project [data-visual]').forEach(el => VISUALS[el.dataset.visual]?.(el, calm));

  if (!calm && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  let shots = [], at = 0;
  function show(i) {
    at = (i + shots.length) % shots.length;
    const s = shots[at];
    dialog.querySelector('.case-stage').innerHTML = `<img src="${esc(s.src)}" alt="${esc(s.cap)}">`;
    dialog.querySelector('.case-cap').innerHTML = `<span>${esc(s.cap)}</span><span>${at + 1} / ${shots.length}</span>`;
  }

  function open(id) {
    const p = projects[id];
    if (!p) return;
    shots = p.media.type === 'images' ? p.media.images : [];
    const list = (title, items) => (items?.length ? `<h4>${title}</h4><ul class="pts">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '');
    dialog.style.setProperty('--c', p.color);
    dialog.innerHTML = `
      <button class="case-x" aria-label="Close">×</button>
      <div class="case-media">
        <div class="case-stage"></div>
        ${shots.length ? '<div class="case-cap"></div>' : ''}
        ${shots.length > 1 ? '<button class="g-btn g-prev" aria-label="Previous image">‹</button><button class="g-btn g-next" aria-label="Next image">›</button>' : ''}
      </div>
      <div class="case-body">
        <p class="over">${esc(p.what)}</p>
        <h2>${esc(p.name)}</h2>
        <p class="lede">${esc(p.text)}</p>
        ${list('What it does', p.points)}
        ${list('Under the hood', p.hood)}
        <div class="tags">${p.stack.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="actions">${(p.links || []).map((l, i) => `<a class="btn ${i ? '' : 'primary'}" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')}</div>
      </div>`;
    if (shots.length) show(0);
    else VISUALS[p.media.type]?.(dialog.querySelector('.case-stage'), calm);
    dialog.showModal();
    dialog.querySelector('.case-body').scrollTop = 0;
  }

  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if (o) open(o.dataset.open);
  });
  dialog.addEventListener('click', e => {
    if (e.target === dialog || e.target.closest('.case-x')) dialog.close();
    else if (e.target.closest('.g-prev')) show(at - 1);
    else if (e.target.closest('.g-next')) show(at + 1);
  });
  dialog.addEventListener('keydown', e => {
    if (shots.length < 2) return;
    if (e.key === 'ArrowLeft') show(at - 1);
    else if (e.key === 'ArrowRight') show(at + 1);
  });
  // The close event arrives a tick late, so only clear if it has not been reopened.
  dialog.addEventListener('close', () => { if (!dialog.open) dialog.innerHTML = ''; });
  return { open };
}
