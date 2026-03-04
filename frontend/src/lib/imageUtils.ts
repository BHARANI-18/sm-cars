/**
 * Compress an image file using the Canvas API before uploading.
 * Resizes to max 1200px on longest side and compresses to 80% quality JPEG.
 */
export async function compressImage(file: File, maxSize = 1200, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
        const img = new window.Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;

            // Scale down if larger than maxSize
            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                } else {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(file); // fallback to original if compression fails
                        return;
                    }
                    const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(compressed);
                },
                'image/jpeg',
                quality
            );
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file); // fallback to original
        };
        img.src = url;
    });
}

/**
 * Compress multiple image files in parallel.
 */
export async function compressImages(files: File[]): Promise<File[]> {
    return Promise.all(files.map(f => compressImage(f)));
}
