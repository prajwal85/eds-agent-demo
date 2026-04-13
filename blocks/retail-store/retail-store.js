export default function decorate(block) {
  // Build card list
  const ul = document.createElement('ul');
  ul.classList.add('retail-store-track');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('retail-store-card');
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) {
        div.className = 'retail-store-card-image';
      } else {
        div.className = 'retail-store-card-body';
      }
    });

    // Style action links as buttons
    li.querySelectorAll('a').forEach((a) => {
      a.classList.add('retail-store-cart-btn');
    });

    ul.append(li);
  });

  block.textContent = '';

  // Create navigation arrows
  const nav = document.createElement('div');
  nav.classList.add('retail-store-nav');

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('retail-store-prev');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '&#8249;';

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('retail-store-next');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '&#8250;';

  nav.append(prevBtn, nextBtn);

  // Create scroll container
  const scrollContainer = document.createElement('div');
  scrollContainer.classList.add('retail-store-scroll');
  scrollContainer.append(ul);

  block.append(scrollContainer, nav);

  // Navigation logic
  const scrollAmount = 340;

  prevBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Update arrow visibility on scroll
  function updateArrows() {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    prevBtn.style.opacity = scrollLeft <= 0 ? '0.3' : '1';
    nextBtn.style.opacity = scrollLeft + clientWidth >= scrollWidth - 2 ? '0.3' : '1';
  }

  scrollContainer.addEventListener('scroll', updateArrows);
  updateArrows();
}
