const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;
const TIMEOUT_MS = 8000;

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function translateText(text) {
  // Skip translation for short or clearly-English text to reduce API calls
  if (!text || text.length < 3) {
    return { translatedText: text || '', detectedLanguage: 'en' };
  }

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(url, TIMEOUT_MS);
      const data = await res.json();

      // data[0] is an array of translated segments. We join them.
      let translatedText = '';
      if (data[0] && Array.isArray(data[0])) {
        translatedText = data[0].map(segment => segment[0]).join('');
      }

      const detectedLanguage = data[2]; // e.g. 'hi', 'en', 'as'

      return {
        translatedText: translatedText || text,
        detectedLanguage: detectedLanguage || 'en',
      };
    } catch (err) {
      const isLastAttempt = attempt === MAX_RETRIES - 1;

      if (isLastAttempt) {
        console.error(`Translation API failed after ${MAX_RETRIES} attempts:`, err.cause?.code || err.message);
        return { translatedText: text, detectedLanguage: 'en' }; // Fallback to original
      }

      // Exponential backoff: 500ms, 1000ms, 2000ms...
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      console.warn(`Translation attempt ${attempt + 1} failed (${err.cause?.code || err.message}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Should never reach here, but just in case
  return { translatedText: text, detectedLanguage: 'en' };
}
