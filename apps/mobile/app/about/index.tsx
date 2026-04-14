import React from "react";
import { View, Text, Pressable, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ShieldLogo from "../../components/ui/ShieldLogo";

const STEPS = [
  {
    number: "1",
    title: "Add Your Children",
    description: "Create profiles for each child you transport regularly.",
  },
  {
    number: "2",
    title: "Set Destinations",
    description:
      "Add schools, daycares, and other drop-off locations with geofences.",
  },
  {
    number: "3",
    title: "Drive & Monitor",
    description:
      "SafeStop automatically detects stops and prompts you to confirm child safety.",
  },
  {
    number: "4",
    title: "Confirm & Stay Safe",
    description:
      "Take a photo or confirm that all children have exited the vehicle safely.",
  },
];

export default function AboutScreen() {
  const router = useRouter();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 pt-4 pb-2">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Text className="text-primary-400 text-base font-semibold">
              Back
            </Text>
          </Pressable>
          <Text className="text-white text-xl font-bold flex-1">About</Text>
        </View>

        {/* Logo */}
        <View className="items-center mt-8 mb-2">
          <ShieldLogo size="lg" />
        </View>

        {/* Version */}
        <View className="items-center mb-8">
          <Text className="text-dark-400 text-sm mt-2">Version 1.0.0</Text>
        </View>

        {/* How SafeStop Works */}
        <View className="px-6 mb-6">
          <Text className="text-white text-lg font-semibold mb-4">
            How SafeStop Works
          </Text>
          {STEPS.map((step) => (
            <View key={step.number} className="flex-row mb-4">
              <View className="w-8 h-8 rounded-full bg-primary-500/20 items-center justify-center mr-3 mt-0.5">
                <Text className="text-primary-400 text-sm font-bold">
                  {step.number}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white text-base font-semibold">
                  {step.title}
                </Text>
                <Text className="text-dark-400 text-sm mt-0.5 leading-5">
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Safety Disclaimer */}
        <View className="px-6 mb-6">
          <View className="bg-warning-500/10 border border-warning-500/20 rounded-xl p-4">
            <Text className="text-warning-500 text-sm font-semibold mb-2">
              Safety Disclaimer
            </Text>
            <Text className="text-dark-300 text-sm leading-5">
              SafeStop is a safety support tool designed to help prevent
              children from being left unattended in vehicles. It is not a
              guaranteed life-saving device. Always visually check your vehicle
              before walking away.
            </Text>
          </View>
        </View>

        {/* Links */}
        <View className="px-6 mb-6">
          <View className="bg-dark-800 rounded-2xl overflow-hidden">
            <Pressable
              onPress={() => openLink("https://safestop.app/privacy")}
              className="flex-row items-center justify-between py-3.5 px-5 border-b border-dark-700/50 active:bg-dark-700"
            >
              <Text className="text-white text-base">Privacy Policy</Text>
              <Text className="text-dark-500 text-sm">&rsaquo;</Text>
            </Pressable>
            <Pressable
              onPress={() => openLink("https://safestop.app/terms")}
              className="flex-row items-center justify-between py-3.5 px-5 border-b border-dark-700/50 active:bg-dark-700"
            >
              <Text className="text-white text-base">Terms of Service</Text>
              <Text className="text-dark-500 text-sm">&rsaquo;</Text>
            </Pressable>
            <Pressable
              onPress={() => openLink("mailto:help@safestop.app")}
              className="flex-row items-center justify-between py-3.5 px-5 active:bg-dark-700"
            >
              <Text className="text-white text-base">Support</Text>
              <Text className="text-dark-400 text-sm">help@safestop.app</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center mt-4 mb-4">
          <Text className="text-dark-500 text-sm">
            Made with {"\u2764\uFE0F"} for family safety
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
