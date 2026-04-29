function isVideoUrl(url) {
  if (!url) return false;
  const path = url.split('?')[0];
  return path.endsWith('.mp4') || path.includes('.mp4') || path.includes('/media_');
}

export default function decorate(block) {
  const rows = [...block.children];
  const imageRow = rows[0];
  const videoRow = rows[1];
  const link = videoRow?.querySelector('a');
  const img = imageRow?.querySelector('img');

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

    if (img) {
      video.setAttribute('poster', img.src);
    }

    imageRow.textContent = '';
    imageRow.appendChild(video);
    videoRow.remove();

    video.addEventListener('canplay', () => {
      video.play();
    });
  } else if (videoRow) {
    videoRow.remove();
  }
}
