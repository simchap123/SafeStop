import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// Decorative sparkle dot
function Sparkle({
  delay,
  x,
  y,
  size,
}: {
  delay: number;
  x: number;
  y: number;
  size: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.5,
          duration: 1,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity, scale, delay]);

  return (
    <Animated.View
      className="absolute rounded-full bg-safe-500"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

export default function ConfirmedScreen() {
  const router = useRouter();
  const [timestamp] = useState(new Date());
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 3,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleAnim, fadeAnim, checkScale]);

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
    router.replace("/(tabs)");
  }

  // Sparkle positions around the checkmark
  const sparkles = [
    { delay: 200, x: -10, y: 5, size: 6 },
    { delay: 400, x: 120, y: 10, size: 8 },
    { delay: 100, x: 5, y: 100, size: 5 },
    { delay: 500, x: 115, y: 95, size: 7 },
    { delay: 300, x: 55, y: -8, size: 5 },
    { delay: 600, x: 50, y: 115, size: 6 },
    { delay: 150, x: -5, y: 55, size: 4 },
    { delay: 450, x: 125, y: 55, size: 5 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Subtle green ambient glow at top */}
      <View className="absolute top-0 left-0 right-0 h-1/3 bg-safe-500/[0.04]" />

      <View className="flex-1 px-6 items-center justify-center">
        {/* Animated Checkmark with sparkles */}
        <View className="mb-8 items-center justify-center">
          {/* Sparkle effects */}
          <View className="absolute w-[130px] h-[130px]">
            {sparkles.map((s, i) => (
              <Sparkle key={i} {...s} />
            ))}
          </View>

          {/* Outer glow rings */}
          <View className="absolute w-36 h-36 rounded-full bg-safe-500/10" />
          <View className="absolute w-32 h-32 rounded-full bg-safe-500/5" />

          <Animated.View
            className="w-28 h-28 rounded-full bg-safe-500 items-center justify-center"
            style={{
              transform: [{ scale: scaleAnim }],
              shadowColor: "#22C55E",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 16,
            }}
          >
            <Animated.Text
              className="text-white text-5xl font-bold"
              style={{ transform: [{ scale: checkScale }] }}
            >
              {"\u2713"}
            </Animated.Text>
          </Animated.View>
        </View>

        {/* Title */}
        <Animated.View style={{ opacity: fadeAnim }} className="items-center">
          <Text className="text-white text-2xl font-bold mb-1">
            Child Safely Dropped Off
          </Text>
          <Text className="text-dark-300 text-sm mb-6">
            Everything looks good
          </Text>

          {/* Photo thumbnail placeholder */}
          <View className="w-20 h-20 rounded-xl bg-dark-800 border border-dark-700 items-center justify-center mb-5">
            <Text className="text-dark-500 text-2xl">{"[ ]"}</Text>
            <Text className="text-dark-500 text-xs mt-1">Photo</Text>
          </View>

          {/* Timestamp card */}
          <View
            className="bg-dark-800 rounded-2xl px-8 py-5 items-center mb-5 border border-dark-700/50"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-dark-400 text-xs uppercase tracking-wider mb-1">
              Confirmed at
            </Text>
            <Text className="text-white font-bold text-2xl">{timeString}</Text>
            <Text className="text-dark-400 text-sm mt-1">{dateString}</Text>
          </View>

          {/* Caregiver notification - reassuring */}
          <View
            className="flex-row items-center bg-safe-500/10 px-5 py-3.5 rounded-2xl border border-safe-500/20"
            style={{
              shadowColor: "#22C55E",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="w-9 h-9 rounded-full bg-safe-500/20 items-center justify-center mr-3">
              <Text className="text-safe-500 font-bold">{"\u2713"}</Text>
            </View>
            <View>
              <Text className="text-safe-400 font-semibold text-base">
                Caregivers have been notified
              </Text>
              <Text className="text-safe-500/60 text-xs mt-0.5">
                Everyone is in the loop
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Buttons */}
      <View className="px-6 pb-6 gap-3">
        <TouchableOpacity
          onPress={handleContinueSession}
          activeOpacity={0.8}
          className="bg-primary-500 py-4 rounded-2xl items-center"
          style={{
            shadowColor: "#6366F1",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text className="text-white font-bold text-base">
            Continue Session
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleEndSession}
          activeOpacity={0.7}
          className="border border-dark-600 py-4 rounded-2xl items-center"
        >
          <Text className="text-dark-300 font-semibold text-base">
            End Session
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
