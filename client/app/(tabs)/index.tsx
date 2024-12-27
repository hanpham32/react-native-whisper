// App.tsx
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useTranscription } from '@/hooks/useTranscription';
import Mode from '@/components/Mode';
import { TranscribedText } from '@/components/TranscribedOutput';
import { RecordingList } from '@/components/RecordingList';

export default function App() {
  // Set up audio recorder
  const {
    recording,
    isRecording,
    recordings,
    startRecording,
    stopRecording
  } = useAudioRecorder();

  // set up audio transcriber
  const {
    isTranscribing,
    transcribedData,
    error,
    transcribeRecording
  } = useTranscription();

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedModel, setSelectedModel] = useState(1);
  const [transcribeTimeout, setTranscribeTimeout] = useState(5);
  const [stopTranscriptionSession, setStopTranscriptionSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const modelOptions = ["tiny", "base", "small", "medium", "large"];

  const handleTranscribe = async () => {
    console.log("pressed trascribe button");
    console.log(recording);
    if (!recording) return;
    setIsLoading(true);

    try {
      // The file URI is in `recording.getURI()`
      const fileUri = recording.getURI();
      console.log("At handleTranscribe:", fileUri);
      if (!fileUri) return;

      await transcribeRecording(
        fileUri,
        selectedLanguage,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Speech to Text</Text>

      <View style={styles.settingsSection}>
        <Mode
          disabled={isTranscribing || isRecording}
          possibleLanguages={["en", "vi"]}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          modelOptions={modelOptions}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          transcribeTimeout={transcribeTimeout}
          onTranscribeTimeoutChanged={setTranscribeTimeout}
        />
      </View>

      <View style={styles.buttonsSection}>
        {!isRecording && !isTranscribing && (
          <Button onPress={startRecording} title="Start recording" />
        )}
        {(isRecording || isTranscribing) && (
          <Button
            onPress={stopRecording}
            disabled={stopTranscriptionSession}
            title="Stop recording"
          />
        )}
        <Button title="Transcribe" onPress={handleTranscribe} />
      </View>

      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#00ff00"
          animating={true}
        />
      )}

      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <TranscribedText transcribedText={transcribedData} />

      <RecordingList recordings={recordings} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    marginTop: 40,
    fontWeight: "400",
    fontSize: 30,
  },
  settingsSection: {
    marginVertical: 20,
  },
  buttonsSection: {
    flexDirection: "row",
    marginVertical: 10,
  },
  transcription: {
    flex: 1,
    marginTop: 20,
  },
});
