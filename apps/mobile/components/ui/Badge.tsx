import React from 'react';
import { View, Text } from 'react-native';

type BadgeVariant = 'safe' | 'danger' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  safe: { bg: 'bg-safe-500/20', text: 'text-safe-500' },
  danger: { bg: 'bg-danger-500/20', text: 'text-danger-500' },
  warning: { bg: 'bg-warning-500/20', text: 'text-warning-500' },
  info: { bg: 'bg-primary-500/20', text: 'text-primary-400' },
  neutral: { bg: 'bg-dark-700', text: 'text-dark-300' },
};

export default function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <View className={`px-2.5 py-1 rounded-full self-start ${styles.bg}`}>
      <Text className={`text-xs font-semibold ${styles.text}`}>{label}</Text>
    </View>
  );
}
