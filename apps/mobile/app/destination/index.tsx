import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useApp } from "../../lib/store";
import type { Destination } from "../../lib/types";

export default function DestinationsListScreen() {
  const router = useRouter();
  const { state } = useApp();
  const destinations = state.destinations;

  const renderDestination = ({ item }: { item: Destination }) => (
    <Pressable
      onPress={() => router.push(`/destination/${item.id}`)}
      className="bg-dark-800 rounded-2xl p-4 mb-3 active:opacity-80"
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-white text-lg font-semibold">
            {item.name}
          </Text>
          <Text className="text-dark-400 text-sm mt-0.5">
            {item.address}
          </Text>
        </View>
        {item.isDefault && (
          <View className="bg-primary-500/15 px-2.5 py-1 rounded-full">
            <Text className="text-primary-400 text-xs font-semibold">
              Default
            </Text>
          </View>
        )}
      </View>

      {/* Radius info */}
      <Text className="text-dark-400 text-xs mt-1">
        Geofence: {item.radius}m radius
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-6">
        <Text className="text-white text-2xl font-bold">Destinations</Text>
        <Pressable
          onPress={() => router.push("/destination/add")}
          className="bg-primary-500 px-4 py-2 rounded-xl active:bg-primary-600"
        >
          <Text className="text-white font-semibold text-sm">Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={destinations}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
