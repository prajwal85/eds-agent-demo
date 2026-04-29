function applyStickypanels(block) {
  block.classList.add('sticky-panels');

  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('sticky-panels-panel');
    const cols = [...row.children];
    if (cols.length >= 2) {
      cols[0].classList.add('sticky-panels-image');
      cols[1].classList.add('sticky-panels-content');

      cols[1].querySelectorAll('p strong').forEach((stat) => {
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

function isStickypanelContent(block) {
  const row = block.firstElementChild;
  if (!row) return false;
  const cols = [...row.children];
  if (cols.length < 2) return false;
  const hasImage = !!cols[0].querySelector('picture, img');
  const hasStats = !!cols[1].querySelector('p strong');
  const hasCta = !!cols[1].querySelector('a');
  return hasImage && hasStats && hasCta;
}

function applyVideoColumn(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const link = col.querySelector('a');
      if (link && link.href && (link.href.includes('.mp4') || link.href.includes('/media_'))) {
        const video = document.createElement('video');
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('playsinline', '');
        video.muted = true;

        const source = document.createElement('source');
        source.setAttribute('src', link.href);
        source.setAttribute('type', 'video/mp4');
        video.append(source);

        col.textContent = '';
        col.classList.add('columns-outro-video-col');
        col.appendChild(video);

        video.addEventListener('canplay', () => { video.play(); });
      }
    });
  });
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Detect sticky-panels pattern (image + stats + CTA)
  if (isStickypanelContent(block)) {
    applyStickypanels(block);
    return;
  }

  // Handle video links in columns
  applyVideoColumn(block);

  // Setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
