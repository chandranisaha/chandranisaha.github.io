/** The contact section: pick a reason, the particles spell it; type a name, they greet it; the email drafts itself. */
export function createConnect({ root, email, reasons, world, calm }) {
  const form = root.querySelector('.compose'), nameEl = form.elements.name, lineEl = form.elements.line;
  const subjEl = root.querySelector('#pv-subject'), radios = [...root.querySelectorAll('[data-reason]')];
  const copyBtn = root.querySelector('.copy'), copyLbl = root.querySelector('.copy-lbl');
  let reason = reasons[0], timer = 0;

  const fullName = () => nameEl.value.trim().replace(/\s+/g, ' ');
  const firstName = () => fullName().split(' ')[0].replace(/[^\p{L}]/gu, '').slice(0, 12).toLowerCase();
  const subject = () => reason.subject + (fullName() ? `, from ${fullName()}` : '');
  const spell = () => world?.setWord(firstName() ? `hi ${firstName()}` : reason.word);

  function pick(id) {
    reason = reasons.find(r => r.id === id) || reason;
    radios.forEach(b => b.setAttribute('aria-checked', String(b.dataset.reason === reason.id)));
    subjEl.textContent = subject();
    world?.setWord(reason.word);
  }

  root.querySelector('.reasons').addEventListener('click', e => { const b = e.target.closest('[data-reason]'); if (b) pick(b.dataset.reason); });
  nameEl.addEventListener('input', () => {
    subjEl.textContent = subject();
    clearTimeout(timer); timer = setTimeout(spell, 450);
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const body = [lineEl.value.trim(), fullName()].filter(Boolean).join('\n\n');
    location.href = `mailto:${email}?subject=${encodeURIComponent(subject())}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      copyLbl.textContent = 'Copied';
      world?.kick(2.6);
    } catch {
      copyLbl.textContent = email; // clipboard blocked: show it so it can be selected
    }
    setTimeout(() => { copyLbl.textContent = 'Copy my email'; }, 2200);
  });

  // The three link tiles lean toward the cursor.
  const orbs = [...root.querySelectorAll('.orb')], wrap = root.querySelector('.orbs');
  if (!calm && matchMedia('(pointer: fine)').matches) {
    wrap.addEventListener('pointermove', e => {
      for (const o of orbs) {
        const r = o.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const pull = Math.max(0, 1 - Math.hypot(dx, dy) / 190);
        o.style.transform = `translate(${(dx * 0.16 * pull).toFixed(1)}px, ${(dy * 0.22 * pull).toFixed(1)}px) scale(${(1 + pull * 0.04).toFixed(3)})`;
      }
    });
    wrap.addEventListener('pointerleave', () => orbs.forEach(o => { o.style.transform = ''; }));
  }

  pick(reason.id);
  return { pick };
}
