import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState("Sarah Johnson");
  const [email] = useState("sarah.johnson@email.com");
  const [phone, setPhone] = useState("(555) 123-4567");

  const initials = name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter your full name.");
      return;
    }
    Alert.alert("Saved", "Your profile has been updated.");
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "A password reset link will be sent to your email.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send Link", onPress: () => {} },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all associated data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => router.push("/"),
        },
      ]
    );
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
            Profile
          </Text>
        </View>

        {/* Avatar */}
        <View className="items-center mt-8 mb-8">
          <Pressable className="items-center">
            <View className="w-28 h-28 rounded-full bg-primary-500/20 border-2 border-dashed border-primary-400/50 items-center justify-center mb-2">
              <Text className="text-primary-400 text-3xl font-bold">
                {initials}
              </Text>
            </View>
            <Text className="text-primary-400 text-sm font-medium">
              Tap to change photo
            </Text>
          </Pressable>
        </View>

        {/* Full Name */}
        <View className="px-6 mb-4">
          <Text className="text-dark-300 text-sm font-medium mb-2">
            Full Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 text-white text-base"
            placeholderTextColor="#64748B"
            placeholder="Your full name"
          />
        </View>

        {/* Email (display only) */}
        <View className="px-6 mb-4">
          <Text className="text-dark-300 text-sm font-medium mb-2">Email</Text>
          <View className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 flex-row items-center justify-between">
            <Text className="text-dark-400 text-base">{email}</Text>
            <View className="bg-dark-700 px-2 py-0.5 rounded">
              <Text className="text-dark-500 text-xs">Read only</Text>
            </View>
          </View>
        </View>

        {/* Phone */}
        <View className="px-6 mb-8">
          <Text className="text-dark-300 text-sm font-medium mb-2">
            Phone Number (optional)
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 text-white text-base"
            placeholderTextColor="#64748B"
            placeholder="(555) 000-0000"
            keyboardType="phone-pad"
          />
        </View>

        {/* Change Password */}
        <View className="px-6 mb-4">
          <Pressable
            onPress={handleChangePassword}
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 flex-row items-center justify-between active:bg-dark-700"
          >
            <Text className="text-white text-base">Change Password</Text>
            <Text className="text-dark-500 text-sm">&rsaquo;</Text>
          </Pressable>
        </View>

        {/* Save Button */}
        <View className="px-6 mb-4 mt-4">
          <Pressable
            onPress={handleSave}
            className="bg-primary-500 rounded-2xl py-4 items-center active:bg-primary-600"
          >
            <Text className="text-white text-base font-semibold">
              Save Changes
            </Text>
          </Pressable>
        </View>

        {/* Delete Account */}
        <View className="px-6 mt-4">
          <Pressable
            onPress={handleDeleteAccount}
            className="border border-danger-500 rounded-2xl py-4 items-center active:bg-danger-500/10"
          >
            <Text className="text-danger-500 text-base font-semibold">
              Delete Account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
