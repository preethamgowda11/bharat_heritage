# **App Name**: Heritage Lens

## Core Features:

- AR Site Tours: Allow users to take virtual tours of historical sites in augmented reality using model-viewer, with graceful fallbacks for low-bandwidth scenarios as described in the prompt.
- Artifact Exploration: Enable users to explore artifacts in AR using model-viewer, viewing them in detail and interacting with them virtually. Support low-poly models and 360 panoramas as fallbacks.
- Accessibility Mode: Provide an accessibility mode with audio narration, text descriptions, font scaling, and high-contrast options to accommodate users with disabilities.
- Firestore Integration: Store site and artifact data, user preferences, and other relevant information in Firestore for persistence and easy retrieval.
- Low Bandwidth Mode: Automatically detect network speed and switch to low-bandwidth mode, using lower resolution images and low-poly models when necessary.
- Historical Narration: Provide historical context and narration via an audio player to provide more details of a specific exhibit. Audio playback will be muted by default unless accessibility mode is enabled.
- Adaptive Content Tool: An AI-powered tool that analyzes user context, such as network speed and accessibility preferences, to adaptively optimize the content. This optimization might include switching to low-poly models, enabling audio narration, or simplifying UI elements to improve the experience of all users.

## Style Guidelines:

- Primary color: Saffron (#FF9933), reminiscent of traditional Indian textiles and art, creating a warm, inviting atmosphere.
- Background color: Very light beige (#F5F5DC), to create a warm, neutral base that complements the primary color.
- Accent color: Deep sky blue (#00BFFF), providing contrast and visual interest, evokes a sense of expansiveness and modernity.
- Headline font: 'Playfair', a modern serif font lending an elegant, high-end feel; body text font: 'PT Sans' a modern but still warm and accessible sans-serif.
- Use clear, recognizable icons inspired by Indian art and architecture, ensuring they are easily understandable and culturally relevant.
- Maintain a clean and intuitive layout, ensuring easy navigation on different screen sizes, using a grid-based design to present heritage sites and artifacts.
- Employ subtle transitions and animations to enhance user engagement and provide feedback during interactions, avoiding distractions or excessive motion.