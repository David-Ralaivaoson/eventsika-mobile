import HeaderMessages from "@/components/messages/HeaderMessage";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const conversations = [
  {
    id: "1",
    name: "Liva Rakoto",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "Salut ! On se voit demain pour la réunion ?",
    time: "10:45",
  },
  {
    id: "2",
    name: "Sarah Andry",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    lastMessage: "J’ai bien reçu le document, merci !",
    time: "09:12",
  },
  {
    id: "3",
    name: "Toky Hanitra",
    image: "https://randomuser.me/api/portraits/men/18.jpg",
    lastMessage: "Tu viens à l’événement samedi ?",
    time: "Hier",
  },
];

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <HeaderMessages hasSelectedChat={false} />

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        className="flex-1 p-3"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({pathname: '/messages/[id]', params: { id: String(item.id) }})}
            className="flex-row items-center p-3 bg-gray-100 rounded-2xl mb-3"
          >
            <Image
              source={{ uri: item.image }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-gray-800">
                {item.name}
              </Text>
              <Text
                className="text-sm text-gray-500"
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            </View>
            <Text className="text-xs text-gray-400">{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
