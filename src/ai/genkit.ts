
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize the AI plugin.
// By passing an empty API key, we signal to Genkit to use the
// ambient authentication provided by the Firebase/Google Cloud environment.
export const ai = genkit({
  plugins: [
    googleAI({ apiKey: '' }),
  ],
  defaultModel: 'googleai/gemini-1.5-flash',
});
