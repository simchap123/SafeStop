import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { showAlert } from "../../lib/alert";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useApp } from "../../lib/store";
import { inviteToFamily } from "../../lib/api";

type Role = "Caregiver" | "Viewer";

const ROLE_INFO: Record<Role, { title: string; description: string }> = {
  Caregiver: {
    title: "Caregiver",
    description:
      "Can receive trip alerts, confirm child safety, and view all trip history. Ideal for co-parents, nannies, or trusted family members who transport children.",
  },
  Viewer: {
    title: "Viewer",
    description:
      "Can view trip status and history but cannot confirm child safety or receive urgent alerts. Ideal for extended family members who want to stay informed.",
  },
};

export default function InviteCaregiverScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Caregiver");
  const [sending, setSending] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) {
      showAlert("Missing Email", "Please enter an email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    const familyId = state.auth.family?.id;
    if (!familyId) {
      showAlert("Error", "No family found. Please create or join a family first.");
      return;
    }

    const storeRole = role === "Caregiver" ? "co_parent" as const : "viewer" as const;
    setSending(true);
    try {
      await inviteToFamily({ email: email.trim(), role: storeRole, familyId });
      dispatch({
        type: "ADD_CAREGIVER",
        payload: {
          id: Date.now().toString(),
          userId: Date.now().toString(),
          name: email.split("@")[0],
          email: email.trim(),
          role: storeRole,
        },
      });
      showAlert(
        "Invite Sent",
        `An invitation has been sent to ${email} as a ${role}.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (err: any) {
      showAlert("Error", err.message || "Failed to send invite.");
    } finally {
      setSending(false);
    }
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
            Invite Family Member
          </Text>
        </View>

        {/* Email */}
        <View className="px-6 mt-6 mb-6">
          <Text className="text-dark-300 text-sm font-medium mb-2">
            Email Address
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 text-white text-base"
            placeholderTextColor="#64748B"
            placeholder="name@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Role Picker */}
        <View className="px-6 mb-6">
          <Text className="text-dark-300 text-sm font-medium mb-3">Role</Text>
          <View className="gap-3">
            {(["Caregiver", "Viewer"] as Role[]).map((r) => {
              const info = ROLE_INFO[r];
              const selected = role === r;
              return (
                <Pressable
                  key={r}
                  onPress={() => setRole(r)}
                  className={`rounded-xl border p-4 ${
                    selected
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-dark-700 bg-dark-800"
                  }`}
                >
                  <View className="flex-row items-center mb-2">
                    {/* Radio indicator */}
                    <View
                      className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                        selected
                          ? "border-primary-500"
                          : "border-dark-500"
                      }`}
                    >
                      {selected && (
                        <View className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                      )}
                    </View>
                    <Text
                      className={`text-base font-semibold ${
                        selected ? "text-primary-400" : "text-white"
                      }`}
                    >
                      {info.title}
                    </Text>
                  </View>
                  <Text className="text-dark-400 text-sm leading-5 ml-8">
                    {info.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Invite Button */}
        <View className="px-6 mt-4">
          <Pressable
            onPress={handleInvite}
            className="bg-primary-500 rounded-2xl py-4 items-center active:bg-primary-600"
          >
            <Text className="text-white text-base font-semibold">
              Send Invite
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
