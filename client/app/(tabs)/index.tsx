import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Text, ActivityIndicator, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import FormData from 'form-data';
import axios from 'axios';
import Mode from '@/components/Mode';
import TranscribedOutput from '@/components/TranscribeOutput';
import { AndroidAudioEncoder, AndroidOutputFormat, IOSAudioQuality, IOSOutputFormat } from 'expo-av/build/Audio';

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<Audio.Recording[] | []>([])
  const [message, setMessage] = useState<string>("");
  const [transcribedData, setTranscribedData] = useState([] as any);
  const [interimTranscribedData] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedModel, setSelectedModel] = useState(1);
  const [transcribeTimeout, setTranscribeTimeout] = useState(5);
  const [stopTranscriptionSession, setStopTranscriptionSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef: any = useRef(null);
  const stopTranscriptionSessionRef = useRef(stopTranscriptionSession);
  stopTranscriptionSessionRef.current = stopTranscriptionSession;

  const selectedLanguageRef = useRef(selectedLanguage);
  selectedLanguageRef.current = selectedLanguage;

  const selectedModelRef = useRef(selectedModel);
  selectedModelRef.current = selectedModel;

  const supportedLanguages = [
    "english",
    "vietnamese",
  ]

  const modelOptions = ["tiny", "base", "small", "medium", "large"];
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  function handleTranscribeTimeoutChange(newTimeout: any) {
    setTranscribeTimeout(newTimeout);
  }

  async function startRecording() {
    try {
      console.log("Requesting permission..");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        alert("Start recording..");
        const RECORDING_OPTIONS_PRESET_HIGH_QUALITY: any = {
          android: {
            extension: ".m4a",
            outputFormat: AndroidOutputFormat.MPEG_4,
            audioEncoder: AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: ".m4a",
            audioQuality: IOSAudioQuality.MAX,
            outputFormat: IOSOutputFormat.MPEG4AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          }
        };

        try {
          const { recording }: any = await Audio.Recording.createAsync(
            RECORDING_OPTIONS_PRESET_HIGH_QUALITY
          );

          setRecording(recording);
          console.log("succesfully created a recording obj");
          console.log("recording started");
          setStopTranscriptionSession(false);
          setIsRecording(true);
          intervalRef.current = setInterval(
            transcribeInterim,
            transcribeTimeout * 1000
          );

        } catch (err) {
          console.error("failed to create an expo av audio object:", err);
        }
      } else {
        console.error("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error("failed to start recording:", err)
    }
  }

  async function stopRecording() {
    console.log("Stop recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    let updatedRecordings = [...recordings] as any;
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    if (status.isLoaded && 'durationMillis' in status) {
      const duration = getDurationFormatted(status.durationMillis);
      updatedRecordings.push({
        sound: sound,
        duration: duration,
        file: recording.getURI(),
      });
    }

    setRecordings(updatedRecordings);
    console.log("recording stopped and stored at:", uri);

    // Fetch audio binary blob data
    clearInterval(intervalRef.current);
    setStopTranscriptionSession(true);
    setIsRecording(false);
    setIsTranscribing(false);
  };

  function transcribeInterim() {
    clearInterval(intervalRef.current);
    setIsRecording(false);
  }

  async function transcribeRecording() {
    const uri = recording.getURI();
    const filetype = uri.split(".").pop();
    const filename = uri.split("/").pop();
    setIsLoading(true);
    const formData: any = new FormData();
    formData.append("language", selectedLanguageRef.current);
    formData.append("model_size", modelOptions[selectedModelRef.current]);
    formData.append(
      "audio_data",
      {
        uri,
        type: `audio/${filetype}`,
        name: filename,
      },
      "temp_recording"
    );
    axios({
      // url: "https://6144-2601-600-8d82-fd70-ec24-6f53-e7a8-7c4d.ngrok-free.app/transcribe",
      url: "http://localhost:8000",
      method: "POST",
      data: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function(response) {
        console.log("response :", response);
        setTranscribedData((oldData: any) => [...oldData, response.data]);
        setIsLoading(false);
        setIsTranscribing(false);
        intervalRef.current = setInterval(
          transcribeInterim,
          transcribeTimeout * 1000
        );
      })
      .catch(function(error) {
        console.log("error : error");
      });

    if (!stopTranscriptionSessionRef.current) {
      setIsRecording(true);
    }
  }
  function getDurationFormatted(millis: any) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round(minutes - minutesDisplay) * 60;
    const secondDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine: any, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => recordingLine.sound.replayAsync()}>
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>
        </View>
      )
    });
  }
  return (
    <View style={styles.root}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Speech to Text. </Text>
        <Text style={styles.title}>{message}</Text>
      </View>
      <View style={styles.settingsSection}>
        <Mode
          disabled={isTranscribing || isRecording}
          possibleLanguages={supportedLanguages}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          modelOptions={modelOptions}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          transcribeTimeout={transcribeTimeout}
          onTranscribeTimeoutChanged={handleTranscribeTimeoutChange}
        />
      </View>
      <View style={styles.buttonsSection}>
        {!isRecording && !isTranscribing && (
          <Button onPress={startRecording} title="Start recording" />
        )}
        {(isRecording || isTranscribing) && (
          <Button
            onPress={stopRecording}
            disabled={stopTranscriptionSessionRef.current}
            title="stop recording"
          />
        )}
        <Button title="Transcribe" onPress={() => transcribeRecording()} />
        {getRecordingLines()}
      </View>

      {isLoading !== false ? (
        <ActivityIndicator
          size="large"
          color="#00ff00"
          hidesWhenStopped={true}
          animating={true}
        />
      ) : (
        <Text></Text>
      )}

      <View style={styles.transcription}>
        <TranscribedOutput
          transcribedText={transcribedData}
          interimTranscribedText={interimTranscribedData}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
  },
  title: {
    marginTop: 40,
    fontWeight: "400",
    fontSize: 30,
  },
  settingsSection: {
    flex: 1,
  },
  buttonsSection: {
    flex: 1,
    flexDirection: "row",
  },
  transcription: {
    flex: 1,
    flexDirection: "row",
  },
  recordIllustration: {
    width: 100,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

