import { View, Text } from "react-native"

type TranscribedTextProps = {
  transcribedText: string;
};

export function TranscribedText({ transcribedText }: TranscribedTextProps) {
  return (
    <View>
      <Text>
        {transcribedText}
      </Text>
    </View>
  )

}
