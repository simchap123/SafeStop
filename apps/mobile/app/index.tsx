import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "../components/ui/Button";
import ShieldLogo from "../components/ui/ShieldLogo";

export default function WelcomeScreen() {
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 800,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeIn]);

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Subtle gradient-like layers */}
      <View className="absolute inset-0">
        <View className="absolute top-0 left-0 right-0 h-1/3 bg-primary-500/[0.04]" />
        <View className="absolute top-0 left-0 right-0 h-1/6 bg-primary-500/[0.03]" />
        <View className="absolute bottom-0 left-0 right-0 h-1/4 bg-dark-900" />
      </View>

      <View className="flex-1 justify-center items-center px-8">
        {/* Shield hero */}
        <View className="mb-10 items-center justify-center">
          <ShieldLogo size="lg" />
        </View>

        {/* Tagline */}
        <Animated.View style={{ opacity: fadeIn }} className="items-center">
          <Text className="text-dark-200 text-xl font-medium text-center mb-2">
            Never leave a child behind.
          </Text>
          <Text className="text-dark-400 text-sm text-center mb-8 px-4 leading-5">
            Smart vehicle safety that keeps your family protected every trip.
          </Text>

          {/* Feature trio */}
          <View className="flex-row items-center justify-center gap-6 mb-10">
            <View className="items-center w-24">
              <View className="w-12 h-12 rounded-2xl bg-dark-800 border border-dark-700 items-center justify-center mb-2">
                <Ionicons name="car-outline" size={22} color="#818CF8" />
              </View>
              <Text className="text-dark-300 text-xs text-center font-medium">Trip Detection</Text>
            </View>
            <View className="items-center w-24">
              <View className="w-12 h-12 rounded-2xl bg-dark-800 border border-dark-700 items-center justify-center mb-2">
                <Ionicons name="camera-outline" size={22} color="#818CF8" />
              </View>
              <Text className="text-dark-300 text-xs text-center font-medium">Photo Confirmation</Text>
            </View>
            <View className="items-center w-24">
              <View className="w-12 h-12 rounded-2xl bg-dark-800 border border-dark-700 items-center justify-center mb-2">
                <Ionicons name="people-outline" size={22} color="#818CF8" />
              </View>
              <Text className="text-dark-300 text-xs text-center font-medium">Caregiver Alerts</Text>
            </View>
          </View>

          {/* Buttons */}
          <View className="w-full gap-4">
            <Link href="/(auth)/signup" asChild>
              <Button
                title="Get Started"
                onPress={() => {}}
                size="xl"
              />
            </Link>
            <Link href="/(auth)/login" asChild>
              <Button
                title="I have an account"
                variant="outline"
                onPress={() => {}}
                size="lg"
              />
            </Link>
          </View>
        </Animated.View>
      </View>

      {/* Footer */}
      <View className="pb-6 items-center">
        <Text className="text-dark-500 text-xs">
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}
