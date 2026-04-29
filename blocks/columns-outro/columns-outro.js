function isVideoUrl(url) {
  if (!url) return false;
  const path = url.split('?')[0];
  return path.endsWith('.mp4') || path.includes('.mp4') || path.includes('/media_');
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-outro-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const link = col.querySelector('a');
      if (link && isVideoUrl(link.href)) {
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

        video.addEventListener('canplay', () => {
          video.play();
        });
        return;
      }

      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-outro-img-col');
        }
      }
    });
  });
}
