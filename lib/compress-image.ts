const MAX_WIDTH = 1200;
const JPEG_QUALITY = 0.82;
const SKIP_BELOW_BYTES = 280_000;

/** Resize and compress payment screenshots before upload. */
export async function compressPaymentScreenshot(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }

  if (file.size < SKIP_BELOW_BYTES && file.type === 'image/jpeg') {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Could not process image.');
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('Could not compress image.'))),
      'image/jpeg',
      JPEG_QUALITY,
    );
  });

  const base = file.name.replace(/\.[^.]+$/, '') || 'payment';
  return new File([blob], `${base}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
}
