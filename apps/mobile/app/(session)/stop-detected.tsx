import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const CONFIRMATION_TIMEOUT_SECONDS = 120; // 2 minutes

function TimerRing({
  countdown,
  total,
  isUrgent,
}: {
  countdown: number;
  total: number;
  isUrgent: boolean;
}) {
  const progress = countdown / total;
  // Simulated circular progress via concentric rings
  return (
    <View className="items-center justify-center w-40 h-40">
      {/* Outer ring background */}
      <View
        className={`absolute w-40 h-40 rounded-full border-4 ${
          isUrgent ? "border-danger-500/20" : "border-warning-500/20"
        }`}
      />
      {/* Progress ring (simulated with opacity) */}
      <View
        className={`absolute w-40 h-40 rounded-full border-4 ${
          isUrgent ? "border-danger-500" : "border-warning-500"
        }`}
        style={{ opacity: progress }}
      />
      {/* Inner circle */}
      <View
        className={`w-32 h-32 rounded-full items-center justify-center ${
          isUrgent ? "bg-danger-500/10" : "bg-warning-500/10"
        }`}
      >
        <Text className="text-dark-300 text-xs mb-1">Time remaining</Text>
        <Text
          className={`text-4xl font-bold ${
            isUrgent ? "text-danger-500" : "text-warning-500"
          }`}
        >
          {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
        </Text>
      </View>
    </View>
  );
}

function PulseWarning() {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      className="absolute inset-0 bg-warning-500/[0.06]"
      style={{ opacity }}
    />
  );
}

export default function StopDetectedScreen() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(CONFIRMATION_TIMEOUT_SECONDS);

  useEffect(() => {
    if (countdown <= 0) {
      router.replace("/(session)/missed");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  const isUrgent = countdown <= 30;

  function handleTakePhoto() {
    router.push("/(session)/camera");
  }

  function handleConfirmWithoutPhoto() {
    router.replace("/(session)/confirmed");
  }

  function handleRemindLater() {
    setCountdown(CONFIRMATION_TIMEOUT_SECONDS);
    router.back();
  }

  function handleNoChild() {
    router.replace("/(session)/confirmed");
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        bounces={false}
      >
        {/* Warning Header with warm amber tint */}
        <View className="relative overflow-hidden">
          <PulseWarning />
          <View className="bg-warning-500/10 border-b border-warning-500/30 px-6 py-5">
            <View className="flex-row items-center mb-2">
              <View
                className="w-11 h-11 rounded-full bg-warning-500 items-center justify-center mr-3"
                style={{
                  shadowColor: "#F59E0B",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Text className="text-white font-bold text-xl">!</Text>
              </View>
              <View>
                <Text className="text-warning-500 font-bold text-xl">
                  Stop Detected
                </Text>
                <Text className="text-dark-300 text-sm mt-0.5">
                  Please confirm your child's safety
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Countdown Timer Ring */}
        <View className="items-center mt-8 mb-6">
          <TimerRing
            countdown={countdown}
            total={CONFIRMATION_TIMEOUT_SECONDS}
            isUrgent={isUrgent}
          />
        </View>

        {/* Question */}
        <View className="px-6">
          <Text className="text-white text-2xl font-bold text-center mb-8">
            Did you take your child out?
          </Text>

          {/* Action Buttons with clear visual hierarchy */}
          <View className="gap-4">
            {/* PRIMARY: Take Photo - HUGE and unmissable */}
            <TouchableOpacity
              onPress={handleTakePhoto}
              activeOpacity={0.8}
              className="bg-safe-500 rounded-2xl flex-row items-center justify-center"
              style={{
                height: 72,
                shadowColor: "#22C55E",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 10,
              }}
            >
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                <Text className="text-white text-lg">{"[ ]"}</Text>
              </View>
              <View>
                <Text className="text-white font-bold text-lg">
                  Take Photo
                </Text>
                <Text className="text-white/70 text-sm">
                  Recommended for full verification
                </Text>
              </View>
            </TouchableOpacity>

            {/* SECONDARY: Confirm Without Photo */}
            <TouchableOpacity
              onPress={handleConfirmWithoutPhoto}
              activeOpacity={0.7}
              className="border-2 border-safe-500/40 bg-safe-500/5 py-4 rounded-2xl flex-row items-center justify-center"
            >
              <View className="w-8 h-8 rounded-full bg-safe-500/20 items-center justify-center mr-3">
                <Text className="text-safe-500 font-bold text-sm">
                  {"\u2713"}
                </Text>
              </View>
              <Text className="text-white font-semibold text-base">
                Confirm Without Photo
              </Text>
            </TouchableOpacity>

            {/* TERTIARY: Remind Me */}
            <TouchableOpacity
              onPress={handleRemindLater}
              activeOpacity={0.6}
              className="bg-dark-800 py-4 rounded-2xl items-center"
            >
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-full bg-dark-700 items-center justify-center mr-2">
                  <Text className="text-dark-300 text-xs">{"~"}</Text>
                </View>
                <Text className="text-dark-300 font-medium text-base">
                  Remind Me in 2 Minutes
                </Text>
              </View>
            </TouchableOpacity>

            {/* GHOST: No Child */}
            <TouchableOpacity
              onPress={handleNoChild}
              activeOpacity={0.5}
              className="py-3 items-center mt-1"
            >
              <Text className="text-dark-500 text-sm underline">
                No child with me
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
