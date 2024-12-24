// hooks/useAudioRecorder.ts
import { useState, useRef, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import {
  AndroidOutputFormat,
  AndroidAudioEncoder,
  IOSAudioQuality,
  IOSOutputFormat
} from 'expo-av/build/Audio';

interface RecordingInfo {
  sound: Audio.Sound;
  duration: string;
  file: string | undefined;
}

export function useAudioRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<RecordingInfo[]>([]);
  const [isRecording, setIsRecording] = useState(false);

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

  // Utility function to format audio duration
  const getDurationFormatted = useCallback((millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${secondsDisplay}`;
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      console.log("Requesting permission..");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        throw new Error("Please grant permission to access the microphone.");
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      console.log("Recording started...");
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw error;
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(async () => {
    try {
      console.log("Stopping recording...");
      if (!recording) return;

      setIsRecording(false);
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      if (status.isLoaded && 'durationMillis' in status) {
        const duration = getDurationFormatted(status.durationMillis);
        const newRecording: RecordingInfo = {
          sound,
          duration,
          file: uri,
        };
        setRecordings((prev) => [...prev, newRecording]);
      }
      setRecording(null);
      console.log("Recording stopped. File stored at:", uri);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  }, [recording, getDurationFormatted]);

  return {
    recording,
    isRecording,
    recordings,
    startRecording,
    stopRecording,
  };
}
