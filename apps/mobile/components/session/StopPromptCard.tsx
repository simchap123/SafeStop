import React from 'react';
import { View, Text } from 'react-native';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface StopPromptCardProps {
  childName: string;
  locationName?: string;
  timeRemaining: number; // seconds
  onConfirmSafe: () => void;
  onTakePhoto: () => void;
  onDismiss?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function StopPromptCard({
  childName,
  locationName,
  timeRemaining,
  onConfirmSafe,
  onTakePhoto,
  onDismiss,
}: StopPromptCardProps) {
  const isUrgent = timeRemaining <= 30;

  return (
    <Card variant="outlined" className={isUrgent ? 'border-danger-500' : 'border-warning-500'}>
      {/* Header */}
      <View className="items-center mb-4">
        <Text className="text-2xl mb-2">
          {isUrgent ? '\u26A0\uFE0F' : '\uD83D\uDE97'}
        </Text>
        <Text className="text-white text-lg font-bold text-center">
          Vehicle Stopped
        </Text>
        <Text className="text-dark-400 text-sm text-center mt-1">
          Is {childName} safe?
        </Text>
        {locationName && (
          <Text className="text-dark-500 text-xs text-center mt-1">
            Near {locationName}
          </Text>
        )}
      </View>

      {/* Timer */}
      <View className={`rounded-xl py-3 px-4 items-center mb-4 ${isUrgent ? 'bg-danger-500/20' : 'bg-warning-500/20'}`}>
        <Text className={`text-xs font-medium ${isUrgent ? 'text-danger-500' : 'text-warning-500'}`}>
          Time remaining
        </Text>
        <Text className={`text-2xl font-bold ${isUrgent ? 'text-danger-500' : 'text-warning-500'}`}>
          {formatTime(timeRemaining)}
        </Text>
      </View>

      {/* Actions */}
      <View className="gap-3">
        <Button
          title="Confirm Safe"
          onPress={onConfirmSafe}
          variant="safe"
          size="lg"
          icon={<Text className="text-white">{'\u2713'}</Text>}
        />
        <Button
          title="Take Verification Photo"
          onPress={onTakePhoto}
          variant="outline"
          size="md"
          icon={<Text className="text-white">{'\uD83D\uDCF7'}</Text>}
        />
        {onDismiss && (
          <Button
            title="Child Not in Vehicle"
            onPress={onDismiss}
            variant="ghost"
            size="sm"
          />
        )}
      </View>
    </Card>
  );
}
