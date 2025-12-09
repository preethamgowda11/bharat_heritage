const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

// It's recommended to set this in your Firebase config:
// firebase functions:config:set ml.url="https://YOUR_CLOUD_RUN_URL"
const ML_URL = functions.config().ml ? functions.config().ml.url : null;

exports.detectDanger = functions.runWith({ memory: '1GB', timeoutSeconds: 60 }).https.onCall(async (data, context) => {
  if (!ML_URL) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The ML service URL is not configured. Please set the 'ml.url' environment variable."
    );
  }

  const { image } = data || {};
  if (!image) {
    throw new functions.https.HttpsError('invalid-argument', 'No image data was provided for analysis.');
  }

  try {
    const response = await fetch(`${ML_URL}/infer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }), // Forward the base64 image string
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`ML service returned an error (${response.status}):`, errorBody);
        throw new functions.https.HttpsError('internal', `The ML model failed to process the image. Status: ${response.status}`);
    }

    const modelResult = await response.json();

    // Optionally log the request and result to Firestore for monitoring
    try {
        const logData = {
            userId: context.auth ? context.auth.uid : 'anonymous',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            modelResult: modelResult || null,
            // Avoid logging the full image data to save space
            imageProvided: true 
        };
        await admin.firestore().collection('danger_checks').add(logData);
    } catch (e) {
        console.warn('Firestore logging failed:', e);
    }

    return { ok: true, result: modelResult };

  } catch (err) {
    console.error('Error calling ML service:', err);
    if (err instanceof functions.https.HttpsError) {
      throw err; // Re-throw HttpsError
    }
    throw new functions.https.HttpsError('internal', 'An unexpected error occurred while trying to analyze the image.');
  }
});
