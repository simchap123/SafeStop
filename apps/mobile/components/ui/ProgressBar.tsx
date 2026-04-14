import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export default function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View className="w-full mb-6">
      <View className="flex-row justify-between mb-2">
        <Text className="text-dark-300 text-xs font-medium">
          Step {currentStep} of {totalSteps}
        </Text>
        <Text className="text-dark-400 text-xs">{Math.round(progress)}%</Text>
      </View>
      <View className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
        <Animated.View
          className="h-full bg-primary-500 rounded-full"
          style={{
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
      {labels && labels.length > 0 && (
        <View className="flex-row justify-between mt-2">
          {labels.map((label, index) => (
            <Text
              key={index}
              className={`text-xs ${
                index + 1 <= currentStep ? 'text-primary-400 font-medium' : 'text-dark-500'
              }`}
            >
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
