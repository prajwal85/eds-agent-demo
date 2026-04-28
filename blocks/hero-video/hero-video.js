export default function decorate(block) {
  const rows = [...block.children];
  // Row 0: poster image, Row 1: video link, Row 2: headline text
  const imageRow = rows[0];
  const videoRow = rows[1];
  const textRow = rows[2];

  // Check for video link in video row
  const link = videoRow?.querySelector('a');
  const img = imageRow?.querySelector('img');

  if (link && link.href && link.href.endsWith('.mp4')) {
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

    // Replace both image and video rows with the video element
    imageRow.textContent = '';
    imageRow.appendChild(video);
    videoRow.remove();

    video.addEventListener('canplay', () => {
      video.play();
    });
  } else if (videoRow) {
    // No video — merge video row into image row
    videoRow.remove();
  }
}
