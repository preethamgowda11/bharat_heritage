
import { NextRequest, NextResponse } from 'next/server';
import * as googleTTS from 'google-tts-api';
import OpenAI from 'openai';
import https from 'https';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';

const execPromise = util.promisify(exec);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '', // Ensure API key is set in .env
    timeout: 3000, // 3 seconds timeout for fast fallback
    maxRetries: 2,
});

// Helper to fetch audio using native https module to bypass Next.js fetch patches
function fetchAudioWithHttps(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'curl/7.64.1', // Mimic curl
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to fetch audio: ${res.statusCode} ${res.statusMessage}`));
                return;
            }
            const chunks: Buffer[] = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const base64 = buffer.toString('base64');
                resolve(`data:audio/mp3;base64,${base64}`);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

export async function POST(req: NextRequest) {
    let targetLang = 'en';
    let text = '';

    try {
        const body = await req.json();
        text = body.text;
        const lang = body.lang;

        if (!text || !lang) {
            return NextResponse.json({ error: 'Missing text or lang' }, { status: 400 });
        }

        // OpenAI TTS for Odia with a fallback
        if (lang === 'or') {
            try {
                if (!process.env.OPENAI_API_KEY) {
                    throw new Error("OpenAI API key is missing, attempting fallback.");
                }
                const audio = await openai.audio.speech.create({
                    model: "tts-1",
                    voice: "alloy",
                    input: text,
                    response_format: "mp3"
                });
                const buffer = Buffer.from(await audio.arrayBuffer());
                const base64 = buffer.toString("base64");
                return NextResponse.json({
                    results: [{ url: `data:audio/mp3;base64,${base64}`, shortText: text }]
                });
            } catch (openaiError: any) {
                console.error("OpenAI TTS Error:", openaiError.message);
                // Fallback to Google TTS via child process for Odia
                const scriptPath = path.join(process.cwd(), 'src', 'lib', 'fetch-tts.js');
                try {
                    const { stdout, stderr } = await execPromise(`node "${scriptPath}" "${text}" "or"`);
                    if (stderr) console.error("Child process stderr:", stderr);
                    const base64 = stdout.trim();
                    if (!base64) throw new Error("No output from TTS script");
                    return NextResponse.json({
                        results: [{ url: `data:audio/mp3;base64,${base64}`, shortText: text }]
                    });
                } catch (childError: any) {
                    console.error("Fallback TTS Error:", childError.message);
                    throw new Error(`Fallback TTS failed: ${childError.message}`);
                }
            }
        }

        // Standard Google TTS for other languages
        const langMap: Record<string, string> = { 'en': 'en', 'hi': 'hi', 'kn': 'kn' };
        targetLang = langMap[lang] || 'en';

        const results = googleTTS.getAllAudioUrls(text, {
            lang: targetLang,
            slow: false,
            host: 'https://translate.google.com',
        });
        
        const audioResults = await Promise.all(results.map(async (r) => {
            const client = 'tw-ob'; // tw-ob is generally more reliable
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(r.shortText)}&tl=${targetLang}&client=${client}`;
            try {
                const dataUri = await fetchAudioWithHttps(url);
                return { url: dataUri, shortText: r.shortText };
            } catch (error: any) {
                console.error(`Google TTS Fetch Error for ${lang}:`, error.message);
                throw new Error(`Failed to fetch audio from ${url}: ${error.message}`);
            }
        }));

        return NextResponse.json({ results: audioResults });

    } catch (error: any) {
        console.error('TTS API Error Details:', {
            message: error.message,
            stack: error.stack,
            lang: targetLang,
            textLength: text?.length
        });

        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
