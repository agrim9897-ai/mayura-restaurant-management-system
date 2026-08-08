const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export function validateAndExtractYouTubeUrl(url) {
  if (!url || typeof url !== 'string') {
    return { isValid: false, videoId: null, error: null };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return { isValid: false, videoId: null, error: null };
  }

  if (YOUTUBE_ID_REGEX.test(trimmed)) {
    return { isValid: true, videoId: trimmed, error: null };
  }

  let parsedUrl;
  try {
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

  if (parsedUrl.searchParams.has('v')) {
    const vParam = parsedUrl.searchParams.get('v');
    if (vParam && YOUTUBE_ID_REGEX.test(vParam)) {
      extractedId = vParam;
    }
  }

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
    return { isValid: true, videoId: extractedId, error: null };
  }

  return {
    isValid: false,
    videoId: null,
    error: "Could not extract a valid 11-character YouTube Video ID from this link.",
  };
}

export function extractYouTubeId(url) {
  const result = validateAndExtractYouTubeUrl(url);
  return result.isValid ? result.videoId : null;
}
