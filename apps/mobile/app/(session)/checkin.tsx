import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApp } from "../../lib/store";
import { SessionState } from "../../lib/types";
import type { Child } from "../../lib/types";

const CHILD_COLORS = ["#818CF8", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

function getChildColor(index: number): string {
  return CHILD_COLORS[index % CHILD_COLORS.length];
}

const ChildCard = React.memo(function ChildCard({
  child,
  index,
  selected,
  onToggle,
}: {
  child: Child;
  index: number;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      className={`flex-row items-center p-4 rounded-2xl mb-3 ${
        selected ? "bg-safe-500/15 border-2 border-safe-500" : "bg-dark-800 border-2 border-dark-700"
      }`}
      style={({ pressed }) => [
        { minHeight: 48 },
        pressed && { opacity: 0.7 },
      ]}
    >
      {/* Avatar */}
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: getChildColor(index) }}
      >
        <Text className="text-white font-bold text-base">{getInitials(child.name)}</Text>
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-white font-semibold text-lg">{child.name}</Text>
        {child.dateOfBirth && (
          <Text className="text-dark-400 text-sm">
            {Math.floor((Date.now() - new Date(child.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years old
          </Text>
        )}
      </View>

      {/* Checkbox */}
      <View
        className={`w-7 h-7 rounded-lg items-center justify-center ${
          selected ? "bg-safe-500" : "border-2 border-dark-500"
        }`}
      >
        {selected && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
      </View>
    </Pressable>
  );
});

export default function CheckInScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [location, setLocation] = useState("Detecting location...");
  const [locationDetected, setLocationDetected] = useState(false);

  // Simulate location detection
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("123 Main Street");
      setLocationDetected(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  function toggleChild(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleStart() {
    if (selectedIds.length === 0) return;
    const childId = selectedIds[0];
    dispatch({
      type: 'START_SESSION',
      payload: {
        id: Date.now().toString(),
        familyId: state.auth.family?.id ?? '',
        driverId: state.auth.user?.id ?? '',
        childId,
        state: SessionState.DRIVING,
        startedAt: new Date().toISOString(),
        stops: [],
      },
    });
    router.push("/(session)/active");
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="mt-4 mb-2">
          <Pressable
            onPress={() => router.back()}
            className="mb-4 flex-row items-center gap-1"
            style={({ pressed }) => [
              { minHeight: 48 },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="chevron-back" size={20} color="#94A3B8" />
            <Text className="text-dark-400 text-base">Back</Text>
          </Pressable>
          <Text className="text-white text-3xl font-bold mb-1">Check In</Text>
          <Text className="text-dark-400 text-base">
            Start a safety session before you drive.
          </Text>
        </View>

        {/* Who's riding */}
        <View className="mt-8">
          <View className="flex-row items-center gap-2 mb-4">
            <Ionicons name="people-outline" size={20} color="#818CF8" />
            <Text className="text-white text-lg font-semibold">
              Who's riding with you?
            </Text>
          </View>
          {state.children.map((child, index) => (
            <ChildCard
              key={child.id}
              child={child}
              index={index}
              selected={selectedIds.includes(child.id)}
              onToggle={() => toggleChild(child.id)}
            />
          ))}
        </View>

        {/* Location */}
        <View className="mt-8">
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="location-outline" size={20} color="#818CF8" />
            <Text className="text-white text-lg font-semibold">
              Starting from
            </Text>
          </View>
          <View className="bg-dark-800 border border-dark-700 rounded-2xl p-4 flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-primary-500/20 items-center justify-center mr-3">
              <Ionicons name="navigate-outline" size={20} color="#818CF8" />
            </View>
            <TextInput
              className="flex-1 text-white text-base"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#64748B"
              placeholder="Enter location..."
            />
            {locationDetected && (
              <View className="bg-safe-500/20 px-2 py-1 rounded-lg">
                <Text className="text-safe-500 text-xs font-medium">Auto</Text>
              </View>
            )}
          </View>
        </View>

        {/* Start Session Button */}
        <Pressable
          onPress={handleStart}
          className={`mt-10 h-14 rounded-xl items-center justify-center flex-row gap-2 ${
            selectedIds.length > 0 ? "bg-safe-500" : "bg-dark-700"
          }`}
          style={({ pressed }) => [
            pressed && { opacity: 0.8 },
          ]}
          disabled={selectedIds.length === 0}
        >
          <Ionicons
            name="play-circle-outline"
            size={22}
            color={selectedIds.length > 0 ? "#FFFFFF" : "#64748B"}
          />
          <Text
            className={`text-lg font-bold ${
              selectedIds.length > 0 ? "text-white" : "text-dark-500"
            }`}
          >
            Start Session
          </Text>
        </Pressable>

        {/* No child link */}
        <Pressable
          onPress={() => router.back()}
          className="mt-6 items-center py-3"
          style={({ pressed }) => [
            { minHeight: 48 },
            pressed && { opacity: 0.6 },
          ]}
        >
          <Text className="text-dark-400 text-base underline">
            No Child With Me Today
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
