
import { genkit, AIService } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize the AI plugin.
// You can switch to other providers or models by installing
// the appropriate plugin and changing the model name.
export const ai = new AIService({
  plugins: [
    googleAI(),
  ],
  defaultModel: 'googleai/gemini-1.5-flash',
  defaultTool: 'googleai/google-search',
});
