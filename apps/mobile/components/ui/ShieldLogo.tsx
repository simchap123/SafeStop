import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ShieldLogoProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const sizes = {
  sm: { icon: 28, brand: "text-lg", container: "w-12 h-14", glow: 8 },
  md: { icon: 48, brand: "text-2xl", container: "w-20 h-24", glow: 12 },
  lg: { icon: 72, brand: "text-3xl", container: "w-28 h-32", glow: 20 },
};

export default function ShieldLogo({ size = "lg", animated = true }: ShieldLogoProps) {
  const s = sizes[size];
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!animated) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, {
          toValue: 0.7,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [animated, pulseOpacity]);

  return (
    <View className="items-center">
      <View className="items-center justify-center">
        {/* Animated glow behind icon */}
        {animated && (
          <Animated.View
            className={`absolute ${
              size === "lg"
                ? "w-36 h-40"
                : size === "md"
                  ? "w-24 h-28"
                  : "w-16 h-18"
            } rounded-full bg-primary-500/15`}
            style={{ opacity: pulseOpacity }}
          />
        )}
        <View
          className={`${s.container} items-center justify-center`}
          style={{
            shadowColor: "#6366F1",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: s.glow,
            elevation: 10,
          }}
        >
          <Ionicons name="shield-checkmark" size={s.icon} color="#818CF8" />
        </View>
      </View>
      <Text className={`${s.brand} text-white mt-4 tracking-wide`}>
        <Text style={{ fontWeight: "300" }}>Safe</Text>
        <Text style={{ fontWeight: "700" }} className="text-primary-400">Stop</Text>
      </Text>
    </View>
  );
}
