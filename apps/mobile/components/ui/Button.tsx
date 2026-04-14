import React from 'react';
import { Text, Pressable, ActivityIndicator, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'safe';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string; indicatorColor: string }> = {
  primary: {
    container: 'bg-primary-500',
    text: 'text-white font-semibold',
    indicatorColor: '#FFFFFF',
  },
  secondary: {
    container: 'bg-dark-700',
    text: 'text-white font-semibold',
    indicatorColor: '#FFFFFF',
  },
  outline: {
    container: 'border border-dark-500 bg-transparent',
    text: 'text-white font-semibold',
    indicatorColor: '#FFFFFF',
  },
  danger: {
    container: 'bg-danger-500',
    text: 'text-white font-semibold',
    indicatorColor: '#FFFFFF',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-primary-400 font-semibold',
    indicatorColor: '#818CF8',
  },
  safe: {
    container: 'bg-safe-500',
    text: 'text-white font-semibold',
    indicatorColor: '#FFFFFF',
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'px-3 py-2 rounded-lg', text: 'text-sm' },
  md: { container: 'px-5 py-3 rounded-xl', text: 'text-base' },
  lg: { container: 'px-6 py-4 rounded-2xl', text: 'text-base' },
  xl: { container: 'px-8 py-5 rounded-2xl', text: 'text-lg' },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  fullWidth = true,
  icon,
}: ButtonProps) {
  const vStyles = variantStyles[variant];
  const sStyles = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${sStyles.container} ${vStyles.container} ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50' : ''}`}
      style={({ pressed }) => ({ opacity: pressed && !disabled ? 0.7 : disabled ? 0.5 : 1 })}
    >
      {loading ? (
        <ActivityIndicator color={vStyles.indicatorColor} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className={`${sStyles.text} ${vStyles.text}`}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}
