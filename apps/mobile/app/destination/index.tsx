import React, { useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type DestType = "Daycare" | "School" | "Babysitter" | "Family" | "Custom";

interface Destination {
  id: string;
  label: string;
  type: DestType;
  address: string;
  activeDays: boolean[]; // M T W T F S S
  childName: string;
}

const TYPE_COLORS: Record<DestType, { bg: string; text: string; dot: string }> = {
  Daycare: { bg: "bg-primary-500/15", text: "text-primary-400", dot: "#818CF8" },
  School: { bg: "bg-safe-500/15", text: "text-safe-500", dot: "#22C55E" },
  Babysitter: { bg: "bg-warning-500/15", text: "text-warning-500", dot: "#F59E0B" },
  Family: { bg: "bg-danger-500/15", text: "text-danger-500", dot: "#EF4444" },
  Custom: { bg: "bg-dark-600/50", text: "text-dark-300", dot: "#94A3B8" },
};

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const MOCK_DESTINATIONS: Destination[] = [
  {
    id: "d1",
    label: "Sunshine Daycare",
    type: "Daycare",
    address: "123 Oak Lane, Springfield",
    activeDays: [true, true, true, true, true, false, false],
    childName: "Emma",
  },
  {
    id: "d2",
    label: "Lincoln Elementary",
    type: "School",
    address: "456 Elm Street, Springfield",
    activeDays: [true, true, true, true, true, false, false],
    childName: "Liam",
  },
  {
    id: "d3",
    label: "Grandma's House",
    type: "Family",
    address: "789 Maple Drive, Shelbyville",
    activeDays: [false, false, false, false, false, true, true],
    childName: "Emma",
  },
  {
    id: "d4",
    label: "Mrs. Parker",
    type: "Babysitter",
    address: "321 Pine Ave, Springfield",
    activeDays: [false, true, false, true, false, false, false],
    childName: "Sophie",
  },
];

export default function DestinationsListScreen() {
  const router = useRouter();
  const [destinations] = useState<Destination[]>(MOCK_DESTINATIONS);

  const renderDestination = ({ item }: { item: Destination }) => {
    const colors = TYPE_COLORS[item.type];

    return (
      <Pressable
        onPress={() => router.push(`/destination/${item.id}`)}
        className="bg-dark-800 rounded-2xl p-4 mb-3 active:opacity-80"
      >
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 mr-3">
            <Text className="text-white text-lg font-semibold">
              {item.label}
            </Text>
            <Text className="text-dark-400 text-sm mt-0.5">
              {item.address}
            </Text>
          </View>
          <View className={`${colors.bg} px-2.5 py-1 rounded-full`}>
            <Text className={`${colors.text} text-xs font-semibold`}>
              {item.type}
            </Text>
          </View>
        </View>

        {/* Day pills */}
        <View className="flex-row gap-1.5 mb-2 mt-1">
          {item.activeDays.map((active, i) => (
            <View
              key={i}
              className={`w-7 h-7 rounded-full items-center justify-center ${
                active ? "" : "bg-dark-700"
              }`}
              style={active ? { backgroundColor: colors.dot } : undefined}
            >
              <Text
                className={`text-xs font-semibold ${
                  active ? "text-white" : "text-dark-500"
                }`}
              >
                {DAY_LABELS[i]}
              </Text>
            </View>
          ))}
        </View>

        {/* Child link */}
        <Text className="text-dark-400 text-xs mt-1">
          Linked to {item.childName}
        </Text>
      </Pressable>
    );
  };

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
