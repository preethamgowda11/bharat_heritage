
import { NextRequest, NextResponse } from 'next/server';
import * as googleTTS from 'google-tts-api';

const ANUVADINI_URL = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
const ANUVADINI_USER_ID = "00000000-0000-0000-0000-000000000000";
const ANUVADINI_API_KEY = "0000000000-0000-0000-0000-000000000000";

async function handleAnuvadiniRequest(text: string, lang: string) {
  const payload = {
    "pipelineTasks": [
        {
            "taskType": "tts",
            "config": {
                "language": {
                    "sourceLanguage": lang
                },
                "serviceId": "ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4",
                "gender": "female",
                "samplingRate": 22050
            }
        }
    ],
    "inputData": {
        "input": [
            {
                "source": text
            }
        ]
    }
  };

  const response = await fetch(ANUVADINI_URL, {
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': ANUVADINI_API_KEY,
        'Content-Type': 'application/json',
        'ulca-origin-id': 'bhashini-web-translator',
        'User-ID': ANUVADINI_USER_ID,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Anuvadini AI service error:', errorBody);
    throw new Error(`Anuvadini AI service failed with status ${response.status}`);
  }

  const result = await response.json();
  const audioBase64 = result?.pipelineResponse?.[0]?.audio?.[0]?.audioContent;

  if (!audioBase64) {
    throw new Error('Invalid audio content in Anuvadini response');
  }

  return `data:audio/mp3;base64,${audioBase64}`;
}


async function handleGoogleTTSRequest(text: string, lang: string) {
    const audioBase64 = await googleTTS.getAudioBase64(text, {
        lang: lang,
        slow: false,
    });
    return `data:audio/mp3;base64,${audioBase64}`;
}

export async function POST(req: NextRequest) {
  try {
    const { text, lang } = await req.json();

    if (!text || !lang) {
      return NextResponse.json({ error: 'Missing text or lang parameter' }, { status: 400 });
    }

    let audioDataUrl: string;

    if (lang === 'or') {
      // Use Anuvadini for Odia
      audioDataUrl = await handleAnuvadiniRequest(text, lang);
    } else {
      // Use Google TTS for other languages
      audioDataUrl = await handleGoogleTTSRequest(text, lang);
    }
    
    return NextResponse.json({ audioDataUrl });

  } catch (error: any) {
    console.error('TTS API Error:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
