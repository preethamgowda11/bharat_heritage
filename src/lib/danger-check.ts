// src/lib/danger-check.ts
import { getFunctions, httpsCallable } from 'firebase/functions';

// This function assumes Firebase is initialized elsewhere
export async function runDangerCheck(imageBase64: string) {
  
  if (!imageBase64) {
    throw new Error('Image data is required for danger check.');
  }

  const functions = getFunctions(); // Assumes default region
  // For a specific region: getFunctions(getApp(), 'your-region');
  
  const detectDanger = httpsCallable(functions, 'detectDanger');

  try {
    const result = await detectDanger({ image: imageBase64 });
    return result.data as any; // Cast to 'any' or a more specific type
  } catch (error) {
    console.error('Error calling detectDanger function:', error);
    // You can customize the error message based on the error code
    // For example: if (error.code === 'unauthenticated') { ... }
    throw new Error('Failed to communicate with the danger detection service.');
  }
}
