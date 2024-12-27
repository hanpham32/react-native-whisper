// hooks/useTranscription.ts
import { useState, useCallback } from 'react';
import FormData from 'form-data';
import { transcribeAudio } from '@/services/openAITranscription';

export interface TranscriptionResponse {
  text: string;
}

export function useTranscription() {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedData, setTranscribedData] = useState<TranscriptionResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const transcribeRecording = useCallback(
    async (fileUri: string, language: string) => {
      try {
        console.log("At useTranscription hook: transcribing text");
        setIsTranscribing(true);
        setError(null);

        const filetype = fileUri.split(".").pop();
        const filename = fileUri.split("/").pop();
        console.log("filetype: ", filetype);

        const formData = new FormData();
        formData.append("language", language);
        formData.append("audio_data", {
          uri: fileUri,
          type: `audio/${filetype}`,
          name: filename,
        });

        console.log("sending formData to server");
        const response = await transcribeAudio(fileUri, language);
        console.log("received server's response")
        console.log('response:', response);

        setTranscribedData((prev) => [...prev, response]);
      } catch (err) {
        console.error("Transcription failed:", err);
        setError("Transcription failed.");
      } finally {
        setIsTranscribing(false);
      }
    },
    []
  );

  return {
    isTranscribing,
    transcribedData,
    error,
    transcribeRecording,
  };
}
