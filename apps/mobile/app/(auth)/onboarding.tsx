import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ProgressBar from "../../components/ui/ProgressBar";

const TOTAL_STEPS = 5;

// ─── Step 1: Create Your Family ──────────────────────────────────────────────

function StepFamily({
  familyName,
  setFamilyName,
}: {
  familyName: string;
  setFamilyName: (v: string) => void;
}) {
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 rounded-2xl bg-primary-500/20 items-center justify-center mb-4">
          <Ionicons name="people" size={28} color="#818CF8" />
        </View>
        <Text className="text-white text-2xl font-bold mb-2">Create Your Family</Text>
        <Text className="text-dark-300 text-sm text-center px-4">
          Give your family group a name. Everyone you invite will be part of this group.
        </Text>
      </View>
      <Input
        label="Family Name"
        placeholder="e.g. The Johnson Family"
        value={familyName}
        onChangeText={setFamilyName}
      />
    </View>
  );
}

// ─── Step 2: Add Your Child ──────────────────────────────────────────────────

function StepChild({
  childName,
  setChildName,
}: {
  childName: string;
  setChildName: (v: string) => void;
}) {
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 rounded-2xl bg-safe-500/20 items-center justify-center mb-4">
          <Ionicons name="person-add" size={28} color="#22C55E" />
        </View>
        <Text className="text-white text-2xl font-bold mb-2">Add Your Child</Text>
        <Text className="text-dark-300 text-sm text-center px-4">
          Add a child to track during vehicle trips. You can add more later.
        </Text>
      </View>
      <Input
        label="Child's Name"
        placeholder="e.g. Emma"
        value={childName}
        onChangeText={setChildName}
      />

      {/* Photo placeholder */}
      <View className="items-center mt-2">
        <Pressable className="w-24 h-24 rounded-full bg-dark-800 border-2 border-dashed border-dark-600 items-center justify-center">
          <Ionicons name="camera-outline" size={28} color="#94A3B8" />
          <Text className="text-dark-400 text-xs mt-1">Photo</Text>
        </Pressable>
        <Text className="text-dark-400 text-xs mt-2">Optional</Text>
      </View>
    </View>
  );
}

// ─── Step 3: Add a Destination ───────────────────────────────────────────────

const DESTINATION_TYPES = ["Daycare", "School", "Home", "Work", "Other"] as const;

function StepDestination({
  destinationLabel,
  setDestinationLabel,
  destinationAddress,
  setDestinationAddress,
}: {
  destinationLabel: string;
  setDestinationLabel: (v: string) => void;
  destinationAddress: string;
  setDestinationAddress: (v: string) => void;
}) {
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 rounded-2xl bg-primary-500/20 items-center justify-center mb-4">
          <Ionicons name="location" size={28} color="#818CF8" />
        </View>
        <Text className="text-white text-2xl font-bold mb-2">Add a Destination</Text>
        <Text className="text-dark-300 text-sm text-center px-4">
          Add a common drop-off location. SafeStop will alert you when you arrive.
        </Text>
      </View>

      {/* Destination type pills */}
      <Text className="text-dark-300 text-sm font-medium mb-2">Type</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {DESTINATION_TYPES.map((type) => (
          <Pressable
            key={type}
            onPress={() => setDestinationLabel(type)}
            className={`px-4 py-2 rounded-xl border ${
              destinationLabel === type
                ? "bg-primary-500 border-primary-500"
                : "bg-dark-800 border-dark-700"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                destinationLabel === type ? "text-white" : "text-dark-300"
              }`}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </View>

      <Input
        label="Address"
        placeholder="123 Main Street, City, State"
        value={destinationAddress}
        onChangeText={setDestinationAddress}
      />
    </View>
  );
}

// ─── Step 4: Invite a Caregiver ──────────────────────────────────────────────

const ROLES = ["Caregiver", "Viewer"] as const;

function StepCaregiver({
  caregiverEmail,
  setCaregiverEmail,
  caregiverRole,
  setCaregiverRole,
}: {
  caregiverEmail: string;
  setCaregiverEmail: (v: string) => void;
  caregiverRole: string;
  setCaregiverRole: (v: string) => void;
}) {
  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 rounded-2xl bg-safe-500/20 items-center justify-center mb-4">
          <Ionicons name="mail-outline" size={28} color="#22C55E" />
        </View>
        <Text className="text-white text-2xl font-bold mb-2">Invite a Caregiver</Text>
        <Text className="text-dark-300 text-sm text-center px-4">
          Invite a partner, family member, or caregiver to your family group.
        </Text>
      </View>

      <Input
        label="Email Address"
        placeholder="caregiver@example.com"
        value={caregiverEmail}
        onChangeText={setCaregiverEmail}
        keyboardType="email-address"
      />

      {/* Role selector */}
      <Text className="text-dark-300 text-sm font-medium mb-2">Role</Text>
      <View className="gap-3">
        {ROLES.map((role) => (
          <Pressable
            key={role}
            onPress={() => setCaregiverRole(role)}
            className={`flex-row items-center p-4 rounded-xl border ${
              caregiverRole === role
                ? "bg-primary-500/10 border-primary-500"
                : "bg-dark-800 border-dark-700"
            }`}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                caregiverRole === role
                  ? "border-primary-500"
                  : "border-dark-500"
              }`}
            >
              {caregiverRole === role && (
                <View className="w-2.5 h-2.5 rounded-full bg-primary-500" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium">{role}</Text>
              <Text className="text-dark-400 text-xs mt-0.5">
                {role === "Caregiver"
                  ? "Can manage sessions, confirm check-ins, and receive alerts"
                  : "Can view child status and trip history only"}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable className="mt-4">
        <Text className="text-dark-400 text-sm text-center">Skip for now</Text>
      </Pressable>
    </View>
  );
}

// ─── Step 5: Enable Permissions ──────────────────────────────────────────────

interface PermissionState {
  location: boolean;
  notifications: boolean;
  camera: boolean;
}

function StepPermissions({
  permissions,
  setPermissions,
}: {
  permissions: PermissionState;
  setPermissions: (p: PermissionState) => void;
}) {
  const togglePermission = (key: keyof PermissionState) => {
    setPermissions({ ...permissions, [key]: !permissions[key] });
  };

  const permissionItems: {
    key: keyof PermissionState;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    required: boolean;
  }[] = [
    {
      key: "location",
      icon: "location-outline",
      title: "Location Access",
      description: "Detect trips, arrivals, and departures automatically",
      required: true,
    },
    {
      key: "notifications",
      icon: "notifications-outline",
      title: "Push Notifications",
      description: "Receive critical safety alerts and reminders",
      required: true,
    },
    {
      key: "camera",
      icon: "camera-outline",
      title: "Camera Access",
      description: "Capture backseat confirmation photos",
      required: false,
    },
  ];

  return (
    <View>
      <View className="items-center mb-6">
        <View className="w-16 h-16 rounded-2xl bg-danger-500/20 items-center justify-center mb-4">
          <Ionicons name="lock-closed-outline" size={28} color="#EF4444" />
        </View>
        <Text className="text-white text-2xl font-bold mb-2">Enable Permissions</Text>
        <Text className="text-dark-300 text-sm text-center px-4">
          SafeStop needs these permissions to keep your children safe.
        </Text>
      </View>

      <View className="gap-3">
        {permissionItems.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => togglePermission(item.key)}
            className={`flex-row items-center p-4 rounded-xl border ${
              permissions[item.key]
                ? "bg-safe-500/10 border-safe-500"
                : "bg-dark-800 border-dark-700"
            }`}
          >
            <Ionicons name={item.icon} size={24} color="#94A3B8" style={{ marginRight: 12 }} />
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-white font-medium">{item.title}</Text>
                {item.required && (
                  <View className="bg-danger-500/20 px-2 py-0.5 rounded">
                    <Text className="text-danger-500 text-xs font-medium">Required</Text>
                  </View>
                )}
              </View>
              <Text className="text-dark-400 text-xs mt-0.5">{item.description}</Text>
            </View>
            <View
              className={`w-6 h-6 rounded-md items-center justify-center ${
                permissions[item.key] ? "bg-safe-500" : "bg-dark-700 border border-dark-500"
              }`}
            >
              {permissions[item.key] && (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ─── Main Onboarding Screen ──────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);

  // Step 1 state
  const [familyName, setFamilyName] = useState("");

  // Step 2 state
  const [childName, setChildName] = useState("");

  // Step 3 state
  const [destinationLabel, setDestinationLabel] = useState("Daycare");
  const [destinationAddress, setDestinationAddress] = useState("");

  // Step 4 state
  const [caregiverEmail, setCaregiverEmail] = useState("");
  const [caregiverRole, setCaregiverRole] = useState("Caregiver");

  // Step 5 state
  const [permissions, setPermissions] = useState<PermissionState>({
    location: false,
    notifications: false,
    camera: false,
  });

  const canProceed = () => {
    switch (step) {
      case 1:
        return familyName.trim().length > 0;
      case 2:
        return childName.trim().length > 0;
      case 3:
        return destinationLabel.length > 0 && destinationAddress.trim().length > 0;
      case 4:
        return true; // Optional step
      case 5:
        return permissions.location && permissions.notifications;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Final step -- complete onboarding
      Alert.alert(
        "Welcome to SafeStop!",
        "Your account is set up and ready to protect your family.",
        [{ text: "Let's Go", onPress: () => router.replace("/(tabs)") }]
      );
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepFamily familyName={familyName} setFamilyName={setFamilyName} />;
      case 2:
        return <StepChild childName={childName} setChildName={setChildName} />;
      case 3:
        return (
          <StepDestination
            destinationLabel={destinationLabel}
            setDestinationLabel={setDestinationLabel}
            destinationAddress={destinationAddress}
            setDestinationAddress={setDestinationAddress}
          />
        );
      case 4:
        return (
          <StepCaregiver
            caregiverEmail={caregiverEmail}
            setCaregiverEmail={setCaregiverEmail}
            caregiverRole={caregiverRole}
            setCaregiverRole={setCaregiverRole}
          />
        );
      case 5:
        return (
          <StepPermissions
            permissions={permissions}
            setPermissions={setPermissions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-8 pt-4">
          {/* Progress bar */}
          <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

          {/* Content */}
          <ScrollView
            className="flex-1"
            contentContainerClassName="pb-8"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {renderStep()}
          </ScrollView>

          {/* Navigation buttons */}
          <View className="flex-row gap-3 pb-6">
            <View className="flex-1">
              <Button
                title={step === 1 ? "Cancel" : "Back"}
                variant="secondary"
                onPress={handleBack}
              />
            </View>
            <View className="flex-1">
              <Button
                title={step === TOTAL_STEPS ? "Finish" : "Next"}
                onPress={handleNext}
                disabled={!canProceed()}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
