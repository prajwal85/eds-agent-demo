export default function decorate(block) {
  const products = [];

  // Parse rows as products
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    const product = {};
    const img = cols[0]?.querySelector('img');
    if (img) {
      product.image = img.src;
      product.alt = img.alt || '';
    }
    if (cols[1]) {
      product.name = cols[1].querySelector('h3, h4')?.textContent?.trim() || '';
      const texts = cols[1].querySelectorAll('p');
      texts.forEach((p) => {
        const text = p.textContent.trim();
        if (text.includes('⭐') || text.includes('/5')) product.rating = text;
        else if (p.querySelector('strong')) {
          product.price = p.querySelector('strong')?.textContent?.trim() || '';
          product.originalPrice = p.querySelector('del')?.textContent?.trim() || '';
          const em = p.querySelector('em');
          product.discount = em ? em.textContent.trim() : '';
        } else if (p.querySelector('em') && !p.querySelector('strong')) {
          product.badge = p.querySelector('em').textContent.trim();
        } else if (text && !product.description) {
          product.description = text;
        }
      });
    }
    if (product.name) products.push(product);
  });

  if (products.length === 0) return;
  block.textContent = '';

  const container = document.createElement('div');
  container.classList.add('rhf-layout');

  const preview = document.createElement('div');
  preview.classList.add('rhf-preview');

  const grid = document.createElement('div');
  grid.classList.add('rhf-grid');

  // Update preview function (defined before usage)
  function updatePreview(product) {
    preview.innerHTML = `
      <div class="rhf-preview-image">
        <div class="rhf-preview-badges">
          <span class="rhf-badge-new">NEW</span>
          ${product.discount ? `<span class="rhf-badge-discount">${product.discount}</span>` : ''}
        </div>
        <img src="${product.image}" alt="${product.alt}">
      </div>
      <div class="rhf-preview-info">
        <h3>${product.name}</h3>
        <p class="rhf-preview-rating">${product.rating || '⭐⭐⭐⭐⭐ 4.5/5'}</p>
        <p class="rhf-preview-desc">${product.description || 'Premium quality product for your everyday beauty routine.'}</p>
        <p class="rhf-preview-price"><strong>${product.price || '$120.00'}</strong>${product.originalPrice ? ` <del>${product.originalPrice}</del>` : ''}</p>
        <div class="rhf-preview-timer">
          <p>Offer expires in:</p>
          <div class="rhf-timer-cells">
            <div class="rhf-timer-cell"><span class="rhf-timer-num">02</span><span class="rhf-timer-lbl">Days</span></div>
            <div class="rhf-timer-cell"><span class="rhf-timer-num">12</span><span class="rhf-timer-lbl">Hours</span></div>
            <div class="rhf-timer-cell"><span class="rhf-timer-num">45</span><span class="rhf-timer-lbl">Minutes</span></div>
          </div>
        </div>
        <div class="rhf-actions">
          <div class="rhf-qty"><button class="rhf-qty-btn rhf-qty-dec" aria-label="Decrease">−</button><span class="rhf-qty-val">1</span><button class="rhf-qty-btn rhf-qty-inc" aria-label="Increase">+</button></div>
          <button class="rhf-wish" aria-label="Wishlist">♡</button>
        </div>
        <a href="#" class="rhf-cta-outline">GET FREE TRY ON</a>
        <a href="#" class="rhf-cta-fill">BUY NOW</a>
      </div>`;

    const qtyVal = preview.querySelector('.rhf-qty-val');
    preview.querySelector('.rhf-qty-dec')?.addEventListener('click', () => {
      const v = parseInt(qtyVal.textContent, 10);
      if (v > 1) qtyVal.textContent = v - 1;
    });
    preview.querySelector('.rhf-qty-inc')?.addEventListener('click', () => {
      const v = parseInt(qtyVal.textContent, 10);
      qtyVal.textContent = v + 1;
    });
    const wish = preview.querySelector('.rhf-wish');
    wish?.addEventListener('click', () => {
      wish.classList.toggle('active');
      wish.textContent = wish.classList.contains('active') ? '♥' : '♡';
    });
  }

  // Build product grid cards
  products.forEach((product, idx) => {
    const card = document.createElement('div');
    card.classList.add('rhf-card');
    if (idx === 0) card.classList.add('active');

    let badge = '';
    if (product.badge) badge = `<span class="rhf-card-badge">${product.badge}</span>`;

    card.innerHTML = `
      <div class="rhf-card-image">${badge}<img src="${product.image}" alt="${product.alt}"></div>
      <div class="rhf-card-info">
        <h4>${product.name}</h4>
        <p class="rhf-card-rating">${product.rating || '⭐⭐⭐⭐⭐ 4.5/5'}</p>
        <p class="rhf-card-price"><strong>${product.price || '$120'}</strong>${product.originalPrice ? ` <del>${product.originalPrice}</del>` : ''}${product.discount ? ` <span class="rhf-card-disc">${product.discount}</span>` : ''}</p>
      </div>`;

    card.addEventListener('click', () => {
      grid.querySelectorAll('.rhf-card').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      updatePreview(product);
    });
    grid.append(card);
  });

  updatePreview(products[0]);
  container.append(preview, grid);
  block.append(container);
}
