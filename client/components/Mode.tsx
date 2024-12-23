import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelct from 'react-native-picker-select';

const Mode = ({
  onModelChange,
  transcribeTimeout,
  onTranscribeTimeoutChanged,
}: any) => {
  function onModelChangeLocal(value: any) {
    onModelChange(value);
  }

  function onTranscribeTimeoutChangedLocal(event: any) {
    onTranscribeTimeoutChanged(event.target.value);
  }
  return (
    <View>
      <Text style={styles.title}>Model Sizer</Text>
      <View style={{ flexDirection: "row" }}>
        <RNPickerSelct
          onValueChange={(value) => onModelChangeLocal(value)}
          useNativeAndroidPickerStyle={false}
          placeholder={{ label: "Select model", value: null }}
          items={[
            { label: "tiny", value: "tiny" },
            { label: "base", value: "base" },
            { label: "small", value: "small" },
            { label: "medium", value: "medium" },
            { label: "large", value: "large" },
          ]}
          style={customPickerStyles}
        />
      </View>
      <View>
        <Text style={styles.title}>Timeout: {transcribeTimeout}</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  title: {
    fontWeight: "200",
    alignSelf: "flex-start",
    fontSize: 25,
  },
});


const customPickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Mode;
