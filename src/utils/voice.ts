import { createWriteStream, createReadStream } from 'fs';
import path from 'path';
import { climbingCoachAgent } from '../agents';
import { Readable } from 'stream';

/**
 * Save the agent's speech to a file
 */
export async function saveAgentSpeech(text: string, filename: string, options?: { speaker?: string }): Promise<string> {
  const audio = await climbingCoachAgent.voice.speak(text, {
    speaker: options?.speaker || "onyx" // Default to our confident, professional voice
  });
  
  if (!audio || !(audio instanceof Readable)) {
    throw new Error('Failed to generate audio stream');
  }

  const filePath = path.join(process.cwd(), filename);
  const writer = createWriteStream(filePath);

  audio.pipe(writer);

  await new Promise<void>((resolve, reject) => {
    writer.on('finish', () => resolve());
    writer.on('error', reject);
  });

  return filePath;
}

/**
 * Transcribe audio from a file
 */
export async function transcribeAudioFile(audioFilePath: string, filetype: string = 'm4a'): Promise<string> {
  try {
    console.log('Transcribing audio file...');
    const audioStream = createReadStream(audioFilePath);
    const transcription = await climbingCoachAgent.voice.listen(audioStream, {
      filetype
    });
    
    if (typeof transcription !== 'string') {
      throw new Error('Failed to transcribe audio: Invalid response type');
    }

    return transcription;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

/**
 * Generate speech from text and save it to a file
 */
export async function generateSpeech(text: string, options?: { speaker?: string }): Promise<void> {
  try {
    const filePath = await saveAgentSpeech(text, 'coach-response.mp3', options);
    console.log(`Speech saved to: ${filePath}`);
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

/**
 * Process audio input and get agent's response
 */
export async function processAudioInput(audioFilePath: string, filetype: string = 'm4a'): Promise<void> {
  try {
    // Transcribe the audio
    const transcription = await transcribeAudioFile(audioFilePath, filetype);
    console.log('Transcription:', transcription);

    // Generate agent's response
    const response = await climbingCoachAgent.generate(transcription);
    console.log('Agent response:', response.text);

    // Convert response to speech using our default professional voice
    await generateSpeech(response.text);
  } catch (error) {
    console.error('Error processing audio input:', error);
    throw error;
  }
}

/**
 * Format text for better speech synthesis
 * This helps control pacing and emphasis in the generated speech
 */
export function formatForSpeech(text: string): string {
  return text
    // Add pauses after sentences
    .replace(/\./g, '... ')
    // Add slight pauses after commas
    .replace(/,/g, ', ')
    // Add emphasis to important safety terms
    .replace(/(safety|warning|caution|danger|careful|important)/gi, '... $1 ...')
    // Add pauses around step numbers
    .replace(/(\d+\)|\d+\.)/g, '... $1 ...')
    // Clean up multiple spaces and periods
    .replace(/\s+/g, ' ')
    .replace(/\.{3,}/g, '...')
    .trim();
} 