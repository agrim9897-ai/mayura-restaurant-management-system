/**
 * Extracts YouTube Video ID from any valid YouTube URL format.
 * Supports:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - dQw4w9WgXcQ (direct ID)
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Direct 11-char alphanumeric ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Standard watch URL: youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Shortened URL: youtu.be/ID or embed URL: youtube.com/embed/ID or shorts: youtube.com/shorts/ID
  const pathMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed|shorts|v)\/)([a-zA-Z0-9_-]{11})/);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }

  return null;
}
