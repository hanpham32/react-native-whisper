import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
console.log(OPENAI_API_KEY);

const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

export async function getTranscription(uri: string): Promise<string> {
  try {
    // Fetch the file from the given URI
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Convert the response to a Blob
    const blob = await response.blob();

    // Create a File from the Blob
    const file = new File([blob], "audio.m4a", {
      type: "audio/m4a", // Ensure the correct MIME type is set
      lastModified: Date.now(), // Current timestamp as lastModified
    });

    // Send the File to OpenAI's Whisper transcription API
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en",
    });

    console.log(transcription.text);
    return transcription.text;
  } catch (error) {
    console.error("Error during transcription:", error);
    throw error;
  }
}

