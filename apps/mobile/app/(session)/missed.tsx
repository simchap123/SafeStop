import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

function PulsingBorder() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      className="absolute inset-0 border-2 border-danger-500 rounded-3xl"
      style={{ opacity }}
    />
  );
}

export default function MissedConfirmationScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(0.7)).current;
  const bgPulse = useRef(new Animated.Value(0)).current;
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
          toValue: 0.7,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Background pulse
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(bgPulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(bgPulse, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [bgPulse]);

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
      {/* Subtle pulsing red background tint */}
      <Animated.View
        className="absolute inset-0 bg-danger-500/[0.04]"
        style={{ opacity: bgPulse }}
      />

      {/* Red urgent header */}
      <Animated.View
        className="bg-danger-500 px-6 py-8"
        style={{ opacity: pulseAnim }}
      >
        <View className="items-center">
          <View
            className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-4"
            style={{
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text className="text-white text-4xl font-bold">!</Text>
          </View>
          <Text className="text-white font-bold text-2xl text-center">
            Confirmation Not Received
          </Text>
          <Text className="text-white/70 text-sm text-center mt-1">
            Immediate action required
          </Text>
        </View>
      </Animated.View>

      <View className="flex-1 px-6 items-center">
        {/* Alert info card with pulsing border */}
        <View className="relative mt-8 w-full">
          <PulsingBorder />
          <View className="bg-danger-500/10 rounded-3xl p-6">
            <View className="flex-row items-center mb-3">
              <View className="w-3 h-3 rounded-full bg-danger-500 mr-2" />
              <Text className="text-danger-500 font-semibold text-base">
                Alert Escalated
              </Text>
            </View>
            <Text className="text-dark-200 text-base leading-6">
              You did not confirm your child's safety within the required time.
              Caregivers and emergency contacts have been alerted.
            </Text>
          </View>
        </View>

        {/* Caregiver notification */}
        <View
          className="bg-dark-800 rounded-2xl p-5 mt-4 w-full flex-row items-center border border-dark-700/50"
          style={{
            shadowColor: "#EF4444",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <View className="w-10 h-10 rounded-full bg-danger-500/20 items-center justify-center mr-4">
            <Text className="text-danger-500 font-bold text-lg">{"!"}</Text>
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
        <View
          className="bg-dark-800 rounded-2xl p-5 mt-4 w-full flex-row items-center border border-dark-700/50"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
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
      <View className="px-6 pb-6 gap-4">
        <TouchableOpacity
          onPress={handleConfirmNow}
          activeOpacity={0.8}
          className="bg-danger-500 py-5 rounded-2xl items-center"
          style={{
            shadowColor: "#EF4444",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <Text className="text-white font-bold text-lg">Confirm Now</Text>
          <Text className="text-white/60 text-xs mt-0.5">
            Verify your child is safe
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleFalseAlarm}
          activeOpacity={0.6}
          className="py-3 items-center"
        >
          <Text className="text-dark-400 text-base underline">
            This was a false alarm
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
