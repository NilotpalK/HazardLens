export async function translateText(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
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
    console.error("Translation API error:", err);
    return { translatedText: text, detectedLanguage: 'en' }; // Fallback to original
  }
}
