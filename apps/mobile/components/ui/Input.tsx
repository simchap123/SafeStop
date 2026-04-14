import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  isPassword = false,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderClass = error
    ? 'border-danger-500'
    : focused
    ? 'border-primary-500'
    : 'border-dark-300';

  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-dark-300 text-sm font-medium mb-2">{label}</Text>
      )}
      <View className="relative flex-row items-center">
        {leftIcon && (
          <View className="absolute left-3 z-10">{leftIcon}</View>
        )}
        <TextInput
          className={`flex-1 bg-dark-800 border ${borderClass} rounded-xl px-4 py-3.5 text-white text-base ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon || isPassword ? 'pr-14' : ''}`}
          placeholderTextColor="#64748B"
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4"
          >
            <Text className="text-dark-400 text-sm">
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        )}
        {rightIcon && !isPassword && (
          <View className="absolute right-3">{rightIcon}</View>
        )}
      </View>
      {error && (
        <Text className="text-danger-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}
