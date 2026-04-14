import React from "react";
import { View, Text, Platform } from "react-native";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  // On native, just render children directly
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View className="flex-1 items-center justify-center bg-[#09090B]">
      <View
        className="w-full max-w-[430px] flex-1 bg-dark-900 overflow-hidden"
        style={{
          maxHeight: 932,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: "rgba(99, 102, 241, 0.15)",
          // @ts-ignore — web-only shadow properties
          boxShadow: "0 0 80px rgba(99, 102, 241, 0.08)",
        }}
      >
        {/* Status bar mockup */}
        <View className="bg-dark-900 px-6 pt-2 pb-1 flex-row items-center justify-between">
          <Text className="text-dark-400 text-[11px] font-medium">9:41</Text>
          <View className="flex-row items-center gap-1.5">
            <View className="w-4 h-2.5 rounded-sm border border-dark-400 items-center justify-center">
              <View className="w-2.5 h-1.5 rounded-[1px] bg-dark-400" />
            </View>
          </View>
        </View>
        {children}
      </View>
    </View>
  );
}
