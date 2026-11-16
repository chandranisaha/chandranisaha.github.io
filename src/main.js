import './style.css';
import { me, chapters, contact, twin as twinData, ORDER, NAV } from './content.js';
import { createStage } from './stage.js';
import { createConnect } from './connect.js';
import { renderApp } from './ui.js';
import { createWorld } from './scene/world.js';
import { createTwin } from './twin.js';
import { createPaint } from './paint.js';
import { createPalette } from './palette.js';
import { sound } from './audio.js';
import { createShowcase } from './showcase.js';

renderApp();

const $ = s => document.querySelector(s);
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fx = $('#fx');
createShowcase({ calm });
let world = null;

function toast(html) {
  const el = document.createElement('div');
  el.className = 'toast'; el.innerHTML = html;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), 3700);
}

function confetti(n = 70) {
  const cols = ['#ffb347', '#ff7ab8', '#3ecfc0', '#b79cff', '#ef5b4c', '#f4ecdf'];
  for (let i = 0; i < n; i++) {
    const el = document.createElement('i');
    el.className = 'confetti';
    el.style.cssText = `left:${Math.random() * 100}vw;background:${cols[i % cols.length]};--dx:${(Math.random() - 0.5) * 240}px;--d:${1.6 + Math.random() * 1.8}s;animation-delay:${Math.random() * 0.5}s`;
    fx.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  }
}

function hearts() {
  const p = world?.catScreen() || { x: innerWidth / 2, y: innerHeight / 2 };
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('span');
    el.className = 'heart'; el.textContent = '♥';
    el.style.cssText = `left:${p.x}px;top:${p.y}px;--dx:${(Math.random() - 0.5) * 120}px;--rot:${(Math.random() - 0.5) * 60}deg;animation-delay:${i * 0.07}s`;
    fx.appendChild(el);
    setTimeout(() => el.remove(), 1900);
  }
}

const goTo = key => document.getElementById(key === 'core' ? 'twin' : key)?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });

// Modes
function setMode(mode) {
  document.body.dataset.mode = mode;
  world?.setPaused(mode === 'resume');
  const url = new URL(location.href);
  if (mode === 'resume') url.searchParams.set('view', 'resume'); else url.searchParams.delete('view');
  history.replaceState(null, '', url);
  scrollTo({ top: 0, behavior: 'instant' });
}
const toggleMode = () => setMode(document.body.dataset.mode === 'resume' ? 'explore' : 'resume');

// Sound
const soundBtn = $('#sound-btn');
function setSound(v) {
  sound.set(v);
  soundBtn.setAttribute('aria-pressed', String(v));
  soundBtn.querySelector('.lbl').textContent = v ? 'Sound on' : 'Sound off';
}
soundBtn.addEventListener('click', () => setSound(!sound.on));

// Paint
const paint = createPaint($('#paint'), { calm });
function setPaint(v) {
  paint.set(v);
  $('#paint-chip').hidden = !v;
  if (v) toast('Your cursor is a brush now. <b>P</b> to stop, <b>C</b> to clear.');
}

// Dance
let danceTimer = 0;
function dance() {
  document.body.classList.add('dance');
  world?.setDance(true);
  sound.beat(9);
  if (!sound.on) toast('Dance break. It is better with <b>sound on</b>.');
  clearTimeout(danceTimer);
  danceTimer = setTimeout(() => { document.body.classList.remove('dance'); world?.setDance(false); }, 9000);
}

function hire() {
  confetti(120);
  toast('Access granted. Opening a line to the real Chandrani.');
  setTimeout(() => { location.href = `mailto:${me.email}?subject=${encodeURIComponent('sudo hire chandrani')}`; }, 1400);
}

function pet() {
  world?.pet();
  hearts();
  sound.meow();
}

// Buttons with data-action
const actions = {
  top: () => scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }),
  resume: toggleMode,
  print: () => print(),
  paint: () => setPaint(!paint.on),
  sound: () => setSound(!sound.on),
  palette: () => palette.open(),
  dance,
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-action]');
  if (b && actions[b.dataset.action]) actions[b.dataset.action]();
  const g = e.target.closest('[data-go]');
  if (g) goTo(g.dataset.go);
});

// Header: the section rail follows the scroll, and a hairline shows how far down the page you are.
const rail = $('.rail'), railInd = $('.rail-ind'), railBtns = [...document.querySelectorAll('.rail [data-go]')];
const colorOf = Object.fromEntries(chapters.map(c => [c.key, c.color]));
let railKey = null;
function setRail(key = railKey) {
  railKey = key;
  const b = railBtns.find(x => x.dataset.go === key);
  railBtns.forEach(x => x.classList.toggle('on', x === b));
  railInd.style.opacity = b ? 1 : 0;
  if (!b) return;
  rail.style.setProperty('--rc', colorOf[key] || '#ffb347');
  railInd.style.width = `${b.offsetWidth}px`;
  railInd.style.transform = `translateX(${b.offsetLeft}px)`;
}
addEventListener('resize', () => setRail());
document.fonts?.ready.then(() => setRail());

const progress = $('#progress');
let progressQueued = false;
addEventListener('scroll', () => {
  if (progressQueued) return;
  progressQueued = true;
  requestAnimationFrame(() => {
    progressQueued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  });
}, { passive: true });

const clock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
const tickClock = () => document.querySelectorAll('[data-clock]').forEach(el => { el.textContent = clock.format(new Date()); });
tickClock(); setInterval(tickClock, 20000);

const palette = createPalette($('#palette'), [
  ...ORDER.filter(k => NAV[k]).map(k => ({ label: `go ${NAV[k]}`, hint: 'jump', run: () => goTo(k) })),
  { label: 'résumé', hint: 'the quick version', run: toggleMode },
  { label: 'sound', hint: 'toggle', run: () => setSound(!sound.on) },
  { label: 'paint', hint: 'toggle brush', run: () => setPaint(!paint.on) },
  { label: 'meow', hint: 'pet the cat', run: pet },
  { label: 'dance', hint: '♪', run: dance },
  { label: 'email', hint: me.email, run: () => { location.href = `mailto:${me.email}`; } },
  { label: 'sudo hire chandrani', hint: 'root', hidden: true, run: hire },
]);

// Keys: P paint, C clear, Konami code
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let kpos = 0;
addEventListener('keydown', e => {
  if (e.target.matches?.('input, textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  kpos = k === KONAMI[kpos] ? kpos + 1 : k === KONAMI[0] ? 1 : 0;
  if (kpos === KONAMI.length) { kpos = 0; dance(); return; }
  if (document.body.dataset.mode === 'resume') return;
  if (k === 'p') setPaint(!paint.on);
  else if (k === 'c' && paint.on) paint.clear();
});

// 3D world
const sections = ORDER.map(key => ({ key, el: document.getElementById(key) }));
const noteOf = Object.fromEntries(['core', ...chapters.map(c => c.key), 'cation'].map((k, i) => [k, i]));

try {
  world = await createWorld({ canvas: $('#world'), labelsEl: $('#labels'), sections, chapters, word: me.word, calm });
  world.on('pet', () => { hearts(); sound.meow(); });
  world.on('section', key => setRail(key));
  world.on('atom', key => { sound.note(noteOf[key] ?? 0); goTo(key); });
  world.on('hover', key => {
    sound.note(noteOf[key] ?? 0);
  });
  document.addEventListener('visibilitychange', () => world.setPaused(document.hidden || document.body.dataset.mode === 'resume'));
} catch (err) {
  console.warn('3D scene unavailable, showing the plain version.', err);
  setMode('resume');
}

createTwin({ root: $('#twin'), data: twinData, world, sound, goTo });
createStage({ root: $('#rhythm'), acts: chapters.find(c => c.key === 'rhythm').acts, world, sound });
createConnect({ root: $('#contact'), email: me.email, reasons: contact.reasons, world, calm });

if (new URLSearchParams(location.search).get('view') === 'resume') setMode('resume');
