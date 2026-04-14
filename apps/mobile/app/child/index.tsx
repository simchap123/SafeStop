import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

interface Child {
  id: string;
  name: string;
  initial: string;
  color: string;
  active: boolean;
  destinationCount: number;
}

const MOCK_CHILDREN: Child[] = [
  {
    id: "1",
    name: "Emma Johnson",
    initial: "E",
    color: "#6366F1",
    active: true,
    destinationCount: 2,
  },
  {
    id: "2",
    name: "Liam Johnson",
    initial: "L",
    color: "#22C55E",
    active: true,
    destinationCount: 1,
  },
  {
    id: "3",
    name: "Sophie Johnson",
    initial: "S",
    color: "#F59E0B",
    active: false,
    destinationCount: 0,
  },
];

export default function ChildrenListScreen() {
  const router = useRouter();
  const [children] = useState<Child[]>(MOCK_CHILDREN);

  const renderChild = ({ item }: { item: Child }) => (
    <Pressable
      onPress={() => router.push(`/child/${item.id}`)}
      className="bg-dark-800 rounded-2xl p-4 mb-3 flex-row items-center active:opacity-80"
    >
      {/* Avatar */}
      <View
        style={{ backgroundColor: item.color }}
        className="w-14 h-14 rounded-full items-center justify-center mr-4"
      >
        <Text className="text-white text-xl font-bold">{item.initial}</Text>
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-white text-lg font-semibold">{item.name}</Text>
        <View className="flex-row items-center mt-1 gap-3">
          <View
            className={`px-2 py-0.5 rounded-full ${
              item.active ? "bg-safe-500/20" : "bg-dark-700"
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                item.active ? "text-safe-500" : "text-dark-400"
              }`}
            >
              {item.active ? "Active" : "Inactive"}
            </Text>
          </View>
          <Text className="text-dark-400 text-sm">
            {item.destinationCount} destination{item.destinationCount !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* Chevron */}
      <Text className="text-dark-500 text-lg ml-2">&rsaquo;</Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-6">
        <Text className="text-white text-2xl font-bold">Your Children</Text>
        <Pressable
          onPress={() => router.push("/child/add")}
          className="bg-primary-500 px-4 py-2 rounded-xl active:bg-primary-600"
        >
          <Text className="text-white font-semibold text-sm">Add Child</Text>
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={children}
        renderItem={renderChild}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
