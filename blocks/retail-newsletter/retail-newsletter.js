export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;
  row.classList.add('retail-newsletter-inner');
}
