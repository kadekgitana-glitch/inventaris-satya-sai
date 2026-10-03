import imageCompression from 'browser-image-compression';

export const cloudinaryConfig = {
  cloudName: "dfag0ee2x",
  uploadPreset: "ml_default",
};

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic'];

async function compressImage(file) {
  if (typeof file === 'string' || !(file instanceof File || file instanceof Blob)) {
    return file; // can't compress non-files
  }
  
  // Skip compression for GIFs as it might break animation
  if (file.type === 'image/gif') return file;

  const options = {
    maxSizeMB: 0.2, // Compress to max 200 KB
    maxWidthOrHeight: 1280, // Resize to max 1280px
    useWebWorker: true,
    fileType: 'image/webp' // Convert everything to webp for better compression
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.warn('Image compression failed:', error);
    return file; // Fallback to original
  }
}

function validateFile(file) {
  if (typeof file === 'string') {
    if (file.startsWith('http')) return { valid: true };
    if (file.startsWith('data:image')) {
      const sizeEstimate = (file.length - file.indexOf(',') - 1) * 0.75;
      if (sizeEstimate > MAX_FILE_SIZE_BYTES) {
        return { valid: false, error: `Ukuran foto terlalu besar (maks ${MAX_FILE_SIZE_MB}MB).` };
      }
      return { valid: true };
    }
    return { valid: false, error: 'Format file tidak dikenali.' };
  }
  if (file instanceof File || file instanceof Blob) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: `Jenis file "${file.type}" tidak diizinkan. Hanya JPG, PNG, WebP, HEIC dan GIF.` };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { valid: false, error: `Ukuran foto terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maks ${MAX_FILE_SIZE_MB}MB.` };
    }
    return { valid: true };
  }
  return { valid: false, error: 'Format file tidak valid.' };
}

export const uploadToCloudinary = async (file) => {
  if (!file) return '';
  if (typeof file === 'string' && file.startsWith('http')) return file;

  const validation = validateFile(file);
  if (!validation.valid) throw new Error(validation.error);

  // Compress the file before uploading to save tons of space!
  const fileToUpload = await compressImage(file);

  const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', fileToUpload);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);

  const response = await fetch(url, { method: 'POST', body: formData });
  const data = await response.json();

  if (data.secure_url) {
    return ensureCloudinaryCompat(data.secure_url);
  }
  throw new Error(data.error?.message || 'Gagal upload foto ke server.');
};

export const ensureCloudinaryCompat = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (url.includes('/f_auto')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
};
