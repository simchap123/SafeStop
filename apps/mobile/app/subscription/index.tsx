import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

type Plan = "free" | "paid";

interface Feature {
  label: string;
  free: boolean;
  paid: boolean;
}

const FEATURES: Feature[] = [
  { label: "1 child profile", free: true, paid: true },
  { label: "2 destinations", free: true, paid: true },
  { label: "Trip monitoring & alerts", free: true, paid: true },
  { label: "Photo confirmations", free: true, paid: true },
  { label: "24-hour trip history", free: true, paid: true },
  { label: "Up to 3 children", free: false, paid: true },
  { label: "Up to 10 destinations", free: false, paid: true },
  { label: "30-day trip history", free: false, paid: true },
  { label: "Priority support", free: false, paid: true },
  { label: "Advanced analytics", free: false, paid: true },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [currentPlan] = useState<Plan>("free");

  const handleUpgrade = () => {
    Alert.alert(
      "Upgrade to SafeStop+",
      "You will be charged $1.99/month. You can cancel anytime.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Upgrade", onPress: () => {} },
      ]
    );
  };

  const handleManage = () => {
    Alert.alert("Manage Subscription", "Opening subscription management...");
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
          <Text className="text-white text-xl font-bold flex-1">
            Subscription
          </Text>
        </View>

        {/* Current Plan */}
        <View className="px-6 mt-6 mb-6">
          <View className="bg-dark-800 border border-dark-700 rounded-2xl p-5 items-center">
            <Text className="text-dark-400 text-sm font-medium mb-1">
              Current Plan
            </Text>
            <Text className="text-white text-2xl font-bold">
              {currentPlan === "free" ? "Free" : "SafeStop+"}
            </Text>
            {currentPlan === "paid" && (
              <Text className="text-primary-400 text-sm mt-1">
                $1.99 / month
              </Text>
            )}
          </View>
        </View>

        {/* Retention Info */}
        <View className="px-6 mb-6">
          <View className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
            <Text className="text-primary-400 text-sm font-semibold mb-2">
              Trip History Retention
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="items-center flex-1">
                <Text className="text-dark-400 text-xs mb-1">Free</Text>
                <Text className="text-white text-base font-bold">
                  24 hours
                </Text>
              </View>
              <View className="w-px h-8 bg-dark-700" />
              <View className="items-center flex-1">
                <Text className="text-dark-400 text-xs mb-1">Paid</Text>
                <Text className="text-primary-400 text-base font-bold">
                  30 days
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Features Comparison */}
        <View className="px-6 mb-8">
          <Text className="text-dark-300 text-sm font-medium mb-3">
            Feature Comparison
          </Text>

          {/* Column Headers */}
          <View className="flex-row items-center mb-2 px-4">
            <Text className="text-dark-400 text-xs flex-1">Feature</Text>
            <Text className="text-dark-400 text-xs w-14 text-center">Free</Text>
            <Text className="text-primary-400 text-xs w-14 text-center">
              Paid
            </Text>
          </View>

          {FEATURES.map((feature, index) => (
            <View
              key={index}
              className={`flex-row items-center px-4 py-3 rounded-lg ${
                index % 2 === 0 ? "bg-dark-800" : ""
              }`}
            >
              <Text className="text-white text-sm flex-1">{feature.label}</Text>
              <View className="w-14 items-center">
                {feature.free ? (
                  <Ionicons name="checkmark" size={18} color="#22C55E" />
                ) : (
                  <Text className="text-dark-600 text-base">--</Text>
                )}
              </View>
              <View className="w-14 items-center">
                {feature.paid ? (
                  <Ionicons name="checkmark" size={18} color="#22C55E" />
                ) : (
                  <Text className="text-dark-600 text-base">--</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <View className="px-6">
          {currentPlan === "free" ? (
            <Pressable
              onPress={handleUpgrade}
              className="bg-primary-500 rounded-2xl py-4 items-center active:bg-primary-600"
            >
              <Text className="text-white text-base font-semibold">
                Upgrade to SafeStop+ — $1.99/mo
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleManage}
              className="bg-dark-800 border border-dark-700 rounded-2xl py-4 items-center active:bg-dark-700"
            >
              <Text className="text-white text-base font-semibold">
                Manage Subscription
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
