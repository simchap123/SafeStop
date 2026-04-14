import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import MapView from "../../components/ui/MapView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

function PulseDot() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [scale, opacity]);

  return (
    <View className="items-center justify-center mr-3">
      <Animated.View
        className="w-3 h-3 rounded-full bg-safe-500 absolute"
        style={{ transform: [{ scale }], opacity }}
      />
      <View className="w-3 h-3 rounded-full bg-safe-500" />
    </View>
  );
}

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
    router.replace("/(session)/checkin");
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Active Banner */}
      <View className="bg-safe-500/10 border-b border-safe-500/20 px-6 py-4 flex-row items-center justify-center">
        <PulseDot />
        <Text className="text-safe-500 font-bold text-lg">Session Active</Text>
      </View>

      <View className="flex-1 px-6">
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

        {/* Map */}
        <View className="mt-8 rounded-2xl overflow-hidden">
          <MapView
            latitude={37.4220}
            longitude={-122.0841}
            height={200}
            showPin
            markers={[{ lat: 37.4220, lng: -122.0841, title: "Current Location" }]}
          />
        </View>

        {/* Status */}
        <View className="mt-6 bg-dark-800 rounded-2xl p-4 flex-row items-center justify-between">
          <Text className="text-dark-300 text-base">Current Status</Text>
          <View className="flex-row items-center">
            <View
              className={`w-3 h-3 rounded-full mr-2 ${
                status === "Driving" ? "bg-safe-500" : "bg-warning-500"
              }`}
            />
            <Text className="text-white font-semibold text-base">{status}</Text>
          </View>
        </View>

        {/* Simulate stop button (for demo) */}
        <TouchableOpacity
          onPress={handleSimulateStop}
          className="mt-4 bg-warning-500/15 border border-warning-500/30 py-3 rounded-2xl items-center"
          activeOpacity={0.7}
        >
          <Text className="text-warning-500 font-medium text-sm">
            Simulate Stop Detection (Demo)
          </Text>
        </TouchableOpacity>
      </View>

      {/* End Session */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={handleEndSession}
          className="py-4 rounded-2xl items-center border-2 border-dark-600"
          activeOpacity={0.7}
        >
          <Text className="text-dark-300 font-semibold text-base">
            End Session
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
