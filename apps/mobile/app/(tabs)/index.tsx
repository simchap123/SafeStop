import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

// -- Mock Data --
const CHILDREN = [
  {
    id: "1",
    name: "Emma",
    status: "safe" as const,
    lastConfirmation: "8:42 AM",
  },
  {
    id: "2",
    name: "Lucas",
    status: "no-session" as const,
    lastConfirmation: "Yesterday, 3:15 PM",
  },
];

const RECENT_ACTIVITY = [
  {
    id: "1",
    text: "Emma confirmed safe at Sunnyvale Elementary",
    time: "8:42 AM",
    type: "confirmed",
  },
  {
    id: "2",
    text: "Trip started \u2014 Emma, morning drop-off",
    time: "8:15 AM",
    type: "started",
  },
  {
    id: "3",
    text: "Lucas confirmed safe at Soccer Practice",
    time: "Yesterday 3:15 PM",
    type: "confirmed",
  },
];

// -- Status helpers --
function statusLabel(s: "safe" | "active" | "no-session") {
  switch (s) {
    case "safe":
      return "Safe";
    case "active":
      return "Active Session";
    case "no-session":
      return "No Session";
  }
}

function statusColors(s: "safe" | "active" | "no-session") {
  switch (s) {
    case "safe":
      return { bg: "bg-safe-500/20", text: "text-safe-500", accent: "bg-safe-500" };
    case "active":
      return { bg: "bg-warning-500/20", text: "text-warning-500", accent: "bg-warning-500" };
    case "no-session":
      return { bg: "bg-dark-600/40", text: "text-dark-400", accent: "bg-dark-600" };
  }
}

// -- Activity icon --
function ActivityIcon({ type }: { type: string }) {
  if (type === "confirmed") {
    return <Ionicons name="checkmark-circle" size={18} color="#22C55E" />;
  }
  if (type === "started") {
    return <Ionicons name="play-circle" size={18} color="#6366F1" />;
  }
  return <Ionicons name="ellipse" size={18} color="#475569" />;
}

// -- Main Screen --
export default function HomeScreen() {
  const router = useRouter();
  const [activeSession, setActiveSession] = useState<{
    childName: string;
    startedAt: number;
  } | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - activeSession.startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleCheckIn = () => {
    router.push("/(session)/checkin");
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* -- Header -- */}
        <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-2.5 mb-1">
              <View
                className="w-9 h-9 rounded-xl bg-primary-500 items-center justify-center"
                style={{
                  shadowColor: "#6366F1",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
              </View>
              <Text className="text-white text-xl font-bold tracking-tight">SafeStop</Text>
            </View>
            <Text className="text-dark-300 text-base mt-0.5">
              {greeting}, Sarah
            </Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-dark-700 items-center justify-center border border-dark-600">
            <Text className="text-white text-sm font-semibold">SA</Text>
          </View>
        </View>

        {/* -- Child Cards -- */}
        <View className="px-5 mt-5">
          <Text className="text-white text-base font-semibold mb-3">
            Your Children
          </Text>
          {CHILDREN.map((child) => {
            const colors = statusColors(child.status);
            return (
              <View
                key={child.id}
                className="bg-dark-800 rounded-2xl mb-3 overflow-hidden"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                {/* Colored top accent bar */}
                <View className={`h-1 ${colors.accent}`} />
                <View className="p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="w-12 h-12 rounded-full bg-primary-500/15 items-center justify-center">
                      <Text className="text-primary-400 text-lg font-bold">
                        {child.name[0]}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white text-base font-semibold">
                        {child.name}
                      </Text>
                      <Text className="text-dark-400 text-xs mt-0.5">
                        Last: {child.lastConfirmation}
                      </Text>
                    </View>
                  </View>
                  <View className={`px-3 py-1.5 rounded-full ${colors.bg}`}>
                    <Text className={`text-xs font-semibold ${colors.text}`}>
                      {statusLabel(child.status)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* -- Check In Button -- */}
        <View className="px-5 mt-5 mb-2">
          <TouchableOpacity
            onPress={handleCheckIn}
            activeOpacity={0.8}
            className={`h-16 rounded-2xl flex-row items-center justify-center gap-3 ${
              activeSession ? "bg-danger-500" : "bg-primary-500"
            }`}
            style={{
              shadowColor: activeSession ? "#EF4444" : "#6366F1",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.45,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <Ionicons
              name={activeSession ? "checkmark-circle-outline" : "play-circle-outline"}
              size={26}
              color="#FFFFFF"
            />
            <View>
              <Text className="text-white text-lg font-bold">
                {activeSession ? "End Trip" : "Check In"}
              </Text>
              <Text className="text-white/60 text-xs">
                {activeSession ? "Tap to confirm safe" : "Start a trip session"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* -- Active Session Card -- */}
        {activeSession && (
          <View
            className="mx-5 mt-4 bg-dark-800 rounded-2xl overflow-hidden"
            style={{
              shadowColor: "#F59E0B",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="h-1 bg-warning-500" />
            <View className="p-4">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="radio-button-on" size={14} color="#F59E0B" />
                  <Text className="text-warning-500 text-sm font-semibold">
                    Active Session
                  </Text>
                </View>
                <View className="bg-warning-500/10 px-3 py-1 rounded-lg">
                  <Text className="text-white text-lg font-bold">
                    {formatElapsed(elapsed)}
                  </Text>
                </View>
              </View>
              <Text className="text-white text-base font-medium">
                {activeSession.childName} \u2014 Morning drop-off
              </Text>
              <Text className="text-dark-400 text-xs mt-1">
                Sunnyvale Elementary
              </Text>
            </View>
          </View>
        )}

        {/* -- Quick Stats -- */}
        <View className="flex-row mx-5 mt-6 gap-3">
          {[
            { label: "Today's trips", value: "2", icon: "location-outline" as const, color: "#818CF8", accent: "bg-primary-500" },
            { label: "Confirmations", value: "2", icon: "camera-outline" as const, color: "#22C55E", accent: "bg-safe-500" },
            { label: "Alerts", value: "0", icon: "alert-circle-outline" as const, color: "#94A3B8", accent: "bg-dark-600" },
          ].map((stat) => (
            <View
              key={stat.label}
              className="flex-1 bg-dark-800 rounded-xl overflow-hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className={`h-1 ${stat.accent}`} />
              <View className="p-3 items-center">
                <Ionicons name={stat.icon} size={20} color={stat.color} style={{ marginBottom: 6 }} />
                <Text className="text-2xl font-bold text-white">
                  {stat.value}
                </Text>
                <Text className="text-dark-400 text-[10px] mt-1 text-center">
                  {stat.label}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* -- Recent Activity -- */}
        <View className="px-5 mt-6 mb-8">
          <Text className="text-white text-base font-semibold mb-4">
            Recent Activity
          </Text>
          {RECENT_ACTIVITY.map((item, idx) => (
            <View key={item.id} className="flex-row gap-3 min-h-[52px]">
              <View className="items-center mt-0.5">
                <ActivityIcon type={item.type} />
                {idx < RECENT_ACTIVITY.length - 1 && (
                  <View className="w-0.5 flex-1 bg-dark-700/50 mt-1.5" />
                )}
              </View>
              <View
                className={`flex-1 pb-4 ${
                  idx < RECENT_ACTIVITY.length - 1
                    ? "border-b border-dark-700/30 mb-1"
                    : ""
                }`}
              >
                <Text className="text-dark-200 text-sm leading-5">{item.text}</Text>
                <Text className="text-dark-500 text-xs mt-1.5">{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
