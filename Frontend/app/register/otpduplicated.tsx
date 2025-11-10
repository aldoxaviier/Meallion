import { Text, View,TextInput,Pressable, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRef } from "react";

export default function otpduplicated() {
  const inputref = useRef<TextInput>(null);

  const press = () => {
    inputref.current?.focus();
  };
  const blur = () => {
    inputref.current?.blur();
  }
  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
    }}>
    <View
      className="flex flex-col justify-center items-center h-full gap-10"
    >
      <Pressable onPress={blur} className="bg-green-400">
        <Text>Blur Input</Text>
      </Pressable>
      <TextInput placeholder="test" ref={inputref}></TextInput>
      <Pressable onPress={press} className="bg-green-400">
        <Text>Focus Input</Text>
      </Pressable>
    </View>
    </TouchableWithoutFeedback>
  );
}
