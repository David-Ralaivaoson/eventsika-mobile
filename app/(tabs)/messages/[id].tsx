
import HeaderMessages from "@/components/messages/HeaderMessage";
import MessageInput from "@/components/messages/MessageInput";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

const fakeMessages : Record<string, { id: string; content: string; isMine: boolean }[]> = {
  "1": [
    { id: "m1", content: "Salut !", isMine: false },
    { id: "m2", content: "Salut Liva, ça va ?", isMine: true },
    { id: "m3", content: "Oui très bien et toi ?", isMine: false },
  ],
  "2": [
    { id: "m1", content: "Tu as vu le rapport ?", isMine: false },
    { id: "m2", content: "Oui, je le lis maintenant !", isMine: true },
  ],
  "3": [
    { id: "m1", content: "On se retrouve samedi ?", isMine: false },
    { id: "m2", content: "Oui avec plaisir 😄", isMine: true },
  ],
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (id && fakeMessages[id]) {
      setMessages(fakeMessages[id]);
    }
  }, [id]);

  return (
    <View className="flex-1 bg-white">
      <HeaderMessages hasSelectedChat={true} />

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`max-w-[75%] px-4 py-2 rounded-2xl my-1 ${
              item.isMine
                ? "self-end bg-indigo-600"
                : "self-start bg-gray-200"
            }`}
          >
            <Text
              className={`text-sm ${
                item.isMine ? "text-white" : "text-gray-800"
              }`}
            >
              {item.content}
            </Text>
          </View>
        )}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
          padding: 12,
        }}
      />

      <MessageInput
        onSend={(msg) =>
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), content: msg, isMine: true },
          ])
        }
      />
    </View>
  );
}
