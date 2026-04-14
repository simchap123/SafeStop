import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

// ── Mock data ──────────────────────────────────────────────
interface Alert {
  id: string;
  message: string;
  time: string;
  date: string;
  child: string;
  severity: "critical" | "warning";
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

const INITIAL_ALERTS: Alert[] = [
  {
    id: "1",
    message: "No confirmation received",
    time: "12:34 PM",
    date: "Today",
    child: "Emma",
    severity: "critical",
    resolved: false,
  },
  {
    id: "2",
    message: "Session exceeded 30-minute limit",
    time: "11:15 AM",
    date: "Today",
    child: "Lucas",
    severity: "warning",
    resolved: false,
  },
  {
    id: "3",
    message: "No confirmation received",
    time: "8:45 AM",
    date: "Yesterday",
    child: "Emma",
    severity: "critical",
    resolved: true,
    resolvedBy: "Sarah (manual)",
    resolvedAt: "8:47 AM",
  },
  {
    id: "4",
    message: "Child not detected at destination",
    time: "3:30 PM",
    date: "Mon, Apr 12",
    child: "Lucas",
    severity: "warning",
    resolved: true,
    resolvedBy: "Auto-resolved",
    resolvedAt: "3:32 PM",
  },
  {
    id: "5",
    message: "No confirmation received",
    time: "8:40 AM",
    date: "Mon, Apr 12",
    child: "Emma",
    severity: "critical",
    resolved: true,
    resolvedBy: "Sarah (photo confirmation)",
    resolvedAt: "8:42 AM",
  },
];

function severityIcon(severity: "critical" | "warning", resolved: boolean) {
  if (resolved) {
    return <Ionicons name="checkmark-circle" size={20} color="#22C55E" />;
  }
  return severity === "critical"
    ? <Ionicons name="alert-circle" size={20} color="#EF4444" />
    : <Ionicons name="warning-outline" size={20} color="#F59E0B" />;
}

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, resolved: true, resolvedBy: "Sarah (manual)", resolvedAt: "Just now" }
          : a
      )
    );
  };

  const severityStyle = (severity: "critical" | "warning", resolved: boolean) => {
    if (resolved) {
      return { border: "border-dark-700", bg: "bg-dark-800/60" };
    }
    return severity === "critical"
      ? { border: "border-danger-500/40", bg: "bg-danger-500/10" }
      : { border: "border-warning-500/40", bg: "bg-warning-500/10" };
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-white text-2xl font-bold">Alerts</Text>
        <Text className="text-dark-400 text-sm mt-1">
          {activeAlerts.length} active alert{activeAlerts.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* ── Active Alerts ─────────────────────── */}
        {activeAlerts.length > 0 && (
          <View className="mt-4">
            <Text className="text-danger-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Active Alerts
            </Text>
            {activeAlerts.map((alert) => {
              const style = severityStyle(alert.severity, false);
              return (
                <View
                  key={alert.id}
                  className={`${style.bg} border ${style.border} rounded-2xl p-4 mb-3`}
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-row items-center gap-2 flex-1">
                      {severityIcon(alert.severity, false)}
                      <View className="flex-1">
                        <Text className="text-white text-base font-semibold">
                          {alert.message}
                        </Text>
                        <Text className="text-dark-300 text-sm mt-0.5">
                          {alert.child} — {alert.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => resolveAlert(alert.id)}
                    activeOpacity={0.8}
                    className="bg-white/10 rounded-xl h-14 items-center justify-center mt-2"
                  >
                    <Text className="text-white text-sm font-semibold">
                      Resolve
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Empty Active State ────────────────── */}
        {activeAlerts.length === 0 && (
          <View className="items-center justify-center py-16 mt-4">
            <View className="w-20 h-20 rounded-full bg-safe-500/15 items-center justify-center mb-4">
              <Ionicons name="shield-checkmark" size={40} color="#22C55E" />
            </View>
            <Text className="text-white text-lg font-semibold mb-1">
              No Active Alerts
            </Text>
            <Text className="text-dark-400 text-sm text-center px-8">
              All clear! Your children are safe and all alerts have been resolved.
            </Text>
          </View>
        )}

        {/* ── Resolved Alerts ───────────────────── */}
        {resolvedAlerts.length > 0 && (
          <View className="mt-6">
            <Text className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Resolved
            </Text>
            {resolvedAlerts.map((alert) => {
              const style = severityStyle(alert.severity, true);
              return (
                <View
                  key={alert.id}
                  className={`${style.bg} border ${style.border} rounded-2xl p-4 mb-3`}
                  style={{ opacity: 0.6 }}
                >
                  <View className="flex-row items-center gap-2 mb-1">
                    {severityIcon(alert.severity, true)}
                    <Text className="text-dark-300 text-base font-medium flex-1">
                      {alert.message}
                    </Text>
                  </View>
                  <Text className="text-dark-400 text-xs">
                    {alert.child} — {alert.date} {alert.time}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-2">
                    <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
                    <Text className="text-dark-500 text-xs">
                      Resolved by {alert.resolvedBy} at {alert.resolvedAt}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
