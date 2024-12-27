// services/transcriptionService.ts
import axios from 'axios';
import FormData from 'form-data';

export async function transcribeAudio(
  fileUri: string,
  language: string,
) {
  const filetype = fileUri.split(".").pop();
  const filename = fileUri.split("/").pop();

  const formData = new FormData();
  formData.append("language", language);
  formData.append("audio_data", {
    uri: fileUri,
    type: `audio/${filetype}`,
    name: filename,
  });
  console.log('formData:', formData);

  // For dev, keep the URL in an .env file or config
  console.log('sending POST request to server');
  const response = await axios.post("https://6144-2601-600-8d82-fd70-ec24-6f53-e7a8-7c4d.ngrok-free.app/transcribe", formData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
