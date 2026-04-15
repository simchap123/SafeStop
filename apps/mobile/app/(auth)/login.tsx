import React, { useState } from "react";
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ShieldLogo from "../../components/ui/ShieldLogo";
import { signIn } from "../../lib/api";
import { loadUserData } from "../../lib/load-data";
import { showAlert } from "../../lib/alert";
import { useApp } from "../../lib/store";

export default function LoginScreen() {
  const { dispatch } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const result = await signIn(email, password);
      dispatch({
        type: "LOGIN",
        payload: {
          user: {
            id: result.user.id,
            displayName: result.user.name,
            email: result.user.email,
            createdAt: result.user.createdAt ?? new Date().toISOString(),
            updatedAt: result.user.updatedAt ?? new Date().toISOString(),
          },
          family: null as any,
        },
      });
      await loadUserData(dispatch);
      router.replace("/(tabs)");
    } catch (err: any) {
      showAlert("Login Failed", err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-8 py-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <Pressable onPress={() => router.back()} className="mb-8">
            <Text className="text-primary-400 text-base">← Back</Text>
          </Pressable>

          {/* Logo */}
          <View className="items-center mb-10">
            <ShieldLogo size="sm" />
          </View>

          {/* Header */}
          <Text className="text-white text-2xl font-bold mb-1">Welcome back</Text>
          <Text className="text-dark-300 text-base mb-8">
            Sign in to your SafeStop account
          </Text>

          {/* Form */}
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
            error={errors.password}
          />

          {/* Forgot password */}
          <Pressable className="self-end mb-6">
            <Text className="text-primary-400 text-sm">Forgot password?</Text>
          </Pressable>

          {/* Submit */}
          <Button title="Sign In" onPress={handleSignIn} loading={loading} />

          {/* Sign up link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-dark-400 text-sm">Don't have an account? </Text>
            <Link href="/(auth)/signup">
              <Text className="text-primary-400 text-sm font-semibold">Sign Up</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
