import React from 'react';
import { View, Pressable, ViewProps } from 'react-native';

type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  pressable?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-dark-800 rounded-2xl p-4',
  elevated: 'bg-dark-800 rounded-2xl p-4 shadow-lg shadow-black/30',
  outlined: 'bg-dark-800 rounded-2xl p-4 border border-dark-700',
};

export default function Card({
  variant = 'default',
  pressable = false,
  onPress,
  children,
  className: extraClass,
  ...props
}: CardProps) {
  const baseClass = `${variantStyles[variant]} ${extraClass ?? ''}`;

  if (pressable && onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={baseClass}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        {...(props as any)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={baseClass} {...props}>
      {children}
    </View>
  );
}
