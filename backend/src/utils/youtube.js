export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  const pathMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed|shorts|v)\/)([a-zA-Z0-9_-]{11})/);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }

  return null;
}
