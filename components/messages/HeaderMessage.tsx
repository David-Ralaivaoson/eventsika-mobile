import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  hasSelectedChat: boolean;
}

export default function HeaderMessages({ hasSelectedChat }: Props) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between bg-indigo-600 px-4 py-3 rounded-b-3xl">
      {hasSelectedChat ? (
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
      ) : (
        <View className="w-8" />
      )}

      <View className="flex-row items-center flex-1 ml-2">
        <Image
          source={{ uri: "https://placekitten.com/100/100" }}
          className="w-9 h-9 rounded-full mr-2"
        />
        <Text className="text-white text-lg font-semibold">
          {hasSelectedChat ? "Nom de l’utilisateur" : "Messages"}
        </Text>
      </View>

      <View className="flex-row items-center">
        <Ionicons name="create-outline" size={20} color="white" className="mx-1" />
        <Ionicons name="settings-outline" size={20} color="white" className="mx-1" />
      </View>
    </View>
  );
}
