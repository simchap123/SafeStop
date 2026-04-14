import React from "react";
import { Stack } from "expo-router";

export default function SessionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0F172A" },
        presentation: "modal",
        animation: "slide_from_bottom",
      }}
    />
  );
}
