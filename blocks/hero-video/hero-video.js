// eslint-disable-next-line no-unused-vars
export default function decorate(block) {
  // First row may contain a video link or image — convert to background video
  const firstRow = block.querySelector(':scope > div:first-child');
  if (!firstRow) return;

  const link = firstRow.querySelector('a');
  const img = firstRow.querySelector('img');

  if (link && link.href && link.href.endsWith('.mp4')) {
    // Create background video element
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

    // Use the image as poster if available
    if (img) {
      video.setAttribute('poster', img.src);
    }

    firstRow.textContent = '';
    firstRow.appendChild(video);

    video.addEventListener('canplay', () => {
      video.play();
    });
  }
}
