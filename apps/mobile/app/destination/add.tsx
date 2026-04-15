import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { showAlert } from "../../lib/alert";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MapView from "../../components/ui/MapView";
import { useApp } from "../../lib/store";

type DestType = "Daycare" | "School" | "Babysitter" | "Family" | "Custom";

const DEST_TYPES: DestType[] = [
  "Daycare",
  "School",
  "Babysitter",
  "Family",
  "Custom",
];

const TYPE_COLORS: Record<DestType, string> = {
  Daycare: "#818CF8",
  School: "#22C55E",
  Babysitter: "#F59E0B",
  Family: "#EF4444",
  Custom: "#94A3B8",
};

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export default function AddDestinationScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const childNames = state.children.map((c) => c.name);

  const [label, setLabel] = useState("");
  const [type, setType] = useState<DestType>("Daycare");
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState(200);
  const [activeDays, setActiveDays] = useState([
    true,
    true,
    true,
    true,
    true,
    false,
    false,
  ]);
  const [startTime] = useState("8:00 AM");
  const [endTime] = useState("8:30 AM");
  const [linkedChild, setLinkedChild] = useState("");

  const toggleDay = (index: number) => {
    const updated = [...activeDays];
    updated[index] = !updated[index];
    setActiveDays(updated);
  };

  const radiusPercent = ((radius - 100) / 400) * 100;

  const handleAdd = () => {
    if (!label.trim()) {
      showAlert("Missing Label", "Please enter a destination name.");
      return;
    }
    if (!address.trim()) {
      showAlert("Missing Address", "Please enter an address.");
      return;
    }
    dispatch({
      type: "ADD_DESTINATION",
      payload: {
        id: Date.now().toString(),
        familyId: state.auth.family?.id ?? "",
        name: label.trim(),
        address: address.trim(),
        latitude: 0,
        longitude: 0,
        radius,
        isDefault: false,
        createdAt: new Date().toISOString(),
      },
    });
    showAlert("Success", `${label} has been added.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

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
              Cancel
            </Text>
          </Pressable>
          <Text className="text-white text-xl font-bold flex-1">
            Add Destination
          </Text>
        </View>

        {/* Label */}
        <View className="px-6 mt-6 mb-4">
          <Text className="text-dark-300 text-sm font-medium mb-2">Label</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 text-white text-base"
            placeholderTextColor="#64748B"
            placeholder="e.g. Sunshine Daycare"
          />
        </View>

        {/* Type Picker */}
        <View className="px-6 mb-4">
          <Text className="text-dark-300 text-sm font-medium mb-2">Type</Text>
          <View className="flex-row flex-wrap gap-2">
            {DEST_TYPES.map((t) => (
              <Pressable
                key={t}
                onPress={() => setType(t)}
                className={`px-4 py-2 rounded-xl border ${
                  type === t
                    ? "border-primary-500 bg-primary-500/15"
                    : "border-dark-700 bg-dark-800"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    type === t ? "text-primary-400" : "text-dark-300"
                  }`}
                >
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Address */}
        <View className="px-6 mb-4">
          <Text className="text-dark-300 text-sm font-medium mb-2">
            Address
          </Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 text-white text-base"
            placeholderTextColor="#64748B"
            placeholder="Street address"
          />
        </View>

        {/* Map */}
        <View className="px-6 mb-4">
          <View className="rounded-xl overflow-hidden">
            <MapView
              latitude={37.4220}
              longitude={-122.0841}
              height={180}
              showPin
              markers={[{ lat: 37.4220, lng: -122.0841, title: label || "New Destination" }]}
            />
          </View>
        </View>

        {/* Radius */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-dark-300 text-sm font-medium">
              Geofence Radius
            </Text>
            <Text className="text-white text-sm font-semibold">{radius}m</Text>
          </View>
          <View className="bg-dark-700 h-2 rounded-full overflow-hidden">
            <View
              style={{ width: `${radiusPercent}%` }}
              className="bg-primary-500 h-full rounded-full"
            />
          </View>
          <View className="flex-row justify-between mt-3">
            {[100, 200, 300, 400, 500].map((r) => (
              <Pressable
                key={r}
                onPress={() => setRadius(r)}
                className={`px-3 py-1.5 rounded-lg ${
                  radius === r ? "bg-primary-500/20" : "bg-dark-800"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    radius === r ? "text-primary-400" : "text-dark-400"
                  }`}
                >
                  {r}m
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Active Days */}
        <View className="px-6 mb-6">
          <Text className="text-dark-300 text-sm font-medium mb-3">
            Active Days
          </Text>
          <View className="flex-row justify-between">
            {DAY_LABELS.map((day, i) => (
              <Pressable
                key={i}
                onPress={() => toggleDay(i)}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  activeDays[i]
                    ? "bg-primary-500"
                    : "bg-dark-800 border border-dark-600"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    activeDays[i] ? "text-white" : "text-dark-400"
                  }`}
                >
                  {day}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Arrival Window */}
        <View className="px-6 mb-6">
          <Text className="text-dark-300 text-sm font-medium mb-3">
            Arrival Window
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-dark-400 text-xs mb-1.5">Start Time</Text>
              <Pressable className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 items-center">
                <Text className="text-white text-base">{startTime}</Text>
              </Pressable>
            </View>
            <View className="flex-1">
              <Text className="text-dark-400 text-xs mb-1.5">End Time</Text>
              <Pressable className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 items-center">
                <Text className="text-white text-base">{endTime}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Linked Child */}
        <View className="px-6 mb-8">
          <Text className="text-dark-300 text-sm font-medium mb-3">
            Linked Child
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {childNames.map((child) => (
              <Pressable
                key={child}
                onPress={() => setLinkedChild(child)}
                className={`px-4 py-2 rounded-xl border ${
                  linkedChild === child
                    ? "border-primary-500 bg-primary-500/15"
                    : "border-dark-700 bg-dark-800"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    linkedChild === child ? "text-primary-400" : "text-dark-300"
                  }`}
                >
                  {child}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Add Button */}
        <View className="px-6">
          <Pressable
            onPress={handleAdd}
            className="bg-primary-500 rounded-2xl py-4 items-center active:bg-primary-600"
          >
            <Text className="text-white text-base font-semibold">
              Add Destination
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
