/**
 * Strict YouTube URL Validation & Sanitization Utility.
 * Validates official YouTube domains (youtube.com, youtu.be) and extracts 11-character video IDs.
 */

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Validates a YouTube URL or Video ID string.
 * @param {string} url 
 * @returns {{ isValid: boolean, videoId: string | null, error: string | null }}
 */
export function validateAndExtractYouTubeUrl(url) {
  if (!url || typeof url !== 'string') {
    return { isValid: false, videoId: null, error: null };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return { isValid: false, videoId: null, error: null };
  }

  // 1. Direct 11-character Video ID
  if (YOUTUBE_ID_REGEX.test(trimmed)) {
    return { isValid: true, videoId: trimmed, error: null };
  }

  // 2. Validate URL structure
  let parsedUrl;
  try {
    // Add protocol if missing for URL parser
    const urlToParse = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsedUrl = new URL(urlToParse);
  } catch {
    return {
      isValid: false,
      videoId: null,
      error: "Invalid URL format. Please paste a valid YouTube link.",
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const validDomains = [
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtu.be',
    'www.youtu.be',
    'youtube-nocookie.com',
    'www.youtube-nocookie.com',
  ];

  const isValidDomain = validDomains.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );

  if (!isValidDomain) {
    return {
      isValid: false,
      videoId: null,
      error: "Only official YouTube links (youtube.com or youtu.be) are supported.",
    };
  }

  let extractedId = null;

  // Watch URL: youtube.com/watch?v=VIDEO_ID
  if (parsedUrl.searchParams.has('v')) {
    const vParam = parsedUrl.searchParams.get('v');
    if (vParam && YOUTUBE_ID_REGEX.test(vParam)) {
      extractedId = vParam;
    }
  }

  // Shortened URL / Embed / Shorts: youtu.be/VIDEO_ID, youtube.com/embed/VIDEO_ID, youtube.com/shorts/VIDEO_ID
  if (!extractedId) {
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      if (YOUTUBE_ID_REGEX.test(lastPart)) {
        extractedId = lastPart;
      }
    }
  }

  if (extractedId && YOUTUBE_ID_REGEX.test(extractedId)) {
    const isShorts = parsedUrl ? parsedUrl.pathname.includes('/shorts/') : false;
    return {
      isValid: true,
      videoId: extractedId,
      isShorts,
      suggestedRatio: isShorts ? '9:16' : '16:9',
      error: null,
    };
  }

  return {
    isValid: false,
    videoId: null,
    isShorts: false,
    suggestedRatio: '16:9',
    error: "Could not extract a valid 11-character YouTube Video ID from this link.",
  };
}

/**
 * Backwards compatible helper returning video ID or null.
 */
export function extractYouTubeId(url) {
  const result = validateAndExtractYouTubeUrl(url);
  return result.isValid ? result.videoId : null;
}

/**
 * Returns a sanitized, safe YouTube embed URL for use in <iframe> src attributes.
 * Prevents arbitrary URL injection or XSS.
 * @param {string} input - YouTube URL or Video ID
 * @returns {string | null}
 */
export function getSafeYouTubeEmbedUrl(input) {
  const videoId = extractYouTubeId(input);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`;
}
