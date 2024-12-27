import { View, Text } from "react-native"
import { TranscriptionResponse } from "@/hooks/useTranscription";

type TranscribedTextProps = {
  transcribedText: TranscriptionResponse[];
};

export function TranscribedText({ transcribedText }: TranscribedTextProps) {
  return (
    <View>
      {transcribedText.map((item, index) => (
        <Text key={index}>
          {item.text}
        </Text>
      ))}
    </View>
  )

}
