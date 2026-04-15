import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApp } from "../../lib/store";

type EndReason =
  | "dropped_off"
  | "no_child"
  | "false_trigger"
  | null;

export default function EndSessionScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [selectedReason, setSelectedReason] = useState<EndReason>(null);
  const [confirmed, setConfirmed] = useState(false);

  const child = state.children.find((c) => c.id === state.session?.childId);
  const childName = child?.name ?? "Child";
  const childInitials = childName.slice(0, 2).toUpperCase();

  const reasons = [
    {
      id: "dropped_off" as EndReason,
      icon: "checkmark-circle" as const,
      color: "#22C55E",
      title: "Child was dropped off safely",
      description: "I confirmed my child is out of the vehicle",
    },
    {
      id: "no_child" as EndReason,
      icon: "person-remove-outline" as const,
      color: "#6366F1",
      title: "No child was with me",
      description: "This was a trip without my child",
    },
    {
      id: "false_trigger" as EndReason,
      icon: "close-circle-outline" as const,
      color: "#F59E0B",
      title: "False trigger / testing",
      description: "The session was started by mistake",
    },
  ];

  function handleConfirm() {
    if (!selectedReason) return;

    if (selectedReason === "dropped_off") {
      // If they haven't confirmed with photo yet, send to stop-detected
      router.replace("/(session)/stop-detected");
    } else {
      // No child or false trigger — end session directly
      dispatch({ type: 'END_SESSION' });
      setConfirmed(true);
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1500);
    }
  }

  if (confirmed) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center">
        <View className="w-20 h-20 rounded-full bg-safe-500 items-center justify-center mb-4">
          <Ionicons name="checkmark" size={40} color="#FFFFFF" />
        </View>
        <Text className="text-white text-xl font-semibold">Session Ended</Text>
        <Text className="text-dark-400 text-sm mt-2">Returning to home...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="px-4 pt-4 pb-2 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Ionicons name="chevron-back" size={24} color="#6366F1" />
          <Text className="text-primary-500 text-base ml-1">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Title */}
        <View className="mt-4 mb-2">
          <Text className="text-white text-2xl font-bold">End Session</Text>
          <Text className="text-dark-400 text-base mt-2">
            Please tell us why you're ending this session.
          </Text>
        </View>

        {/* Safety reminder */}
        <View className="bg-warning-500/10 border border-warning-500/20 rounded-2xl p-4 mt-4 mb-6 flex-row items-start gap-3">
          <Ionicons name="shield-checkmark" size={24} color="#F59E0B" />
          <View className="flex-1">
            <Text className="text-warning-500 font-semibold text-sm">Safety Check</Text>
            <Text className="text-dark-300 text-sm mt-1">
              If your child is still in the vehicle, please confirm their safety before ending the session.
            </Text>
          </View>
        </View>

        {/* Reason selection */}
        <View className="gap-3">
          {reasons.map((reason) => (
            <TouchableOpacity
              key={reason.id}
              onPress={() => setSelectedReason(reason.id)}
              className={`border rounded-2xl p-4 flex-row items-center gap-4 ${
                selectedReason === reason.id
                  ? "border-primary-500 bg-primary-500/10"
                  : "border-dark-700 bg-dark-800"
              }`}
              activeOpacity={0.7}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: reason.color + "20" }}
              >
                <Ionicons name={reason.icon} size={24} color={reason.color} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">
                  {reason.title}
                </Text>
                <Text className="text-dark-400 text-sm mt-1">
                  {reason.description}
                </Text>
              </View>
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  selectedReason === reason.id
                    ? "border-primary-500 bg-primary-500"
                    : "border-dark-500"
                }`}
              >
                {selectedReason === reason.id && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Child info */}
        <View className="bg-dark-800 border border-dark-700 rounded-2xl p-4 mt-6 flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center">
            <Text className="text-white font-bold text-sm">{childInitials}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-medium">{childName}</Text>
            <Text className="text-dark-400 text-sm">Active session</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={14} color="#94A3B8" />
            <Text className="text-dark-400 text-sm">Session active</Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm button */}
      <View className="px-4 pb-6 pt-4">
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={!selectedReason}
          className={`h-14 rounded-xl items-center justify-center flex-row gap-2 ${
            selectedReason
              ? "bg-primary-500"
              : "bg-dark-700"
          }`}
          activeOpacity={0.8}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={selectedReason ? "#FFFFFF" : "#64748B"}
          />
          <Text
            className={`font-bold text-base ${
              selectedReason ? "text-white" : "text-dark-500"
            }`}
          >
            Confirm & End Session
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
