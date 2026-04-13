export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('retail-testimonial-card');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      div.className = 'retail-testimonial-content';
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
