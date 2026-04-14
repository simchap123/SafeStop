import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

function ToggleRow({
  label,
  subtitle,
  value,
  onToggle,
}: {
  label: string;
  subtitle?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between py-3.5 px-5 border-b border-dark-700/50">
      <View className="flex-1 mr-4">
        <Text className="text-white text-base">{label}</Text>
        {subtitle && (
          <Text className="text-dark-400 text-xs mt-0.5">{subtitle}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#334155", true: "#6366F1" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-3 mt-6 px-5">
      {title}
    </Text>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();

  // Per-category toggles
  const [tripCheckIn, setTripCheckIn] = useState(true);
  const [stopConfirmation, setStopConfirmation] = useState(true);
  const [missedConfirmation, setMissedConfirmation] = useState(true);
  const [caregiverUpdates, setCaregiverUpdates] = useState(true);
  const [offlineWarnings, setOfflineWarnings] = useState(true);

  // General toggles
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);

  // Quiet hours
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart] = useState("10:00 PM");
  const [quietEnd] = useState("7:00 AM");

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
            Notifications
          </Text>
        </View>

        {/* Alert Categories */}
        <SectionHeader title="Alert Categories" />
        <View className="bg-dark-800 rounded-2xl mx-5 overflow-hidden">
          <ToggleRow
            label="Trip Check-in Reminders"
            subtitle="Reminders when a trip session starts"
            value={tripCheckIn}
            onToggle={setTripCheckIn}
          />
          <ToggleRow
            label="Stop Confirmation Prompts"
            subtitle="Prompts when a vehicle stop is detected"
            value={stopConfirmation}
            onToggle={setStopConfirmation}
          />
          <ToggleRow
            label="Missed Confirmation Alerts"
            subtitle="Alerts when a confirmation is not completed"
            value={missedConfirmation}
            onToggle={setMissedConfirmation}
          />
          <ToggleRow
            label="Caregiver Updates"
            subtitle="Notifications about caregiver activity"
            value={caregiverUpdates}
            onToggle={setCaregiverUpdates}
          />
          <ToggleRow
            label="Offline Warnings"
            subtitle="Alerts when device loses connectivity"
            value={offlineWarnings}
            onToggle={setOfflineWarnings}
          />
        </View>

        {/* Sound & Vibration */}
        <SectionHeader title="Sound & Vibration" />
        <View className="bg-dark-800 rounded-2xl mx-5 overflow-hidden">
          <ToggleRow
            label="Sound"
            subtitle="Play sounds for notifications"
            value={sound}
            onToggle={setSound}
          />
          <ToggleRow
            label="Vibration"
            subtitle="Vibrate for notifications"
            value={vibration}
            onToggle={setVibration}
          />
        </View>

        {/* Quiet Hours */}
        <SectionHeader title="Quiet Hours" />
        <View className="bg-dark-800 rounded-2xl mx-5 overflow-hidden">
          <ToggleRow
            label="Enable Quiet Hours"
            subtitle="Silence non-critical notifications during set hours"
            value={quietHoursEnabled}
            onToggle={setQuietHoursEnabled}
          />
          {quietHoursEnabled && (
            <View className="px-5 pb-4">
              <View className="flex-row gap-3 mt-1">
                <View className="flex-1">
                  <Text className="text-dark-400 text-xs mb-1.5">Start</Text>
                  <Pressable className="bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 items-center">
                    <Text className="text-white text-base">{quietStart}</Text>
                  </Pressable>
                </View>
                <View className="flex-1">
                  <Text className="text-dark-400 text-xs mb-1.5">End</Text>
                  <Pressable className="bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 items-center">
                    <Text className="text-white text-base">{quietEnd}</Text>
                  </Pressable>
                </View>
              </View>
              <Text className="text-dark-500 text-xs mt-2">
                Critical safety alerts will still come through during quiet
                hours.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
