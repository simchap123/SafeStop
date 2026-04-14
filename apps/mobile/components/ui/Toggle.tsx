import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Colors } from '../../lib/constants';

interface ToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
}: ToggleProps) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-1 mr-4">
        <Text className="text-white text-base font-medium">{label}</Text>
        {description && (
          <Text className="text-dark-400 text-sm mt-1">{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: Colors.dark[700], true: Colors.primary[500] }}
        thumbColor={Colors.white}
      />
    </View>
  );
}
