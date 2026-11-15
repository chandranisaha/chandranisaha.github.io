import { me, about, chapters, contact, twin } from './content.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ext = 'target="_blank" rel="noopener"';

const items = list => `<ul class="items">${list.map(i => `
  <li><div class="it-head"><strong>${esc(i.title)}</strong>${i.meta ? `<span>${esc(i.meta)}</span>` : ''}</div>${i.text ? `<p>${esc(i.text)}</p>` : ''}</li>`).join('')}</ul>`;

const tags = list => `<div class="tags">${list.map(t => `<span>${esc(t)}</span>`).join('')}</div>`;

const project = p => `
  <article class="card project reveal">
    <div class="media" data-open="${p.id}">
      ${p.media.type === 'images'
        ? `<img src="${esc(p.media.images[0].src)}" alt="${esc(p.name)}: ${esc(p.media.images[0].cap)}" loading="lazy" onerror="this.closest('.media').classList.add('broken')">`
        : `<div class="visual" data-visual="${p.media.type}"></div>`}
      <span class="badge">${esc(p.what)}</span>
      <span class="peek">Open case study →</span>
    </div>
    <div class="project-body">
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.text)}</p>
      ${tags(p.stack)}
      <div class="links"><button class="link" data-open="${p.id}">Case study →</button>${(p.links || []).map(l => `<a class="link" href="${esc(l.href)}" ${ext}>${esc(l.label)} ↗</a>`).join('')}</div>
    </div>
  </article>`;

const more = list => `
  <article class="card reveal slim">
    <p class="over">also built</p>
    <ul class="items more">${list.map(m => `
      <li><div class="it-head">${m.href ? `<a class="link" href="${esc(m.href)}" ${ext}>${esc(m.name)} ↗</a>` : `<strong>${esc(m.name)}</strong>`}<span>${esc(m.stack)}</span></div><p>${esc(m.text)}</p></li>`).join('')}</ul>
  </article>`;

const chapter = c => `
  <section class="chapter side-${c.side}" id="${c.key}" data-key="${c.key}" style="--c:${c.color}">
    <div class="col">
      <article class="card reveal">
        <p class="over"><span>${c.no}</span>${esc(c.label)}</p>
        <h2>${esc(c.title)}</h2>
        <p class="lede">${esc(c.lede)}</p>
        ${c.items ? items(c.items) : ''}
        ${c.cta ? `<button class="btn" data-action="${c.cta.action}">${esc(c.cta.label)}<small>${esc(c.cta.hint)}</small></button>` : ''}
      </article>
      ${c.projects ? c.projects.map(project).join('') : ''}
      ${c.more ? more(c.more) : ''}
      ${c.tags ? `<article class="card reveal slim"><p class="over">toolbox</p>${tags(c.tags)}</article>` : ''}
    </div>
  </section>`;

const contactLinks = () => `
  <a class="btn primary" href="mailto:${me.email}">${me.email}</a>
  <a class="btn" href="${me.github}" ${ext}>GitHub ↗</a>
  <a class="btn" href="${me.linkedin}" ${ext}>LinkedIn ↗</a>
  ${me.cv ? `<a class="btn" href="${esc(me.cv)}" ${ext}>CV (PDF) ↗</a>` : ''}`;

function story() {
  return `
  <section class="chapter hero" id="hero" data-key="hero">
    <div class="hero-copy">
      <p class="greet"><span lang="bn">নমস্কার</span> · hello · <span lang="hi">नमस्ते</span></p>
      <h1 class="sr-only">${esc(me.name)}</h1>
      <div class="hero-below">
        <p class="tagline">${esc(me.tagline)}</p>
        <p class="role">${esc(me.role)}</p>
      </div>
    </div>
    <p class="hint"><span>hold to collapse my name</span><span>scroll to fall into the molecule ↓</span></p>
  </section>

  <section class="chapter side-left" id="about" data-key="about" style="--c:#f4ecdf">
    <div class="col">
      <article class="card reveal">
        <p class="over"><span>00</span>hello</p>
        <h2>${esc(about.title)}</h2>
        <p class="lede">${esc(about.lede)}</p>
        <p>${esc(about.more)}</p>
        ${tags(about.facts)}
      </article>
    </div>
  </section>

  ${chapters.map(chapter).join('')}

  <section class="chapter side-right twin-section" id="twin" data-key="twin" style="--c:#ffb347">
    <div class="col wide">
      <article class="card reveal twin">
        <p class="over"><span>06</span>the twin</p>
        <h2>You’re the interviewer now.</h2>
        <p class="lede">Pick a card or type your own question. My twin answers from my CV and shows where each answer comes from.</p>
        <div class="twin-cover">
          <div class="twin-topics">${twin.topics.map(t => `<span data-topic="${t.id}" style="--c:${t.color}">${esc(t.label)}</span>`).join('')}</div>
          <p class="twin-count"><b>0</b>/${twin.topics.length} topics covered</p>
        </div>
        <div class="twin-log" aria-live="polite" tabindex="0"></div>
        <div class="twin-cards" aria-label="Suggested questions"></div>
        <form class="twin-form">
          <input type="text" name="q" placeholder="Ask me anything…" aria-label="Your question" autocomplete="off" maxlength="160">
          <button class="btn primary" type="submit">Ask</button>
        </form>
        <div class="twin-verdict" hidden>
          <p><b>Interview notes:</b> candidate covered five topics without flinching.</p>
          <a class="btn primary" href="mailto:${me.email}?subject=${encodeURIComponent('I interviewed your twin. Now you.')}">Schedule the real interview</a>
        </div>
        <p class="fine">No LLM behind this. A small retrieval script matches your question to notes I wrote, and it runs entirely in your browser.</p>
      </article>
    </div>
  </section>

  <section class="chapter side-left last" id="contact" data-key="contact" style="--c:#ffb347">
    <div class="col">
      <article class="card reveal">
        <p class="over"><span>07</span>contact</p>
        <h2>${esc(contact.title)}</h2>
        <p class="lede">${esc(contact.lede)}</p>
        <div class="actions">${contactLinks()}</div>
        <p class="fine">In a hurry? <button class="inline" data-action="resume">Read the 30-second version</button>. Curious? There are seven secrets on this page.</p>
      </article>
    </div>
  </section>`;
}

function nav() {
  return `
  <button class="logo" data-action="top" aria-label="Back to top" title="Cs: Chandrani Saha. Also caesium, the element that keeps atomic time."><small>55</small>Cs</button>
  <div class="nav-right">
    <button class="pill" id="secrets-btn" aria-expanded="false" aria-controls="secrets-panel" title="Secrets found">✦ <b>0</b>/7</button>
    <button class="pill" id="sound-btn" aria-pressed="false" title="Sound">♪ <span>off</span></button>
    <button class="pill kbd" data-action="palette" title="Command palette">Ctrl K</button>
    <button class="pill mode" data-action="resume" title="Plain résumé view"><span class="when-explore">30-second version</span><span class="when-resume">← back to the fun version</span></button>
  </div>
  <div id="secrets-panel" class="panel" hidden></div>`;
}

function resume() {
  const byKey = Object.fromEntries(chapters.map(c => [c.key, c]));
  const sci = byKey.science.items, lead = byKey.lead.items;
  const row = i => `<li><div class="r-head"><strong>${esc(i.title)}</strong><span>${esc(i.meta || '')}</span></div>${i.text ? `<p>${esc(i.text)}</p>` : ''}</li>`;
  return `
  <div class="paper">
    <header>
      <h1>${esc(me.name)}</h1>
      <p>${esc(me.role)} · ${esc(me.location)}</p>
      <p class="r-links"><a href="mailto:${me.email}">${me.email}</a><a href="${me.github}" ${ext}>github.com/chandranisaha</a><a href="${me.linkedin}" ${ext}>linkedin.com/in/chandranisaha</a></p>
      <div class="r-actions"><button class="btn" data-action="print">Print / save as PDF</button><button class="btn" data-action="resume">Back to the fun version</button></div>
    </header>
    <section><h2>Summary</h2><p>${esc(about.lede)}</p></section>
    <section><h2>Education</h2><ul>${[sci[0], sci[3]].map(row).join('')}</ul></section>
    <section><h2>Projects</h2><ul>${byKey.build.projects.map(p => `<li><div class="r-head"><strong>${esc(p.name)}</strong><span>${esc(p.stack.join(' · '))}</span></div><p>${esc(p.text)}${(p.links || []).map(l => ` <a href="${esc(l.href)}" ${ext}>${esc(l.label)}</a>`).join(' ·')}</p></li>`).join('')}${byKey.build.more.map(m => `<li><div class="r-head"><strong>${m.href ? `<a href="${esc(m.href)}" ${ext}>${esc(m.name)}</a>` : esc(m.name)}</strong><span>${esc(m.stack)}</span></div><p>${esc(m.text)}</p></li>`).join('')}</ul></section>
    <section><h2>Experience and leadership</h2><ul>${lead.map(row).join('')}</ul></section>
    <section><h2>Scholarships</h2><ul>${[sci[1], sci[2]].map(row).join('')}</ul></section>
    <section><h2>Skills</h2><p>${esc(byKey.build.tags.join(' · '))}</p></section>
    <section><h2>Also</h2><p>Painting, dance (Cyclorama performance team) and music. English, Bengali, Hindi.</p></section>
  </div>`;
}

/** Build the page from content.js. */
export function renderApp() {
  document.getElementById('nav').innerHTML = nav();
  document.getElementById('story').innerHTML = story();
  document.getElementById('resume').innerHTML = resume();
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('in', e.isIntersecting)), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
