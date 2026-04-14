import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

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
      return {
        bg: "bg-safe-500/20",
        text: "text-safe-500",
        avatarBg: "bg-safe-500/15",
        avatarText: "text-safe-400",
        accent: "bg-safe-500",
      };
    case "active":
      return {
        bg: "bg-warning-500/20",
        text: "text-warning-500",
        avatarBg: "bg-warning-500/15",
        avatarText: "text-warning-400",
        accent: "bg-warning-500",
      };
    case "no-session":
      return {
        bg: "bg-dark-600/40",
        text: "text-dark-400",
        avatarBg: "bg-primary-500/15",
        avatarText: "text-primary-400",
        accent: "bg-dark-600",
      };
  }
}

// -- Pulse dot component --
function PulseDot() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      className="w-3 h-3 rounded-full bg-warning-500"
    />
  );
}

// -- Activity timeline dot --
function ActivityDot({ type }: { type: string }) {
  const color =
    type === "confirmed"
      ? "bg-safe-500"
      : type === "started"
        ? "bg-primary-500"
        : "bg-dark-400";
  return (
    <View className="items-center mt-0.5">
      <View className={`w-3 h-3 rounded-full ${color}`} />
      <View className="w-0.5 flex-1 bg-dark-700 mt-1" />
    </View>
  );
}

// -- Glow ring for Check In button --
function GlowRing({ active }: { active: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.3,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [scale, opacity]);

  return (
    <Animated.View
      className={`absolute w-44 h-44 rounded-full ${active ? "bg-danger-500" : "bg-primary-500"}`}
      style={{ transform: [{ scale }], opacity }}
    />
  );
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
              <View className="w-9 h-9 rounded-xl bg-primary-500 items-center justify-center">
                <Text className="text-white text-sm font-bold">S</Text>
              </View>
              <Text className="text-white text-xl font-bold tracking-tight">
                SafeStop
              </Text>
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
                    <View
                      className={`w-12 h-12 rounded-full ${colors.avatarBg} items-center justify-center`}
                    >
                      <Text
                        className={`${colors.avatarText} text-lg font-bold`}
                      >
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
        <View className="items-center mt-6 mb-4">
          <View className="items-center justify-center">
            <GlowRing active={!!activeSession} />
            <GlowRing active={!!activeSession} />
            <TouchableOpacity
              onPress={handleCheckIn}
              activeOpacity={0.8}
              className={`w-44 h-44 rounded-full items-center justify-center ${
                activeSession ? "bg-danger-500" : "bg-primary-500"
              }`}
              style={{
                shadowColor: activeSession ? "#EF4444" : "#6366F1",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 16,
              }}
            >
              <Text className="text-white text-3xl mb-1">
                {activeSession ? "\u2713" : "\u25B6"}
              </Text>
              <Text className="text-white text-lg font-bold">
                {activeSession ? "End Trip" : "Check In"}
              </Text>
              <Text className="text-white/70 text-xs mt-1">
                {activeSession ? "Tap to confirm safe" : "Start a trip session"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* -- Active Session Card -- */}
        {activeSession && (
          <View
            className="mx-5 mt-2 bg-dark-800 rounded-2xl overflow-hidden"
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
                  <PulseDot />
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
            {
              label: "Today's trips",
              value: "2",
              color: "text-primary-400",
              accent: "bg-primary-500",
            },
            {
              label: "Confirmations",
              value: "2",
              color: "text-safe-500",
              accent: "bg-safe-500",
            },
            {
              label: "Alerts",
              value: "0",
              color: "text-dark-300",
              accent: "bg-dark-600",
            },
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
                <Text className={`text-2xl font-bold ${stat.color}`}>
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
            <View key={item.id} className="flex-row gap-3 min-h-[56px]">
              <ActivityDot type={item.type} />
              <View
                className={`flex-1 pb-4 ${
                  idx < RECENT_ACTIVITY.length - 1
                    ? "border-b border-dark-700/50 mb-1"
                    : ""
                }`}
              >
                <Text className="text-dark-200 text-sm leading-5">
                  {item.text}
                </Text>
                <Text className="text-dark-500 text-xs mt-1.5">
                  {item.time}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
