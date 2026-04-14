import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ShieldLogoProps {
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 28, brand: "text-lg", container: "w-12 h-14" },
  md: { icon: 48, brand: "text-2xl", container: "w-20 h-24" },
  lg: { icon: 72, brand: "text-3xl", container: "w-28 h-32" },
};

export default function ShieldLogo({ size = "lg" }: ShieldLogoProps) {
  const s = sizes[size];

  return (
    <View className="items-center">
      <View
        className={`${s.container} items-center justify-center`}
      >
        <Ionicons name="shield-checkmark" size={s.icon} color="#818CF8" />
      </View>
      <Text className={`${s.brand} text-white mt-3 tracking-wide`}>
        <Text style={{ fontWeight: "300" }}>Safe</Text>
        <Text style={{ fontWeight: "700" }} className="text-primary-400">Stop</Text>
      </Text>
    </View>
  );
}
