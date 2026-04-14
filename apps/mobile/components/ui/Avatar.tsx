import React from 'react';
import { View, Text } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name: string;
  size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: 'w-8 h-8 rounded-full', text: 'text-xs font-bold' },
  md: { container: 'w-10 h-10 rounded-full', text: 'text-sm font-bold' },
  lg: { container: 'w-14 h-14 rounded-full', text: 'text-lg font-bold' },
};

const avatarColors = [
  'bg-primary-500',
  'bg-safe-500',
  'bg-warning-500',
  'bg-danger-500',
  'bg-primary-700',
  'bg-primary-400',
  'bg-safe-600',
  'bg-warning-600',
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function Avatar({ name, size = 'md' }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const colorClass = avatarColors[hashName(name) % avatarColors.length];
  const s = sizeStyles[size];

  return (
    <View className={`${s.container} ${colorClass} items-center justify-center`}>
      <Text className={`${s.text} text-white`}>{initial}</Text>
    </View>
  );
}
