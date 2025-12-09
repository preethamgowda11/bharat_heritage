
import { NextRequest, NextResponse } from 'next/server';
import * as googleTTS from 'google-tts-api';

const ANUVADINI_API_URL = 'https://pre-alpha.anuvadini.ai4bharat.org/v0/translate_speech';

async function getAnuvadiniAudio(text: string, lang: 'kn' | 'or'): Promise<string | null> {
    try {
        const payload = {
            "inputText": text,
            "gender": "female"
        };

        const response = await fetch(`${ANUVADINI_API_URL}?source_language=${lang}&target_language=${lang}`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': 'ANUVADINI_API_KEY', // Placeholder, should be in env
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Anuvadini AI service failed with status ${response.status}:`, errorBody);
            return null;
        }

        const result = await response.json();
        
        if (result?.pipelineResponse?.pipelineResponse?.[0]?.audio?.[0]?.audioContent) {
            return result.pipelineResponse.pipelineResponse[0].audio[0].audioContent;
        } else {
            console.error('Anuvadini response did not contain expected audio data:', JSON.stringify(result, null, 2));
            return null;
        }

    } catch (error) {
        console.error('Error calling Anuvadini AI service:', error);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const { text, lang } = await req.json();

        if (!text || !lang) {
            return NextResponse.json({ error: 'Missing text or lang' }, { status: 400 });
        }

        let audioBase64: string | null = null;

        if (lang === 'or' || lang === 'kn') {
             audioBase64 = await getAnuvadiniAudio(text, lang);
        } else {
            audioBase64 = await googleTTS.getAudioBase64(text, { lang, slow: false });
        }

        if (!audioBase64) {
            return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
        }
        
        const dataUrl = `data:audio/mp3;base64,${audioBase64}`;
        return NextResponse.json({ media: dataUrl });

    } catch (error: any) {
        console.error('TTS API Error:', error);
        return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
    }
}
