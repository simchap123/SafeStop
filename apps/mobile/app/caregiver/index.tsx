import React, { useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type Role = "Primary" | "Caregiver" | "Viewer";
type InviteStatus = "Accepted" | "Pending";

interface NotificationPrefs {
  tripStart: boolean;
  confirmation: boolean;
  missedConfirmation: boolean;
  offline: boolean;
}

interface CaregiverItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: InviteStatus;
  notifications: NotificationPrefs;
}

const ROLE_STYLES: Record<Role, { bg: string; text: string }> = {
  Primary: { bg: "bg-primary-500/20", text: "text-primary-400" },
  Caregiver: { bg: "bg-safe-500/20", text: "text-safe-500" },
  Viewer: { bg: "bg-dark-600", text: "text-dark-300" },
};

const STATUS_STYLES: Record<InviteStatus, { bg: string; text: string }> = {
  Accepted: { bg: "bg-safe-500/15", text: "text-safe-500" },
  Pending: { bg: "bg-warning-500/15", text: "text-warning-500" },
};

const MOCK_CAREGIVERS: CaregiverItem[] = [
  {
    id: "c1",
    name: "Sarah Johnson",
    email: "sarah@email.com",
    role: "Primary",
    status: "Accepted",
    notifications: {
      tripStart: true,
      confirmation: true,
      missedConfirmation: true,
      offline: true,
    },
  },
  {
    id: "c2",
    name: "Mike Johnson",
    email: "mike@email.com",
    role: "Caregiver",
    status: "Accepted",
    notifications: {
      tripStart: false,
      confirmation: true,
      missedConfirmation: true,
      offline: false,
    },
  },
  {
    id: "c3",
    name: "Grandma Rose",
    email: "rose@email.com",
    role: "Viewer",
    status: "Accepted",
    notifications: {
      tripStart: false,
      confirmation: false,
      missedConfirmation: true,
      offline: false,
    },
  },
  {
    id: "c4",
    name: "Uncle Dave",
    email: "dave@email.com",
    role: "Caregiver",
    status: "Pending",
    notifications: {
      tripStart: false,
      confirmation: false,
      missedConfirmation: false,
      offline: false,
    },
  },
];

interface NotifToggleProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

function NotifToggle({ label, active, onToggle }: NotifToggleProps) {
  return (
    <Pressable
      onPress={onToggle}
      className={`px-2.5 py-1.5 rounded-lg mr-2 mb-1 ${
        active ? "bg-primary-500/20" : "bg-dark-700"
      }`}
    >
      <Text
        className={`text-xs font-medium ${
          active ? "text-primary-400" : "text-dark-500"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function CaregiverListScreen() {
  const router = useRouter();
  const [caregivers, setCaregivers] =
    useState<CaregiverItem[]>(MOCK_CAREGIVERS);

  const toggleNotification = (
    caregiverId: string,
    key: keyof NotificationPrefs
  ) => {
    setCaregivers((prev) =>
      prev.map((cg) =>
        cg.id === caregiverId
          ? {
              ...cg,
              notifications: {
                ...cg.notifications,
                [key]: !cg.notifications[key],
              },
            }
          : cg
      )
    );
  };

  const renderCaregiver = ({ item }: { item: CaregiverItem }) => {
    const roleStyle = ROLE_STYLES[item.role];
    const statusStyle = STATUS_STYLES[item.status];

    return (
      <View className="bg-dark-800 rounded-2xl p-4 mb-3">
        <View className="flex-row items-center mb-3">
          {/* Avatar */}
          <View className="w-12 h-12 rounded-full bg-dark-600 items-center justify-center mr-3">
            <Text className="text-white text-lg font-bold">
              {item.name[0]}
            </Text>
          </View>

          {/* Info */}
          <View className="flex-1">
            <Text className="text-white text-base font-semibold">
              {item.name}
            </Text>
            <Text className="text-dark-400 text-sm">{item.email}</Text>
          </View>
        </View>

        {/* Badges */}
        <View className="flex-row gap-2 mb-3">
          <View className={`${roleStyle.bg} px-2.5 py-1 rounded-full`}>
            <Text className={`${roleStyle.text} text-xs font-semibold`}>
              {item.role}
            </Text>
          </View>
          <View className={`${statusStyle.bg} px-2.5 py-1 rounded-full`}>
            <Text className={`${statusStyle.text} text-xs font-semibold`}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Notification prefs */}
        {item.status === "Accepted" && (
          <View>
            <Text className="text-dark-400 text-xs font-medium mb-2">
              Notifications
            </Text>
            <View className="flex-row flex-wrap">
              <NotifToggle
                label="Trip Start"
                active={item.notifications.tripStart}
                onToggle={() => toggleNotification(item.id, "tripStart")}
              />
              <NotifToggle
                label="Confirmed"
                active={item.notifications.confirmation}
                onToggle={() => toggleNotification(item.id, "confirmation")}
              />
              <NotifToggle
                label="Missed"
                active={item.notifications.missedConfirmation}
                onToggle={() =>
                  toggleNotification(item.id, "missedConfirmation")
                }
              />
              <NotifToggle
                label="Offline"
                active={item.notifications.offline}
                onToggle={() => toggleNotification(item.id, "offline")}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-6">
        <Text className="text-white text-2xl font-bold">Family Members</Text>
        <Pressable
          onPress={() => router.push("/caregiver/invite")}
          className="bg-primary-500 px-4 py-2 rounded-xl active:bg-primary-600"
        >
          <Text className="text-white font-semibold text-sm">Invite</Text>
        </Pressable>
      </View>

      <FlatList
        data={caregivers}
        renderItem={renderCaregiver}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
