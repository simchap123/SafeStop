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

type Role = "Owner" | "Admin" | "Caregiver" | "Viewer";

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const ROLE_STYLES: Record<Role, { bg: string; text: string }> = {
  Owner: { bg: "bg-warning-500/20", text: "text-warning-500" },
  Admin: { bg: "bg-primary-500/20", text: "text-primary-400" },
  Caregiver: { bg: "bg-safe-500/20", text: "text-safe-500" },
  Viewer: { bg: "bg-dark-600", text: "text-dark-300" },
};

const MOCK_MEMBERS: FamilyMember[] = [
  {
    id: "m1",
    name: "Sarah Johnson",
    email: "sarah@email.com",
    role: "Owner",
  },
  {
    id: "m2",
    name: "Mike Johnson",
    email: "mike@email.com",
    role: "Admin",
  },
  {
    id: "m3",
    name: "Grandma Rose",
    email: "rose@email.com",
    role: "Caregiver",
  },
  {
    id: "m4",
    name: "Uncle Dave",
    email: "dave@email.com",
    role: "Viewer",
  },
];

export default function FamilyScreen() {
  const router = useRouter();
  const [familyName, setFamilyName] = useState("Johnson Family");
  const [isEditingName, setIsEditingName] = useState(false);
  const [members] = useState<FamilyMember[]>(MOCK_MEMBERS);
  const inviteCode = "SAFE-JHN-4829";

  const handleCopyCode = () => {
    Alert.alert("Copied", "Invite code copied to clipboard.");
  };

  const handleLeaveFamily = () => {
    Alert.alert(
      "Leave Family",
      "Are you sure you want to leave this family? You will lose access to all shared children and trip data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
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
            Family
          </Text>
        </View>

        {/* Family Name */}
        <View className="px-6 mt-6 mb-6">
          <Text className="text-dark-300 text-sm font-medium mb-2">
            Family Name
          </Text>
          {isEditingName ? (
            <View className="flex-row items-center gap-3">
              <TextInput
                value={familyName}
                onChangeText={setFamilyName}
                className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3.5 text-white text-base flex-1"
                placeholderTextColor="#64748B"
                autoFocus
              />
              <Pressable
                onPress={() => setIsEditingName(false)}
                className="bg-primary-500 px-4 py-3.5 rounded-xl active:bg-primary-600"
              >
                <Text className="text-white text-sm font-semibold">Save</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setIsEditingName(true)}
              className="bg-dark-800 rounded-xl px-4 py-3.5 flex-row items-center justify-between"
            >
              <Text className="text-white text-base">{familyName}</Text>
              <Text className="text-primary-400 text-sm font-medium">
                Edit
              </Text>
            </Pressable>
          )}
        </View>

        {/* Invite Code */}
        <View className="px-6 mb-6">
          <Text className="text-dark-300 text-sm font-medium mb-2">
            Family Invite Code
          </Text>
          <Pressable
            onPress={handleCopyCode}
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-4 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-white text-lg font-bold tracking-widest">
                {inviteCode}
              </Text>
              <Text className="text-dark-400 text-xs mt-1">
                Share this code to invite members
              </Text>
            </View>
            <View className="bg-primary-500/20 px-3 py-1.5 rounded-lg">
              <Text className="text-primary-400 text-sm font-medium">
                Copy
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Members */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-dark-300 text-sm font-medium">
              Members ({members.length})
            </Text>
          </View>
          {members.map((member) => {
            const roleStyle = ROLE_STYLES[member.role];
            return (
              <View
                key={member.id}
                className="bg-dark-800 rounded-xl p-4 mb-2 flex-row items-center"
              >
                <View className="w-11 h-11 rounded-full bg-dark-600 items-center justify-center mr-3">
                  <Text className="text-white text-base font-bold">
                    {member.name[0]}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white text-base font-semibold">
                    {member.name}
                  </Text>
                  <Text className="text-dark-400 text-sm">{member.email}</Text>
                </View>
                <View className={`${roleStyle.bg} px-2.5 py-1 rounded-full`}>
                  <Text
                    className={`${roleStyle.text} text-xs font-semibold`}
                  >
                    {member.role}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Invite Member Button */}
        <View className="px-6 mb-4">
          <Pressable
            onPress={() => router.push("/caregiver/invite")}
            className="bg-primary-500 rounded-2xl py-4 items-center active:bg-primary-600"
          >
            <Text className="text-white text-base font-semibold">
              Invite Member
            </Text>
          </Pressable>
        </View>

        {/* Leave Family */}
        <View className="px-6 mt-4">
          <Pressable
            onPress={handleLeaveFamily}
            className="border border-danger-500 rounded-2xl py-4 items-center active:bg-danger-500/10"
          >
            <Text className="text-danger-500 text-base font-semibold">
              Leave Family
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
