/** The contact section: one sentence to fill in. The particles spell the topic, or greet whoever types a name. */
export function createConnect({ root, email, reasons, world }) {
  const form = root.querySelector('.compose'), nameEl = form.elements.name, lineEl = form.elements.line;
  const radios = [...root.querySelectorAll('[data-reason]')];
  const copyBtn = root.querySelector('.copy'), copyLbl = root.querySelector('.copy-lbl');
  let reason = reasons.find(r => r.id === 'hello') || reasons[0], timer = 0;

  const fullName = () => nameEl.value.trim().replace(/\s+/g, ' ');
  const firstName = () => fullName().split(' ')[0].replace(/[^\p{L}]/gu, '').slice(0, 12).toLowerCase();
  const subject = () => reason.subject + (fullName() ? `, from ${fullName()}` : '');
  const spell = () => world?.setWord(firstName() ? `hi ${firstName()}` : reason.word);
  const fit = () => { nameEl.style.width = `${Math.max(9, nameEl.value.length + 1)}ch`; };

  function pick(id) {
    reason = reasons.find(r => r.id === id) || reason;
    radios.forEach(b => b.setAttribute('aria-checked', String(b.dataset.reason === reason.id)));
    world?.setWord(reason.word);
  }

  root.querySelector('.reasons').addEventListener('click', e => { const b = e.target.closest('[data-reason]'); if (b) pick(b.dataset.reason); });
  nameEl.addEventListener('input', () => { fit(); clearTimeout(timer); timer = setTimeout(spell, 450); });
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
      copyLbl.textContent = 'Select it'; // clipboard blocked: the address is on screen to select
    }
    setTimeout(() => { copyLbl.textContent = 'Copy'; }, 2200);
  });

  fit();
  pick(reason.id);
  return { pick };
}
