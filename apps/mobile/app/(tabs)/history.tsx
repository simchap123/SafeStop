import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApp } from "../../lib/store";
import { SessionState } from "../../lib/types";

// -- Filter options --
const FILTERS = ["All", "Today", "This Week", "This Month"] as const;
type Filter = (typeof FILTERS)[number];

// -- Helpers --
function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isYesterday(iso: string): boolean {
  const d = new Date(iso);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
}

function isThisWeek(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);
  return d >= weekAgo && d <= now;
}

function isThisMonth(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function dateLabel(iso: string): string {
  if (isToday(iso)) return "Today";
  if (isYesterday(iso)) return "Yesterday";
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function durationMinutes(startIso: string, endIso?: string): string {
  if (!endIso) return "--";
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  return `${Math.round(ms / 60000)} min`;
}

interface TripDisplay {
  id: string;
  date: string;
  time: string;
  child: string;
  status: "confirmed" | "missed" | "cancelled";
  confirmationType: "photo" | "no-photo";
  duration: string;
  destination: string;
}

function statusBadge(status: "confirmed" | "missed" | "cancelled") {
  switch (status) {
    case "confirmed":
      return { bg: "bg-safe-500/20", text: "text-safe-500", label: "Confirmed" };
    case "missed":
      return { bg: "bg-danger-500/20", text: "text-danger-500", label: "Missed" };
    case "cancelled":
      return { bg: "bg-dark-600/40", text: "text-dark-400", label: "Cancelled" };
  }
}

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const { state } = useApp();

  // Map session history to trip display format
  const allTrips: TripDisplay[] = useMemo(() => {
    return state.history.map((session) => {
      const child = state.children.find((c) => c.id === session.childId);
      const dest = state.destinations.find((d) => d.id === session.destinationId);

      // Determine status
      let status: "confirmed" | "missed" | "cancelled";
      if (session.state === SessionState.CONFIRMED_SAFE) {
        status = "confirmed";
      } else if (
        session.state === SessionState.ALERT_TRIGGERED ||
        session.state === SessionState.ESCALATED
      ) {
        status = "missed";
      } else {
        status = "cancelled";
      }

      // Check if any stop had a photo confirmation
      const hasPhoto = session.stops.some(
        (stop) => stop.confirmation?.type === "photo"
      );

      return {
        id: session.id,
        date: dateLabel(session.startedAt),
        time: `${formatTime(session.startedAt)} \u2014 ${session.endedAt ? formatTime(session.endedAt) : "ongoing"}`,
        child: child?.name ?? "Unknown",
        status,
        confirmationType: hasPhoto ? ("photo" as const) : ("no-photo" as const),
        duration: durationMinutes(session.startedAt, session.endedAt),
        destination: dest?.name ?? "Unknown",
        _startedAt: session.startedAt, // keep for filtering
      };
    });
  }, [state.history, state.children, state.destinations]);

  const filteredTrips = useMemo(() => {
    return allTrips.filter((trip) => {
      // Use the raw startedAt from the matching session
      const session = state.history.find((s) => s.id === trip.id);
      if (!session) return false;
      const iso = session.startedAt;

      if (activeFilter === "All") return true;
      if (activeFilter === "Today") return isToday(iso);
      if (activeFilter === "This Week") return isThisWeek(iso);
      if (activeFilter === "This Month") return isThisMonth(iso);
      return true;
    });
  }, [allTrips, activeFilter, state.history]);

  // Group by date
  const grouped = filteredTrips.reduce<Record<string, TripDisplay[]>>((acc, trip) => {
    if (!acc[trip.date]) acc[trip.date] = [];
    acc[trip.date].push(trip);
    return acc;
  }, {});

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-white text-2xl font-bold">Trip History</Text>
        <Text className="text-dark-400 text-sm mt-1">
          {filteredTrips.length} trip{filteredTrips.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-3"
        contentContainerStyle={{ gap: 8 }}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl ${
              activeFilter === filter ? "bg-primary-500" : "bg-dark-800 border border-dark-700"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                activeFilter === filter ? "text-white" : "text-dark-300"
              }`}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trip List */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {Object.entries(grouped).map(([date, trips]) => (
          <View key={date} className="mb-5">
            <Text className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-3">
              {date}
            </Text>
            {trips.map((trip) => {
              const badge = statusBadge(trip.status);
              return (
                <TouchableOpacity
                  key={trip.id}
                  activeOpacity={0.7}
                  onPress={() => console.log("Navigate to trip detail:", trip.id)}
                  className="bg-dark-800 border border-dark-700 rounded-2xl p-4 mb-3"
                >
                  {/* Top row: child + status */}
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                      <View className="w-8 h-8 rounded-full bg-primary-500/20 items-center justify-center">
                        <Text className="text-primary-400 text-sm font-bold">
                          {trip.child[0]}
                        </Text>
                      </View>
                      <Text className="text-white text-base font-semibold">
                        {trip.child}
                      </Text>
                    </View>
                    <View className={`px-2.5 py-1 rounded-full ${badge.bg}`}>
                      <Text className={`text-xs font-semibold ${badge.text}`}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  {/* Destination */}
                  <View className="flex-row items-center gap-2 mb-2">
                    <Ionicons name="location-outline" size={14} color="#94A3B8" />
                    <Text className="text-dark-200 text-sm">
                      {trip.destination}
                    </Text>
                  </View>

                  {/* Bottom row: time, duration, photo */}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-dark-400 text-xs">{trip.time}</Text>
                    <View className="flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="time-outline" size={12} color="#64748B" />
                        <Text className="text-dark-400 text-xs">{trip.duration}</Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Ionicons
                          name={trip.confirmationType === "photo" ? "camera-outline" : "remove-outline"}
                          size={12}
                          color="#64748B"
                        />
                        <Text className="text-dark-400 text-xs">
                          {trip.confirmationType === "photo" ? "Photo" : "No photo"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {filteredTrips.length === 0 && (
          <View className="items-center justify-center py-20">
            <Ionicons name="document-text-outline" size={48} color="#475569" />
            <Text className="text-dark-400 text-base mt-3">No trips found</Text>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
