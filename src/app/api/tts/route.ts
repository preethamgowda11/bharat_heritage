
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { text, lang } = await request.json();

    if (!text || !lang) {
      return NextResponse.json({ error: 'Text and language are required' }, { status: 400 });
    }

    // Correctly resolve the path to the script within the project structure.
    const scriptPath = path.resolve('./src/lib/fetch-tts.js');

    const ttsProcess = spawn('node', [scriptPath, text, lang]);

    let audioBase64 = '';
    let errorOutput = '';

    for await (const chunk of ttsProcess.stdout) {
      audioBase64 += chunk.toString();
    }

    for await (const chunk of ttsProcess.stderr) {
      errorOutput += chunk.toString();
    }
    
    const exitCode = await new Promise((resolve) => {
        ttsProcess.on('close', resolve);
    });

    if (exitCode !== 0) {
      console.error(`TTS script failed with exit code ${exitCode}:\n${errorOutput}`);
      return NextResponse.json({ error: 'Failed to generate speech from script', details: errorOutput }, { status: 500 });
    }
    
    if (!audioBase64) {
      return NextResponse.json({ error: 'No audio data received from script', details: errorOutput }, { status: 500 });
    }

    return NextResponse.json({ audioBase64 });

  } catch (error) {
    console.error('TTS API route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to process TTS request', details: errorMessage }, { status: 500 });
  }
}
