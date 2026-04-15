import React from "react";
import { View, Text, Pressable, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useApp } from "../../lib/store";
import type { Child } from "../../lib/types";

const AVATAR_COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
];

export default function ChildrenListScreen() {
  const router = useRouter();
  const { state } = useApp();
  const children = state.children;

  const renderChild = ({ item, index }: { item: Child; index: number }) => {
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const initial = item.name.trim() ? item.name.trim()[0].toUpperCase() : "?";

    return (
      <Pressable
        onPress={() => router.push(`/child/${item.id}`)}
        className="bg-dark-800 rounded-2xl p-4 mb-3 flex-row items-center active:opacity-80"
      >
        {/* Avatar */}
        <View
          style={{ backgroundColor: color }}
          className="w-14 h-14 rounded-full items-center justify-center mr-4"
        >
          <Text className="text-white text-xl font-bold">{initial}</Text>
        </View>

        {/* Info */}
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold">{item.name}</Text>
          <View className="flex-row items-center mt-1 gap-3">
            <View className="px-2 py-0.5 rounded-full bg-safe-500/20">
              <Text className="text-xs font-medium text-safe-500">
                Active
              </Text>
            </View>
            {item.notes ? (
              <Text className="text-dark-400 text-sm" numberOfLines={1}>
                {item.notes}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Chevron */}
        <Text className="text-dark-500 text-lg ml-2">&rsaquo;</Text>
      </Pressable>
    );
  };

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
