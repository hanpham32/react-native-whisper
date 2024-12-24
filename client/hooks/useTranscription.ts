// hooks/useTranscription.ts
import { useState, useCallback } from 'react';
import axios from 'axios';
import FormData from 'form-data';
import { transcribeAudio } from '@/services/openAITranscription';

interface TranscriptionResponse {
  text: string;
  // shape this to match the actual API response
}

export function useTranscription() {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedData, setTranscribedData] = useState<TranscriptionResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const transcribeRecording = useCallback(
    async (fileUri: string, language: string, modelSize: string) => {
      try {
        setIsTranscribing(true);
        setError(null);

        const filetype = fileUri.split(".").pop();
        const filename = fileUri.split("/").pop();

        const formData = new FormData();
        formData.append("language", language);
        formData.append("model_size", modelSize);
        formData.append("audio_data", {
          uri: fileUri,
          type: `audio/${filetype}`,
          name: filename,
        });

        const response = await transcribeAudio(fileUri, language, modelSize);

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
