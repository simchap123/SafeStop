import "../global.css";
import React from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PhoneFrame from "../components/ui/PhoneFrame";
import { AppProvider } from "../lib/store";

export default function RootLayout() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <PhoneFrame>
          <Slot />
        </PhoneFrame>
      </SafeAreaProvider>
    </AppProvider>
  );
}
