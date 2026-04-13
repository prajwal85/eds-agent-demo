export default function decorate(block) {
  const products = [];

  // Parse each row as a product
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    const product = {};

    // First column: image
    const img = cols[0]?.querySelector('img');
    if (img) {
      product.image = img.src;
      product.alt = img.alt || '';
    }

    // Second column: product details
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

  // Build the layout
  const container = document.createElement('div');
  container.classList.add('retail-featured-layout');

  // LEFT: Preview panel
  const preview = document.createElement('div');
  preview.classList.add('retail-featured-preview');

  // RIGHT: Product grid
  const grid = document.createElement('div');
  grid.classList.add('retail-featured-grid');

  // Update preview function
  function updatePreview(product) {
    preview.innerHTML = `
      <div class="retail-featured-preview-image">
        <div class="retail-featured-preview-badges">
          <span class="retail-featured-preview-badge-new">NEW</span>
          ${product.discount ? `<span class="retail-featured-preview-badge-discount">${product.discount}</span>` : ''}
        </div>
        <img src="${product.image}" alt="${product.alt}">
      </div>
      <div class="retail-featured-preview-info">
        <h3>${product.name}</h3>
        <p class="retail-featured-preview-rating">${product.rating || '⭐⭐⭐⭐⭐ 4.5/5'}</p>
        <p class="retail-featured-preview-desc">${product.description || 'Buy one or buy a few and make every space where you sit more convenient. Light and easy to move around with removable tray top, handy for serving snacks.'}</p>
        <p class="retail-featured-preview-price">
          <strong>${product.price || '$120.00'}</strong>
          ${product.originalPrice ? `<del>${product.originalPrice}</del>` : ''}
        </p>
        <div class="retail-featured-preview-timer">
          <p>Offer expires in:</p>
          <div class="retail-featured-timer-cells">
            <div class="retail-featured-timer-cell"><span class="retail-featured-timer-num">02</span><span class="retail-featured-timer-label">Days</span></div>
            <div class="retail-featured-timer-cell"><span class="retail-featured-timer-num">12</span><span class="retail-featured-timer-label">Hours</span></div>
            <div class="retail-featured-timer-cell"><span class="retail-featured-timer-num">45</span><span class="retail-featured-timer-label">Minutes</span></div>
          </div>
        </div>
        <div class="retail-featured-preview-actions">
          <div class="retail-featured-qty">
            <button class="retail-featured-qty-btn" aria-label="Decrease">−</button>
            <span class="retail-featured-qty-val">1</span>
            <button class="retail-featured-qty-btn" aria-label="Increase">+</button>
          </div>
          <button class="retail-featured-wishlist" aria-label="Add to wishlist">♡</button>
        </div>
        <a href="#" class="retail-featured-cta-try">GET FREE TRY ON</a>
        <a href="#" class="retail-featured-cta-buy">BUY NOW</a>
      </div>
    `;

    // Quantity buttons
    const qtyVal = preview.querySelector('.retail-featured-qty-val');
    const btns = preview.querySelectorAll('.retail-featured-qty-btn');
    btns[0]?.addEventListener('click', () => {
      const val = parseInt(qtyVal.textContent, 10);
      if (val > 1) qtyVal.textContent = val - 1;
    });
    btns[1]?.addEventListener('click', () => {
      const val = parseInt(qtyVal.textContent, 10);
      qtyVal.textContent = val + 1;
    });

    // Wishlist toggle
    const wishBtn = preview.querySelector('.retail-featured-wishlist');
    wishBtn?.addEventListener('click', () => {
      wishBtn.classList.toggle('active');
      wishBtn.textContent = wishBtn.classList.contains('active') ? '♥' : '♡';
    });
  }

  // Build product cards for the grid
  products.forEach((product, idx) => {
    const card = document.createElement('div');
    card.classList.add('retail-featured-card');
    if (idx === 0) card.classList.add('active');
    card.dataset.index = idx;

    let badgeHtml = '';
    if (product.badge) {
      badgeHtml = `<span class="retail-featured-badge">${product.badge}</span>`;
    }

    card.innerHTML = `
      <div class="retail-featured-card-image">
        ${badgeHtml}
        <img src="${product.image}" alt="${product.alt}">
      </div>
      <div class="retail-featured-card-info">
        <h4>${product.name}</h4>
        <p class="retail-featured-card-rating">${product.rating || '⭐⭐⭐⭐⭐ 4.5/5'}</p>
        <p class="retail-featured-card-price">
          <strong>${product.price || '$120'}</strong>
          ${product.originalPrice ? `<del>${product.originalPrice}</del>` : ''}
          ${product.discount ? `<span class="retail-featured-card-discount">${product.discount}</span>` : ''}
        </p>
      </div>
    `;

    card.addEventListener('click', () => {
      grid.querySelectorAll('.retail-featured-card').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      updatePreview(product);
    });

    grid.append(card);
  });

  // Initialize with first product
  updatePreview(products[0]);

  container.append(preview, grid);
  block.append(container);
}
