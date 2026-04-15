import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApp } from "../../lib/store";
import type { Alert } from "../../lib/types";

// -- Helpers --
function formatAlertTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatAlertDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function severityToDisplay(severity: string): "critical" | "warning" {
  return severity === "high" || severity === "critical" ? "critical" : "warning";
}

function severityIcon(severity: "critical" | "warning", resolved: boolean) {
  if (resolved) {
    return <Ionicons name="checkmark-circle" size={20} color="#22C55E" />;
  }
  return severity === "critical"
    ? <Ionicons name="alert-circle" size={20} color="#EF4444" />
    : <Ionicons name="warning-outline" size={20} color="#F59E0B" />;
}

export default function AlertsScreen() {
  const { state, dispatch } = useApp();
  const alerts = state.alerts;

  const activeAlerts = alerts.filter((a) => !a.resolvedAt);
  const resolvedAlerts = alerts.filter((a) => !!a.resolvedAt);

  const resolveAlert = (id: string) => {
    const userName = state.auth.user?.displayName ?? "User";
    dispatch({ type: "RESOLVE_ALERT", payload: { id, resolvedBy: `${userName} (manual)` } });
  };

  const dismissAlert = (id: string) => {
    dispatch({ type: "DISMISS_ALERT", payload: id });
  };

  const severityStyle = (severity: "critical" | "warning", resolved: boolean) => {
    if (resolved) {
      return { border: "border-dark-700", bg: "bg-dark-800/60" };
    }
    return severity === "critical"
      ? { border: "border-danger-500/40", bg: "bg-danger-500/10" }
      : { border: "border-warning-500/40", bg: "bg-warning-500/10" };
  };

  const getChildName = (childId: string) => {
    return state.children.find((c) => c.id === childId)?.name ?? "Unknown";
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
        {/* -- Active Alerts -- */}
        {activeAlerts.length > 0 && (
          <View className="mt-4">
            <Text className="text-danger-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Active Alerts
            </Text>
            {activeAlerts.map((alert) => {
              const displaySeverity = severityToDisplay(alert.severity);
              const style = severityStyle(displaySeverity, false);
              return (
                <View
                  key={alert.id}
                  className={`${style.bg} border ${style.border} rounded-2xl p-4 mb-3`}
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-row items-center gap-2 flex-1">
                      {severityIcon(displaySeverity, false)}
                      <View className="flex-1">
                        <Text className="text-white text-base font-semibold">
                          {alert.message}
                        </Text>
                        <Text className="text-dark-300 text-sm mt-0.5">
                          {getChildName(alert.childId)} {"\u2014"} {formatAlertTime(alert.triggeredAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-row gap-2 mt-2">
                    <TouchableOpacity
                      onPress={() => resolveAlert(alert.id)}
                      activeOpacity={0.8}
                      className="flex-1 bg-white/10 rounded-xl h-14 items-center justify-center"
                    >
                      <Text className="text-white text-sm font-semibold">
                        Resolve
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => dismissAlert(alert.id)}
                      activeOpacity={0.8}
                      className="bg-white/5 rounded-xl h-14 px-4 items-center justify-center"
                    >
                      <Ionicons name="close" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* -- Empty Active State -- */}
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

        {/* -- Resolved Alerts -- */}
        {resolvedAlerts.length > 0 && (
          <View className="mt-6">
            <Text className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Resolved
            </Text>
            {resolvedAlerts.map((alert) => {
              const displaySeverity = severityToDisplay(alert.severity);
              const style = severityStyle(displaySeverity, true);
              return (
                <View
                  key={alert.id}
                  className={`${style.bg} border ${style.border} rounded-2xl p-4 mb-3`}
                  style={{ opacity: 0.6 }}
                >
                  <View className="flex-row items-center gap-2 mb-1">
                    {severityIcon(displaySeverity, true)}
                    <Text className="text-dark-300 text-base font-medium flex-1">
                      {alert.message}
                    </Text>
                  </View>
                  <Text className="text-dark-400 text-xs">
                    {getChildName(alert.childId)} {"\u2014"} {formatAlertDate(alert.triggeredAt)} {formatAlertTime(alert.triggeredAt)}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-2">
                    <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
                    <Text className="text-dark-500 text-xs">
                      Resolved by {alert.resolvedBy} at {alert.resolvedAt ? formatAlertTime(alert.resolvedAt) : ""}
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
