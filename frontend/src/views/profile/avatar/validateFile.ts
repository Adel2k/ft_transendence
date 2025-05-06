export function validateFile(file: File): string | null {
    if (file.size > 3 * 1024 * 1024) {
      return 'File size must not exceed 3 MB.';
    }
  
    if (!file.type.startsWith('image/')) {
      return 'Invalid file type. Please upload an image.';
    }
  
    return null;
}