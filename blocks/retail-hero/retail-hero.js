export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  block.classList.add('retail-hero-container');

  // First row: main hero with image + text
  const mainRow = rows[0];
  const cols = [...mainRow.children];
  if (cols.length >= 2) {
    cols[0].classList.add('retail-hero-image');
    cols[1].classList.add('retail-hero-content');

    // Style CTA buttons
    cols[1].querySelectorAll('a').forEach((a) => {
      a.classList.add('retail-hero-cta');
    });
  }

  // Second row (if exists): secondary hero panels
  if (rows.length >= 2) {
    const secondRow = rows[1];
    secondRow.classList.add('retail-hero-secondary');
    [...secondRow.children].forEach((col) => {
      col.classList.add('retail-hero-panel');
    });
  }
}
