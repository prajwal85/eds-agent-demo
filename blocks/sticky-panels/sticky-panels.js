export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('sticky-panels-panel');
    const cols = [...row.children];
    if (cols.length >= 2) {
      cols[0].classList.add('sticky-panels-image');
      cols[1].classList.add('sticky-panels-content');

      const stats = cols[1].querySelectorAll('p strong');
      stats.forEach((stat) => {
        const p = stat.closest('p');
        if (p) p.classList.add('sticky-panels-stat');
      });

      const link = cols[1].querySelector('a');
      if (link) link.classList.add('sticky-panels-cta');
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sticky-panels-visible');
      }
    });
  }, { threshold: 0.3 });

  block.querySelectorAll('.sticky-panels-stat, .sticky-panels-content h2').forEach((el) => {
    observer.observe(el);
  });
}
