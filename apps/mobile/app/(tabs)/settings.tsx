import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// ── Mock data ──────────────────────────────────────────────
const PROFILE = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  initials: "SJ",
};

const FAMILY = {
  name: "Johnson Family",
  members: 4,
};

const CHILDREN_LIST = [
  { id: "1", name: "Emma", age: 7, school: "Sunnyvale Elementary" },
  { id: "2", name: "Lucas", age: 10, school: "Westfield Middle" },
];

// ── Section component ──────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-3 mt-6 px-5">
      {title}
    </Text>
  );
}

function Row({
  label,
  value,
  onPress,
  chevron = false,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      className="flex-row items-center justify-between py-3.5 px-5 border-b border-dark-700/50"
    >
      <Text className="text-white text-base">{label}</Text>
      <View className="flex-row items-center gap-2">
        {value && <Text className="text-dark-400 text-sm">{value}</Text>}
        {chevron && <Text className="text-dark-500 text-sm">›</Text>}
      </View>
    </TouchableOpacity>
  );
}

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

// ── Main Screen ────────────────────────────────────────────
export default function SettingsScreen() {
  const router = useRouter();
  const [autoCheckIn, setAutoCheckIn] = useState(true);
  const [photoOptional, setPhotoOptional] = useState(false);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => router.push("/"),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-white text-2xl font-bold">Settings</Text>
        </View>

        {/* ── Profile ──────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/profile")}
          className="items-center mt-4 mb-2"
        >
          <View className="w-20 h-20 rounded-full bg-primary-500/20 items-center justify-center mb-3">
            <Text className="text-primary-400 text-2xl font-bold">
              {PROFILE.initials}
            </Text>
          </View>
          <Text className="text-white text-xl font-semibold">{PROFILE.name}</Text>
          <Text className="text-dark-400 text-sm mt-1">{PROFILE.email}</Text>
          <Text className="text-primary-400 text-xs mt-2 font-medium">
            Edit Profile
          </Text>
        </TouchableOpacity>

        {/* ── Family ───────────────────────────── */}
        <SectionHeader title="Family" />
        <View className="bg-dark-800 rounded-2xl mx-5 overflow-hidden">
          <Row label="Family Name" value={FAMILY.name} />
          <Row label="Members" value={`${FAMILY.members} people`} />
          <Row
            label="Manage Family"
            chevron
            onPress={() => router.push("/family")}
          />
        </View>

        {/* ── Children ─────────────────────────── */}
        <SectionHeader title="Children" />
        <View className="bg-dark-800 rounded-2xl mx-5 overflow-hidden">
          {CHILDREN_LIST.map((child) => (
            <TouchableOpacity
              key={child.id}
              activeOpacity={0.7}
              onPress={() => router.push(`/child/${child.id}`)}
              className="flex-row items-center justify-between py-3.5 px-5 border-b border-dark-700/50"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-full bg-primary-500/20 items-center justify-center">
                  <Text className="text-primary-400 text-sm font-bold">
                    {child.name[0]}
                  </Text>
                </View>
                <View>
                  <Text className="text-white text-base">{child.name}</Text>
                  <Text className="text-dark-400 text-xs">
                    Age {child.age} — {child.school}
                  </Text>
                </View>
              </View>
              <Text className="text-dark-500 text-sm">›</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/child")}
            className="flex-row items-center gap-2 py-3.5 px-5"
          >
            <View className="w-9 h-9 rounded-full bg-dark-700 items-center justify-center">
              <Text className="text-primary-400 text-lg">+</Text>
            </View>
            <Text className="text-primary-400 text-base font-medium">
              Manage Children
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Destinations ─────────────────────── */}
        <SectionHeader title="Destinations" />
        <View className="bg-dark-800 rounded-2xl mx-5 overflow-hidden">
          <Row
            label="Manage Destinations"
            chevron
            onPress={() => router.push("/destination")}
          />
        </View>

        {/* ── Preferences ──────────────────────── */}
        <SectionHeader title="Preferences" />
        <View className="bg-dark-800 rounded-2xl mx-5 overflow-hidden">
          <ToggleRow
            label="Auto Check-In"
            subtitle="Automatically start sessions based on location"
            value={autoCheckIn}
            onToggle={setAutoCheckIn}
          />
          <ToggleRow
            label="Photo Optional"
            subtitle="Allow confirmations without a photo"
            value={photoOptional}
            onToggle={setPhotoOptional}
          />
          <Row
            label="Notifications"
            chevron
            onPress={() => router.push("/notifications")}
          />
          <Row
            label="Subscription"
            chevron
            onPress={() => router.push("/subscription")}
          />
        </View>

        {/* ── App Info ─────────────────────────── */}
        <SectionHeader title="App" />
        <View className="bg-dark-800 rounded-2xl mx-5 overflow-hidden">
          <Row
            label="About"
            value="v1.0.0"
            chevron
            onPress={() => router.push("/about")}
          />
        </View>

        {/* ── Sign Out ─────────────────────────── */}
        <View className="mx-5 mt-8 mb-10">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSignOut}
            className="bg-danger-500/15 border border-danger-500/30 rounded-2xl py-4 items-center"
          >
            <Text className="text-danger-500 text-base font-semibold">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
