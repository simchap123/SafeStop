import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ConfirmedScreen() {
  const router = useRouter();
  const [timestamp] = useState(new Date());
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const timeString = timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = timestamp.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  function handleContinueSession() {
    router.replace("/(session)/active");
  }

  function handleEndSession() {
    router.push("/(session)/end-session");
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <View className="flex-1 px-4 items-center justify-center">
        {/* Animated Checkmark */}
        <Animated.View
          className="w-28 h-28 rounded-full bg-safe-500 items-center justify-center mb-6"
          style={{ transform: [{ scale: scaleAnim }] }}
        >
          <Ionicons name="checkmark-circle" size={64} color="#FFFFFF" />
        </Animated.View>

        {/* Title */}
        <Animated.View style={{ opacity: fadeAnim }} className="items-center">
          <Text className="text-white text-2xl font-bold mb-2">
            Child Safely Dropped Off
          </Text>

          {/* Photo thumbnail placeholder */}
          <View className="w-20 h-20 rounded-xl bg-dark-800 border border-dark-700 items-center justify-center mt-6 mb-4">
            <Ionicons name="image-outline" size={28} color="#64748B" />
            <Text className="text-dark-500 text-xs mt-1">Photo</Text>
          </View>

          {/* Timestamp */}
          <View className="bg-dark-800 border border-dark-700 rounded-2xl px-6 py-4 items-center mt-2">
            <Text className="text-dark-400 text-sm">Confirmed at</Text>
            <Text className="text-white font-bold text-xl mt-1">
              {timeString}
            </Text>
            <Text className="text-dark-400 text-sm mt-1">{dateString}</Text>
          </View>

          {/* Notification */}
          <View className="flex-row items-center mt-6 bg-safe-500/10 px-5 py-3 rounded-2xl">
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" style={{ marginRight: 8 }} />
            <Text className="text-safe-500 font-medium text-base">
              Caregivers have been notified
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Buttons */}
      <View className="px-4 pb-6 gap-3">
        <TouchableOpacity
          onPress={handleContinueSession}
          className="bg-primary-500 h-14 rounded-xl items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-base">
            Continue Session
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleEndSession}
          className="border-2 border-dark-600 h-14 rounded-xl items-center justify-center"
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
