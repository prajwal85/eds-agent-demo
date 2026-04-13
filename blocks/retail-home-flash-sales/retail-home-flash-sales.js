export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // Row 1: Title + Timer info
  const headerRow = rows[0];
  headerRow.classList.add('rh-flash-header');

  // Build countdown timer
  const timer = document.createElement('div');
  timer.classList.add('rh-flash-timer');

  const cells = [
    { num: '03', label: 'Hours' },
    { num: '23', label: 'Minutes' },
    { num: '19', label: 'Seconds' },
  ];

  cells.forEach((cell) => {
    const el = document.createElement('div');
    el.classList.add('rh-flash-timer-cell');
    el.innerHTML = `<span class="rh-flash-timer-num">${cell.num}</span><span class="rh-flash-timer-label">${cell.label}</span>`;
    timer.append(el);
  });

  headerRow.querySelector('div:last-child')?.append(timer);

  // Row 2+: Category buttons
  const catRow = rows[1];
  catRow.classList.add('rh-flash-categories');
  const links = catRow.querySelectorAll('a, p');
  links.forEach((el) => {
    el.classList.add('rh-flash-cat-btn');
  });
}
