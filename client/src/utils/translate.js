const translationCache = new Map();

export async function translateText(text, targetLang) {
  if (!text || targetLang === 'en') return text;
  
  const cacheKey = `${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) return text; // fallback on error
    const data = await response.json();
    
    // The Google API returns an array of sentence pieces, we need to join them
    const translated = data[0].map(item => item[0]).join('');
    translationCache.set(cacheKey, translated);
    return translated;
  } catch (err) {
    console.error('Translation error:', err);
    return text;
  }
}
