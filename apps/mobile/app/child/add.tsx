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
import { useApp } from "../../lib/store";

export default function AddChildScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const initial = name.trim() ? name.trim()[0].toUpperCase() : "+";

  const handleAdd = () => {
    if (!name.trim()) {
      showAlert("Missing Name", "Please enter the child's name.");
      return;
    }
    dispatch({
      type: "ADD_CHILD",
      payload: {
        id: Date.now().toString(),
        familyId: state.auth.family?.id ?? "",
        name: name.trim(),
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      },
    });
    showAlert("Success", `${name} has been added.`, [
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
            Add Child
          </Text>
        </View>

        {/* Photo Placeholder */}
        <View className="items-center mt-8 mb-8">
          <Pressable className="items-center">
            <View className="w-28 h-28 rounded-full bg-dark-700 border-2 border-dashed border-dark-500 items-center justify-center mb-2">
              <Text className="text-dark-400 text-3xl font-bold">
                {initial}
              </Text>
            </View>
            <Text className="text-primary-400 text-sm font-medium">
              Tap to add photo
            </Text>
          </Pressable>
        </View>

        {/* Name */}
        <View className="px-6 mb-4">
          <Text className="text-dark-300 text-sm font-medium mb-2">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 text-white text-base"
            placeholderTextColor="#64748B"
            placeholder="Child's full name"
          />
        </View>

        {/* Notes */}
        <View className="px-6 mb-8">
          <Text className="text-dark-300 text-sm font-medium mb-2">
            Notes / Special Instructions
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 text-white text-base min-h-[120px]"
            placeholderTextColor="#64748B"
            placeholder="Allergies, car seat info, special needs..."
          />
        </View>

        {/* Add Button */}
        <View className="px-6">
          <Pressable
            onPress={handleAdd}
            className="bg-primary-500 rounded-2xl py-4 items-center active:bg-primary-600"
          >
            <Text className="text-white text-base font-semibold">
              Add Child
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
