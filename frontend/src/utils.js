/**
 * Converts various YouTube URL formats (watch, share, embed, search)
 * into a clean, privacy-enhanced onsite playable embed URL (youtube-nocookie.com)
 */
export function getYouTubeEmbedUrl(url, fallbackQuery = '') {
  if (!url) {
    if (fallbackQuery) {
      return `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(fallbackQuery)}`;
    }
    return null;
  }

  // Already an embed URL
  if (url.includes('/embed/')) {
    return url.replace('youtube.com', 'youtube-nocookie.com');
  }

  // Standard watch URL: youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
  }

  // Short URL: youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
  }

  // Search query fallback
  const searchMatch = url.match(/[?&]search_query=([^&]+)/);
  if (searchMatch) {
    return `https://www.youtube-nocookie.com/embed?listType=search&list=${searchMatch[1]}`;
  }

  return url;
}
