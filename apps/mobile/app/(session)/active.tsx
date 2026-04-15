import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export default function ActiveSessionScreen() {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState<"Driving" | "Stopped">("Driving");

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate a stop after 10 seconds for demo
  useEffect(() => {
    if (elapsed === 10) {
      setStatus("Stopped");
    }
  }, [elapsed]);

  function handleSimulateStop() {
    router.push("/(session)/stop-detected");
  }

  function handleEndSession() {
    router.push("/(session)/end-session");
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Active Banner */}
      <View className="bg-safe-500/10 border-b border-safe-500/20 px-4 py-4 flex-row items-center justify-center gap-2">
        <Ionicons name="radio-button-on" size={14} color="#22C55E" />
        <Text className="text-safe-500 font-bold text-lg">Session Active</Text>
      </View>

      <View className="flex-1 px-4">
        {/* Child & Timer */}
        <View className="items-center mt-8">
          <View className="w-16 h-16 rounded-full bg-primary-500 items-center justify-center mb-4">
            <Text className="text-white font-bold text-xl">EM</Text>
          </View>
          <Text className="text-white text-xl font-semibold">Emma</Text>
          <Text className="text-dark-300 text-base mt-1">Session Duration</Text>
          <Text className="text-white text-5xl font-bold mt-2 font-mono">
            {formatDuration(elapsed)}
          </Text>
        </View>

        {/* Map Placeholder */}
        <View className="mt-8 bg-dark-800 border border-dark-700 rounded-2xl h-48 items-center justify-center">
          <Ionicons name="map-outline" size={32} color="#475569" style={{ marginBottom: 8 }} />
          <Text className="text-dark-400 text-base font-medium">Map View</Text>
          <Text className="text-dark-500 text-sm mt-1">
            Live tracking coming soon
          </Text>
        </View>

        {/* Status */}
        <View className="mt-6 bg-dark-800 border border-dark-700 rounded-2xl p-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="car-outline" size={20} color="#94A3B8" />
            <Text className="text-dark-300 text-base">Current Status</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons
              name={status === "Driving" ? "navigate" : "location"}
              size={16}
              color={status === "Driving" ? "#22C55E" : "#F59E0B"}
            />
            <Text className="text-white font-semibold text-base">{status}</Text>
          </View>
        </View>

        {/* Simulate stop button (for demo) */}
        <TouchableOpacity
          onPress={handleSimulateStop}
          className="mt-4 bg-warning-500/15 border border-warning-500/30 h-14 rounded-xl items-center justify-center flex-row gap-2"
          activeOpacity={0.7}
        >
          <Ionicons name="pause-circle-outline" size={20} color="#F59E0B" />
          <Text className="text-warning-500 font-medium text-sm">
            Simulate Stop Detection (Demo)
          </Text>
        </TouchableOpacity>
      </View>

      {/* End Session */}
      <View className="px-4 pb-6">
        <TouchableOpacity
          onPress={handleEndSession}
          className="h-14 rounded-xl items-center justify-center border-2 border-dark-600 flex-row gap-2"
          activeOpacity={0.7}
        >
          <Ionicons name="stop-circle-outline" size={20} color="#CBD5E1" />
          <Text className="text-dark-300 font-semibold text-base">
            End Session
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
