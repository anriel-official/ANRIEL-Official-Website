/* Shared browser-side image optimization. GIF/SVG remain unchanged. */
window.ANRIELImageOptimizer = window.ANRIELImageOptimizer || {
  async optimize(file, kind = 'general') {
    if (!file || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return file;
    const limits = { top: 2200, news: 1800, schedule: 1280, goods: 1400, talent: 2400, weekly: 1800 };
    const qualities = { top: .88, news: .86, schedule: .84, goods: .87, talent: .94, weekly: .87 };
    let bitmap;
    try {
      bitmap = await createImageBitmap(file);
      const max = limits[kind] || 1800;
      const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) return file;
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', qualities[kind] || .88));
      if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file;
      const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
      return new File([blob], name, { type: 'image/webp', lastModified: Date.now() });
    } catch (err) {
      console.warn('WebP optimization skipped:', err);
      return file;
    } finally { if (bitmap && bitmap.close) bitmap.close(); }
  }
};
