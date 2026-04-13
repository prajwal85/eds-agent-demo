export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const row = rows[0];
  const cols = [...row.children];

  if (cols.length >= 2) {
    cols[0].classList.add('retail-product-image');
    cols[1].classList.add('retail-product-info');

    // Find price elements - look for strikethrough text
    cols[1].querySelectorAll('del, s').forEach((el) => {
      el.classList.add('retail-product-original-price');
    });

    // Style CTA buttons
    const links = cols[1].querySelectorAll('a');
    links.forEach((a, idx) => {
      if (idx === 0) a.classList.add('retail-product-try');
      else a.classList.add('retail-product-buy');
    });
  }
}
