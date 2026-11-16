import { me, about, chapters, contact, twin, skills, ORDER, NAV } from './content.js';

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

// The stage chapter: three acts to switch between, and a playbill of roles.
const acts = c => `
  <div class="acts" role="tablist" aria-label="Acts">${c.acts.map((a, i) => `<button role="tab" data-act="${a.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(a.label)}</button>`).join('')}<i class="acts-ind" aria-hidden="true"></i></div>
  <div class="act-panel" role="tabpanel" aria-live="polite"></div>`;

const bill = roles => `
  <article class="card reveal slim playbill">
    <p class="over">also on the bill</p>
    <ul class="bill">${roles.map(r => `<li><span>${esc(r[0])}</span><i aria-hidden="true"></i><span>${esc(r[1])}</span></li>`).join('')}</ul>
  </article>`;

const chapter = c => `
  <section class="chapter side-${c.side}" id="${c.key}" data-key="${c.key}" style="--c:${c.color}">
    <div class="col">
      <article class="card reveal">
        <p class="over"><span>${c.no}</span>${esc(c.label)}</p>
        <h2>${esc(c.title)}</h2>
        <p class="lede">${esc(c.lede)}</p>
        ${c.items ? items(c.items) : ''}
        ${c.acts ? acts(c) : ''}
        ${c.cta ? `<button class="btn" data-action="${c.cta.action}">${esc(c.cta.label)}<small>${esc(c.cta.hint)}</small></button>` : ''}
      </article>
      ${c.projects ? c.projects.map(project).join('') : ''}
      ${c.more ? more(c.more) : ''}
      ${c.roles ? bill(c.roles) : ''}
      ${c.tags ? `<article class="card reveal slim"><p class="over">toolbox</p>${tags(c.tags)}</article>` : ''}
    </div>
  </section>`;

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
    <div class="col wide">
      <article class="card reveal connect">
        <p class="over"><span>07</span>contact</p>
        <h2>${esc(contact.title)}</h2>
        <p class="lede">${esc(contact.lede)}</p>
        <div class="reasons" role="radiogroup" aria-label="What is it about">${contact.reasons.map((r, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-reason="${r.id}">${esc(r.label)}</button>`).join('')}</div>
        <form class="compose">
          <label><span>Your name</span><input name="name" autocomplete="name" maxlength="60" placeholder="So the particles can say hi"></label>
          <label><span>First line</span><textarea name="line" rows="2" maxlength="600" placeholder="What should I know?"></textarea></label>
          <div class="preview" aria-live="polite">
            <span class="pk">To</span><span class="pv">${me.email}</span>
            <span class="pk">Subject</span><span class="pv" id="pv-subject"></span>
          </div>
          <div class="actions">
            <button class="btn primary" type="submit">Open in your mail app</button>
            <button class="btn copy" type="button"><span class="copy-lbl">Copy my email</span></button>
          </div>
        </form>
        <div class="orbs">
          <a class="orb" href="${me.linkedin}" ${ext}><b>LinkedIn</b><small>/in/chandranisaha</small></a>
          <a class="orb" href="${me.github}" ${ext}><b>GitHub</b><small>@chandranisaha</small></a>
          ${me.cv ? `<a class="orb" href="${esc(me.cv)}" ${ext}><b>CV</b><small>PDF</small></a>` : '<button class="orb" type="button" data-action="resume"><b>Résumé</b><small>the quick version</small></button>'}
        </div>
        <p class="fine">It is <span data-clock></span> in Hyderabad right now. There are seven secrets on this page, if you are still exploring.</p>
      </article>
    </div>
  </section>`;
}

function nav() {
  return `
  <button class="brand" data-action="top" aria-label="${esc(me.name)}, back to top">
    <span class="brand-name">${esc(me.name)}</span>
    <span class="brand-meta"><i class="live" aria-hidden="true"></i>Hyderabad <span data-clock></span> IST</span>
  </button>
  <nav class="rail" aria-label="Sections">${ORDER.filter(k => NAV[k]).map(k => `<button data-go="${k}">${esc(NAV[k])}</button>`).join('')}<i class="rail-ind" aria-hidden="true"></i></nav>
  <div class="nav-right">
    <button class="pill" id="secrets-btn" aria-expanded="false" aria-controls="secrets-panel" title="Secrets found"><svg class="gem" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0l5 5-5 5-5-5z"/></svg><b>0</b>/7</button>
    <button class="pill" id="sound-btn" aria-pressed="false" title="Sound"><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="lbl">Sound off</span></button>
    <button class="pill kbd" data-action="palette" title="Command palette">Ctrl K</button>
    <button class="pill mode" data-action="resume" title="Plain résumé view"><span class="when-explore">Quick résumé</span><span class="when-resume">Back to the full site</span></button>
  </div>
  <div id="secrets-panel" class="panel" hidden></div>`;
}

function resume() {
  const byKey = Object.fromEntries(chapters.map(c => [c.key, c]));
  const sci = byKey.science.items, work = byKey.lead.items;
  const row = i => `<li><div class="r-head"><strong>${esc(i.title)}</strong><span>${esc(i.meta || '')}</span></div>${i.text ? `<p>${esc(i.text)}</p>` : ''}</li>`;
  return `
  <div class="paper">
    <header>
      <h1>${esc(me.name)}</h1>
      <p>${esc(me.role)} · ${esc(me.location)}</p>
      <p class="r-links"><a href="mailto:${me.email}">${me.email}</a><a href="${me.github}" ${ext}>github.com/chandranisaha</a><a href="${me.linkedin}" ${ext}>linkedin.com/in/chandranisaha</a></p>
      <div class="r-actions"><button class="btn" data-action="print">Print / save as PDF</button><button class="btn" data-action="resume">Back to the full site</button></div>
    </header>
    <section><h2>Education</h2><ul>${[sci[0], sci[4]].map(row).join('')}</ul></section>
    <section><h2>Experience</h2><ul>${work.slice(0, 2).map(row).join('')}</ul></section>
    <section><h2>Projects</h2><ul>${byKey.build.projects.map(p => `<li><div class="r-head"><strong>${esc(p.name)}</strong><span>${esc(p.stack.join(' · '))}</span></div><p>${esc(p.text)}${(p.links || []).map(l => ` <a href="${esc(l.href)}" ${ext}>${esc(l.label)}</a>`).join(' ·')}</p></li>`).join('')}${byKey.build.more.map(m => `<li><div class="r-head"><strong>${m.href ? `<a href="${esc(m.href)}" ${ext}>${esc(m.name)}</a>` : esc(m.name)}</strong><span>${esc(m.stack)}</span></div><p>${esc(m.text)}</p></li>`).join('')}</ul></section>
    <section><h2>Honours and awards</h2><ul>${[sci[1], sci[2], sci[3], work[2]].map(row).join('')}</ul></section>
    <section><h2>Leadership and activities</h2><ul class="r-roles">${byKey.rhythm.roles.map(r => `<li><strong>${esc(r[0])}</strong>, ${esc(r[1])}</li>`).join('')}<li>${esc(work[3].title)}: ${esc(work[3].text)}</li></ul></section>
    <section><h2>Technical skills</h2><ul class="r-roles">${skills.map(s => `<li><strong>${esc(s.label)}:</strong> ${esc(s.items.join(', '))}</li>`).join('')}</ul></section>
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
