import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

// ── Filter options ─────────────────────────────────────────
const FILTERS = ["All", "Today", "This Week", "This Month"] as const;
type Filter = (typeof FILTERS)[number];

// ── Mock trip data ─────────────────────────────────────────
const TRIPS = [
  {
    id: "1",
    date: "Today",
    time: "8:15 AM — 8:42 AM",
    child: "Emma",
    status: "confirmed" as const,
    confirmationType: "photo",
    duration: "27 min",
    destination: "Sunnyvale Elementary",
  },
  {
    id: "2",
    date: "Today",
    time: "7:30 AM — 7:48 AM",
    child: "Emma",
    status: "confirmed" as const,
    confirmationType: "no-photo",
    duration: "18 min",
    destination: "Swim Practice",
  },
  {
    id: "3",
    date: "Yesterday",
    time: "3:00 PM — 3:15 PM",
    child: "Lucas",
    status: "confirmed" as const,
    confirmationType: "photo",
    duration: "15 min",
    destination: "Soccer Practice",
  },
  {
    id: "4",
    date: "Yesterday",
    time: "8:10 AM — 8:35 AM",
    child: "Emma",
    status: "missed" as const,
    confirmationType: "no-photo",
    duration: "25 min",
    destination: "Sunnyvale Elementary",
  },
  {
    id: "5",
    date: "Mon, Apr 12",
    time: "8:20 AM — 8:40 AM",
    child: "Emma",
    status: "confirmed" as const,
    confirmationType: "photo",
    duration: "20 min",
    destination: "Sunnyvale Elementary",
  },
  {
    id: "6",
    date: "Mon, Apr 12",
    time: "4:00 PM — 4:12 PM",
    child: "Lucas",
    status: "cancelled" as const,
    confirmationType: "no-photo",
    duration: "12 min",
    destination: "Home",
  },
  {
    id: "7",
    date: "Sun, Apr 11",
    time: "10:00 AM — 10:22 AM",
    child: "Lucas",
    status: "confirmed" as const,
    confirmationType: "photo",
    duration: "22 min",
    destination: "Grandma's House",
  },
];

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

  const filteredTrips = TRIPS.filter((trip) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Today") return trip.date === "Today";
    if (activeFilter === "This Week")
      return ["Today", "Yesterday", "Mon, Apr 12", "Sun, Apr 11"].includes(trip.date);
    return true; // "This Month" — show all mock data
  });

  // Group by date
  const grouped = filteredTrips.reduce<Record<string, typeof TRIPS>>((acc, trip) => {
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
