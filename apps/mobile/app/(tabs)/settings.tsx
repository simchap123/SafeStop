import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { showAlert } from "../../lib/alert";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApp } from "../../lib/store";

// -- Helpers --
function computeAge(dateOfBirth?: string): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

// -- Section component --
function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-3 mt-6 px-4">
      {title}
    </Text>
  );
}

function Row({
  label,
  value,
  onPress,
  chevron = false,
  icon,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      className="flex-row items-center justify-between py-3.5 px-4 border-b border-dark-700/50"
      style={{ minHeight: 48 }}
    >
      <View className="flex-row items-center gap-3">
        {icon && <Ionicons name={icon} size={20} color="#94A3B8" />}
        <Text className="text-white text-base">{label}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value && <Text className="text-dark-400 text-sm">{value}</Text>}
        {chevron && <Ionicons name="chevron-forward" size={16} color="#64748B" />}
      </View>
    </TouchableOpacity>
  );
}

function ToggleRow({
  label,
  subtitle,
  value,
  onToggle,
  icon,
}: {
  label: string;
  subtitle?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View
      className="flex-row items-center justify-between py-3.5 px-4 border-b border-dark-700/50"
      style={{ minHeight: 48 }}
    >
      <View className="flex-row items-center gap-3 flex-1 mr-4">
        {icon && <Ionicons name={icon} size={20} color="#94A3B8" />}
        <View className="flex-1">
          <Text className="text-white text-base">{label}</Text>
          {subtitle && (
            <Text className="text-dark-400 text-xs mt-0.5">{subtitle}</Text>
          )}
        </View>
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

// -- Main Screen --
export default function SettingsScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();

  const user = state.auth.user;
  const family = state.auth.family;
  const children = state.children;

  const profileName = user?.displayName ?? "Unknown";
  const profileEmail = user?.email ?? "";
  const familyName = family?.name ?? "No Family";
  const memberCount = family?.members?.length ?? 0;

  const handleSignOut = () => {
    showAlert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          dispatch({ type: "LOGOUT" });
          router.push("/");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-white text-2xl font-bold">Settings</Text>
        </View>

        {/* -- Profile -- */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/profile")}
          className="items-center mt-4 mb-2"
        >
          <View className="w-20 h-20 rounded-full bg-primary-500/20 items-center justify-center mb-3">
            <Ionicons name="person" size={32} color="#818CF8" />
          </View>
          <Text className="text-white text-xl font-semibold">{profileName}</Text>
          <Text className="text-dark-400 text-sm mt-1">{profileEmail}</Text>
          <Text className="text-primary-400 text-xs mt-2 font-medium">
            Edit Profile
          </Text>
        </TouchableOpacity>

        {/* -- Account -- */}
        <SectionHeader title="Account" />
        <View className="bg-dark-800 border border-dark-700 rounded-2xl mx-4 overflow-hidden">
          <Row label="Profile" icon="person-outline" chevron onPress={() => router.push("/profile")} />
          <Row label="Family" icon="people-outline" value={familyName} chevron onPress={() => router.push("/family")} />
          <Row label="Members" icon="people-outline" value={`${memberCount} people`} />
        </View>

        {/* -- Children -- */}
        <SectionHeader title="Children" />
        <View className="bg-dark-800 border border-dark-700 rounded-2xl mx-4 overflow-hidden">
          {children.map((child) => {
            const age = computeAge(child.dateOfBirth);
            return (
              <TouchableOpacity
                key={child.id}
                activeOpacity={0.7}
                onPress={() => router.push(`/child/${child.id}`)}
                className="flex-row items-center justify-between py-3.5 px-4 border-b border-dark-700/50"
                style={{ minHeight: 48 }}
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name="body-outline" size={20} color="#94A3B8" />
                  <View>
                    <Text className="text-white text-base">{child.name}</Text>
                    <Text className="text-dark-400 text-xs">
                      {age !== null ? `Age ${age}` : ""}
                      {child.notes ? ` \u2014 ${child.notes}` : ""}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#64748B" />
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/child")}
            className="flex-row items-center gap-3 py-3.5 px-4"
            style={{ minHeight: 48 }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#818CF8" />
            <Text className="text-primary-400 text-base font-medium">
              Manage Children
            </Text>
          </TouchableOpacity>
        </View>

        {/* -- Destinations -- */}
        <SectionHeader title="Destinations" />
        <View className="bg-dark-800 border border-dark-700 rounded-2xl mx-4 overflow-hidden">
          <Row
            label="Manage Destinations"
            icon="location-outline"
            chevron
            onPress={() => router.push("/destination")}
          />
        </View>

        {/* -- Preferences -- */}
        <SectionHeader title="Preferences" />
        <View className="bg-dark-800 border border-dark-700 rounded-2xl mx-4 overflow-hidden">
          <ToggleRow
            label="Auto Check-In"
            subtitle="Automatically start sessions based on location"
            icon="location-outline"
            value={state.settings.autoCheckin}
            onToggle={(v) => dispatch({ type: "UPDATE_SETTINGS", payload: { autoCheckin: v } })}
          />
          <ToggleRow
            label="Photo Optional"
            subtitle="Allow confirmations without a photo"
            icon="camera-outline"
            value={state.settings.photoOptional}
            onToggle={(v) => dispatch({ type: "UPDATE_SETTINGS", payload: { photoOptional: v } })}
          />
          <Row
            label="Notifications"
            icon="notifications-outline"
            chevron
            onPress={() => router.push("/notifications")}
          />
          <Row
            label="Subscription"
            icon="card-outline"
            chevron
            onPress={() => router.push("/subscription")}
          />
        </View>

        {/* -- App Info -- */}
        <SectionHeader title="App" />
        <View className="bg-dark-800 border border-dark-700 rounded-2xl mx-4 overflow-hidden">
          <Row
            label="About"
            icon="information-circle-outline"
            value="v1.0.0"
            chevron
            onPress={() => router.push("/about")}
          />
        </View>

        {/* -- Sign Out -- */}
        <View className="mx-4 mt-8 mb-10">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSignOut}
            className="bg-danger-500/15 border border-danger-500/30 rounded-2xl h-14 flex-row items-center justify-center gap-2"
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-danger-500 text-base font-semibold">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
