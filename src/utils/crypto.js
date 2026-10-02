export async function hashPassword(text) {
  if (!text) return text;
  if (text.length === 64 && /^[0-9a-f]+$/i.test(text)) return text;
  if (!window.crypto || !window.crypto.subtle) {
    console.warn("Web Crypto API tidak tersedia.");
    return text;
  }
  try {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.warn("Hashing failed, fallback to raw", error);
    return text;
  }
}
