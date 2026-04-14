import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const CONFIRMATION_TIMEOUT_SECONDS = 120; // 2 minutes

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
  const countdownText = `${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, "0")}`;

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
        {/* Warning Header */}
        <View className="bg-warning-500/15 border-b-2 border-warning-500 px-4 py-6">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-full bg-warning-500 items-center justify-center mr-3">
              <Ionicons name="warning" size={24} color="#FFFFFF" />
            </View>
            <Text className="text-warning-500 font-bold text-2xl">
              Stop Detected
            </Text>
          </View>
          <Text className="text-dark-200 text-base mt-1">
            Your vehicle has stopped. Please confirm your child's safety.
          </Text>
        </View>

        {/* Countdown Timer */}
        <View className="items-center mt-8 px-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons
              name="time-outline"
              size={18}
              color={isUrgent ? "#EF4444" : "#F59E0B"}
            />
            <Text className="text-dark-300 text-base">
              Confirmation needed in
            </Text>
          </View>
          <View
            className={`px-6 py-3 rounded-2xl ${
              isUrgent ? "bg-danger-500/15" : "bg-warning-500/10"
            }`}
          >
            <Text
              className={`text-4xl font-bold font-mono ${
                isUrgent ? "text-danger-500" : "text-warning-500"
              }`}
            >
              {countdownText}
            </Text>
          </View>
        </View>

        {/* Question */}
        <View className="px-4 mt-8">
          <Text className="text-white text-2xl font-bold text-center mb-8">
            Did you take your child out?
          </Text>

          {/* Action Buttons */}
          <View className="gap-4">
            {/* PRIMARY: Take Photo */}
            <TouchableOpacity
              onPress={handleTakePhoto}
              className="bg-safe-500 h-16 rounded-xl flex-row items-center justify-center gap-3"
              activeOpacity={0.8}
            >
              <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
              <View>
                <Text className="text-white font-bold text-lg">Take Photo</Text>
                <Text className="text-white/70 text-sm">
                  Recommended for full verification
                </Text>
              </View>
            </TouchableOpacity>

            {/* SECONDARY: Confirm Without Photo */}
            <TouchableOpacity
              onPress={handleConfirmWithoutPhoto}
              className="border-2 border-dark-600 h-14 rounded-xl flex-row items-center justify-center gap-2"
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
              <Text className="text-white font-semibold text-base">
                Confirm Without Photo
              </Text>
            </TouchableOpacity>

            {/* TERTIARY: Remind Me */}
            <TouchableOpacity
              onPress={handleRemindLater}
              className="h-14 items-center justify-center"
              activeOpacity={0.6}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="time-outline" size={18} color="#CBD5E1" />
                <Text className="text-dark-300 font-medium text-base">
                  Remind Me in 2 Minutes
                </Text>
              </View>
            </TouchableOpacity>

            {/* BOTTOM: No Child */}
            <TouchableOpacity
              onPress={handleNoChild}
              className="h-12 items-center justify-center mt-2"
              activeOpacity={0.5}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="close-circle-outline" size={16} color="#64748B" />
                <Text className="text-dark-500 text-sm">
                  No Child With Me
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
