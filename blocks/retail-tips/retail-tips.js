export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.querySelector('picture') || div.querySelector('img')) {
        div.className = 'retail-tips-image';
      } else {
        div.className = 'retail-tips-body';
      }
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
