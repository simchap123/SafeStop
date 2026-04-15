import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
} from "react-native";
import { showAlert } from "../../lib/alert";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useApp } from "../../lib/store";
import { updateChild, deleteChild } from "../../lib/api";

const AVATAR_COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
];

export default function ChildDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useApp();

  const child = state.children.find((c) => c.id === id);
  const destinations = state.destinations;
  const caregivers = state.caregivers;

  const [name, setName] = useState(child?.name ?? "");
  const [notes, setNotes] = useState(child?.notes ?? "");
  const [active, setActive] = useState(true);
  const [avatarColor, setAvatarColor] = useState("#6366F1");

  const initial = name.trim() ? name.trim()[0].toUpperCase() : "?";

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!child || !id) return;
    setSaving(true);
    try {
      const updated = await updateChild(id, { name });
      dispatch({
        type: "UPDATE_CHILD",
        payload: { ...child, name: updated.name ?? name, notes },
      });
      showAlert("Saved", "Child profile updated successfully.");
    } catch (err: any) {
      showAlert("Error", err.message || "Failed to update child.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = () => {
    showAlert("Remove Child", "Are you sure you want to remove this child?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          if (!id) return;
          try {
            await deleteChild(id);
            dispatch({ type: "REMOVE_CHILD", payload: id });
            router.back();
          } catch (err: any) {
            showAlert("Error", err.message || "Failed to remove child.");
          }
        },
      },
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
              Back
            </Text>
          </Pressable>
          <Text className="text-white text-xl font-bold flex-1">
            Edit Child
          </Text>
        </View>

        {/* Avatar */}
        <View className="items-center mt-6 mb-2">
          <Pressable className="items-center">
            <View
              style={{ backgroundColor: avatarColor }}
              className="w-24 h-24 rounded-full items-center justify-center mb-2"
            >
              <Text className="text-white text-3xl font-bold">{initial}</Text>
            </View>
            <Text className="text-primary-400 text-sm font-medium">
              Tap to change
            </Text>
          </Pressable>
        </View>

        {/* Color picker */}
        <View className="flex-row justify-center gap-2 mb-6 px-6">
          {AVATAR_COLORS.map((color) => (
            <Pressable
              key={color}
              onPress={() => setAvatarColor(color)}
              style={{ backgroundColor: color }}
              className={`w-8 h-8 rounded-full ${
                avatarColor === color ? "border-2 border-white" : ""
              }`}
            />
          ))}
        </View>

        {/* Name */}
        <View className="px-6 mb-4">
          <Text className="text-dark-300 text-sm font-medium mb-2">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 text-white text-base"
            placeholderTextColor="#64748B"
            placeholder="Child's name"
          />
        </View>

        {/* Notes */}
        <View className="px-6 mb-6">
          <Text className="text-dark-300 text-sm font-medium mb-2">
            Notes / Special Instructions
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 text-white text-base min-h-[100px]"
            placeholderTextColor="#64748B"
            placeholder="Allergies, car seat info, etc."
          />
        </View>

        {/* Linked Destinations */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white text-base font-semibold">
              Linked Destinations
            </Text>
            <Pressable
              onPress={() => router.push("/destination/add")}
              className="bg-dark-700 px-3 py-1.5 rounded-lg active:bg-dark-600"
            >
              <Text className="text-primary-400 text-sm font-medium">
                + Add
              </Text>
            </Pressable>
          </View>
          {destinations.map((dest) => (
            <View
              key={dest.id}
              className="bg-dark-800 rounded-xl p-3 mb-2 flex-row items-center"
            >
              <View className="w-2 h-2 rounded-full bg-primary-400 mr-3" />
              <View className="flex-1">
                <Text className="text-white text-sm font-medium">
                  {dest.name}
                </Text>
                <Text className="text-dark-400 text-xs">{dest.address}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Linked Caregivers */}
        <View className="px-6 mb-6">
          <Text className="text-white text-base font-semibold mb-3">
            Linked Caregivers
          </Text>
          {caregivers.map((cg) => (
            <View
              key={cg.id}
              className="bg-dark-800 rounded-xl p-3 mb-2 flex-row items-center"
            >
              <View className="w-8 h-8 rounded-full bg-dark-600 items-center justify-center mr-3">
                <Text className="text-white text-xs font-bold">
                  {cg.name[0]}
                </Text>
              </View>
              <Text className="text-white text-sm font-medium flex-1">
                {cg.name}
              </Text>
              <View className="bg-primary-500/20 px-2 py-0.5 rounded-full">
                <Text className="text-primary-400 text-xs font-medium">
                  {cg.role.replace('_', ' ')}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Active toggle */}
        <View className="px-6 mb-8">
          <View className="bg-dark-800 rounded-xl p-4 flex-row items-center justify-between">
            <View>
              <Text className="text-white text-base font-medium">Active</Text>
              <Text className="text-dark-400 text-xs mt-0.5">
                Include this child in trip monitoring
              </Text>
            </View>
            <Switch
              value={active}
              onValueChange={setActive}
              trackColor={{ false: "#334155", true: "#22C55E" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Save */}
        <View className="px-6 mb-4">
          <Pressable
            onPress={handleSave}
            className="bg-primary-500 rounded-2xl py-4 items-center active:bg-primary-600"
          >
            <Text className="text-white text-base font-semibold">
              Save Changes
            </Text>
          </Pressable>
        </View>

        {/* Remove */}
        <View className="px-6">
          <Pressable
            onPress={handleRemove}
            className="border border-danger-500 rounded-2xl py-4 items-center active:bg-danger-500/10"
          >
            <Text className="text-danger-500 text-base font-semibold">
              Remove Child
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
