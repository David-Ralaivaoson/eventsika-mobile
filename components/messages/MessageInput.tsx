import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  onSend: (msg: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <View className="flex-row items-center p-3 border-t border-gray-200 bg-white">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Écrire un message..."
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-base text-gray-800"
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity
        onPress={handleSend}
        className="ml-2 bg-indigo-600 p-3 rounded-full"
      >
        <Ionicons name="send" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
}
