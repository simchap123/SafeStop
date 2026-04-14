import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

type CameraState = "viewfinder" | "preview" | "uploading" | "confirmed";

export default function CameraScreen() {
  const router = useRouter();
  const [state, setState] = useState<CameraState>("viewfinder");
  const [flashOn, setFlashOn] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);

  function handleCapture() {
    setState("preview");
  }

  function handleRetake() {
    setState("viewfinder");
  }

  function handleUsePhoto() {
    setState("uploading");
    // Simulate upload
    setTimeout(() => {
      setState("confirmed");
    }, 2000);
  }

  function handleDone() {
    router.replace("/(session)/confirmed");
  }

  // Confirmed state
  if (state === "confirmed") {
    return (
      <SafeAreaView className="flex-1 bg-dark-900">
        <View className="flex-1 items-center justify-center px-4">
          {/* Green checkmark */}
          <View className="w-24 h-24 rounded-full bg-safe-500 items-center justify-center mb-6">
            <Ionicons name="checkmark-circle" size={56} color="#FFFFFF" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">
            Photo Confirmed
          </Text>
          <Text className="text-dark-300 text-base text-center">
            Your photo has been securely uploaded and verified.
          </Text>
          <TouchableOpacity
            onPress={handleDone}
            className="bg-safe-500 h-14 px-12 rounded-xl mt-10 items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Uploading state
  if (state === "uploading") {
    return (
      <SafeAreaView className="flex-1 bg-dark-900">
        <View className="flex-1 items-center justify-center px-4">
          <ActivityIndicator size="large" color="#22C55E" />
          <Text className="text-white text-xl font-semibold mt-6">
            Uploading Photo...
          </Text>
          <Text className="text-dark-400 text-base mt-2">
            Securely sending verification
          </Text>
          {/* Progress bar */}
          <View className="w-64 h-2 bg-dark-700 rounded-full mt-8 overflow-hidden">
            <View className="h-full bg-safe-500 rounded-full w-3/4" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Preview state
  if (state === "preview") {
    return (
      <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
        {/* Photo preview placeholder */}
        <View className="flex-1 bg-dark-800 items-center justify-center">
          <View className="w-32 h-32 rounded-2xl bg-dark-700 items-center justify-center mb-4">
            <Ionicons name="image-outline" size={48} color="#475569" />
          </View>
          <Text className="text-dark-400 text-base">Photo Preview</Text>
          <Text className="text-dark-500 text-sm mt-1">
            (Captured image would appear here)
          </Text>
        </View>

        {/* Bottom actions */}
        <View className="bg-dark-900 px-4 py-6 flex-row items-center justify-center gap-4">
          <TouchableOpacity
            onPress={handleRetake}
            className="flex-1 h-14 rounded-xl border-2 border-dark-600 items-center justify-center flex-row gap-2"
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
            <Text className="text-white font-semibold text-base">Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUsePhoto}
            className="flex-1 h-14 rounded-xl bg-safe-500 items-center justify-center flex-row gap-2"
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            <Text className="text-white font-bold text-base">Use Photo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Viewfinder state (default)
  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      {/* Top controls */}
      <View className="flex-row justify-between items-center px-4 py-4 bg-black/60 absolute top-12 left-0 right-0 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.6}
          style={{ minHeight: 48, minWidth: 48 }}
        >
          <View className="w-10 h-10 rounded-full bg-dark-800/80 items-center justify-center">
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <View className="flex-row gap-4">
          {/* Flash toggle */}
          <TouchableOpacity
            onPress={() => setFlashOn(!flashOn)}
            activeOpacity={0.6}
            style={{ minHeight: 48, minWidth: 48 }}
          >
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                flashOn ? "bg-warning-500" : "bg-dark-800/80"
              }`}
            >
              <Ionicons name={flashOn ? "flash" : "flash-off"} size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* Flip camera */}
          <TouchableOpacity
            onPress={() => setFrontCamera(!frontCamera)}
            activeOpacity={0.6}
            style={{ minHeight: 48, minWidth: 48 }}
          >
            <View className="w-10 h-10 rounded-full bg-dark-800/80 items-center justify-center">
              <Ionicons name="camera-reverse-outline" size={22} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera view placeholder */}
      <View className="flex-1 bg-dark-950 items-center justify-center">
        <View className="w-20 h-20 rounded-full border-2 border-dark-600 items-center justify-center mb-4">
          <Ionicons name="camera-outline" size={32} color="#64748B" />
        </View>
        <Text className="text-dark-500 text-base">Camera View</Text>
        <Text className="text-dark-600 text-sm mt-1">
          {frontCamera ? "Front Camera" : "Rear Camera"}
          {flashOn ? " | Flash On" : ""}
        </Text>
      </View>

      {/* Capture button */}
      <View className="bg-black px-4 py-8 items-center">
        <Text className="text-dark-400 text-sm mb-4">
          Take a photo of the empty car seat
        </Text>
        <TouchableOpacity onPress={handleCapture} activeOpacity={0.8}>
          <View className="w-20 h-20 rounded-full border-4 border-white items-center justify-center">
            <View className="w-16 h-16 rounded-full bg-white" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
