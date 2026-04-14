import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MissedConfirmationScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const [elapsedSinceAlert, setElapsedSinceAlert] = useState(0);

  // Pulsing urgency animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Time since alert
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSinceAlert((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(elapsedSinceAlert / 60);
  const seconds = elapsedSinceAlert % 60;
  const elapsedText = `${minutes}:${String(seconds).padStart(2, "0")}`;

  function handleConfirmNow() {
    router.replace("/(session)/stop-detected");
  }

  function handleFalseAlarm() {
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Red urgent header */}
      <Animated.View
        className="bg-danger-500 px-4 py-8"
        style={{ opacity: pulseAnim }}
      >
        <View className="items-center">
          <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-4">
            <Ionicons name="warning-outline" size={36} color="#FFFFFF" />
          </View>
          <Text className="text-white font-bold text-2xl text-center">
            Confirmation Not Received
          </Text>
        </View>
      </Animated.View>

      <View className="flex-1 px-4 items-center">
        {/* Alert info */}
        <View className="bg-danger-500/10 border border-danger-500/30 rounded-2xl p-6 mt-8 w-full">
          <View className="flex-row items-center mb-3 gap-2">
            <Ionicons name="alert-circle" size={18} color="#EF4444" />
            <Text className="text-danger-500 font-semibold text-base">
              Alert Escalated
            </Text>
          </View>
          <Text className="text-dark-200 text-base leading-6">
            You did not confirm your child's safety within the required time.
            Caregivers and emergency contacts have been alerted.
          </Text>
        </View>

        {/* Caregiver notification */}
        <View className="bg-dark-800 border border-dark-700 rounded-2xl p-4 mt-4 w-full flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-danger-500/20 items-center justify-center mr-4">
            <Ionicons name="notifications" size={20} color="#EF4444" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              Caregivers have been alerted
            </Text>
            <Text className="text-dark-400 text-sm mt-1">
              Alert sent {elapsedText} ago
            </Text>
          </View>
        </View>

        {/* Child info */}
        <View className="bg-dark-800 border border-dark-700 rounded-2xl p-4 mt-4 w-full flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-primary-500 items-center justify-center mr-4">
            <Text className="text-white font-bold text-base">EM</Text>
          </View>
          <View>
            <Text className="text-white font-semibold text-base">Emma</Text>
            <Text className="text-dark-400 text-sm">
              Last confirmed: Not yet
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom actions */}
      <View className="px-4 pb-6 gap-4">
        <TouchableOpacity
          onPress={handleConfirmNow}
          className="bg-danger-500 h-14 rounded-xl items-center justify-center flex-row gap-2"
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
          <Text className="text-white font-bold text-lg">Confirm Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleFalseAlarm}
          className="h-12 items-center justify-center"
          activeOpacity={0.6}
        >
          <Text className="text-dark-400 text-base">
            This was a false alarm
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
