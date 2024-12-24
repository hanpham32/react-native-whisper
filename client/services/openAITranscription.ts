// services/transcriptionService.ts
import axios from 'axios';
import FormData from 'form-data';

export async function transcribeAudio(
  fileUri: string,
  language: string,
  modelSize: string
) {
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

  // For dev, keep the URL in an .env file or config
  const response = await axios.post("http://localhost:8000", formData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
