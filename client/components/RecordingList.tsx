// components/RecordingList.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RecordingItem {
  sound: any;
  duration: string;
  file: string | undefined;
}

interface RecordingListProps {
  recordings: RecordingItem[];
}

export function RecordingList({ recordings }: RecordingListProps) {
  return (
    <View>
      {recordings.map((recording, index) => (
        <View key={index} style={styles.row}>
          <Text>Duration: {recording.duration}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => recording.sound.replayAsync()}
          >
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginLeft: 16,
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
  },
});
