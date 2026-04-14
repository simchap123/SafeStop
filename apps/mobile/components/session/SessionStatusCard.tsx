import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { SessionState } from '../../lib/types';
import Badge from '../ui/Badge';

interface SessionStatusCardProps {
  childName: string;
  state: SessionState;
  duration: string;
  destinationName?: string;
}

const stateConfig: Record<
  SessionState,
  { label: string; bannerClass: string; badgeVariant: 'safe' | 'danger' | 'warning' | 'info' | 'neutral' }
> = {
  [SessionState.IDLE]: { label: 'Idle', bannerClass: 'bg-dark-700', badgeVariant: 'neutral' },
  [SessionState.DRIVING]: { label: 'Driving', bannerClass: 'bg-primary-500', badgeVariant: 'info' },
  [SessionState.STOP_DETECTED]: { label: 'Stop Detected', bannerClass: 'bg-warning-500', badgeVariant: 'warning' },
  [SessionState.AWAITING_CONFIRMATION]: { label: 'Awaiting Confirmation', bannerClass: 'bg-warning-500', badgeVariant: 'warning' },
  [SessionState.CONFIRMED_SAFE]: { label: 'Confirmed Safe', bannerClass: 'bg-safe-500', badgeVariant: 'safe' },
  [SessionState.ALERT_TRIGGERED]: { label: 'Alert Triggered', bannerClass: 'bg-danger-500', badgeVariant: 'danger' },
  [SessionState.ESCALATED]: { label: 'Escalated', bannerClass: 'bg-danger-600', badgeVariant: 'danger' },
};

const activeStates = new Set([
  SessionState.DRIVING,
  SessionState.STOP_DETECTED,
  SessionState.AWAITING_CONFIRMATION,
  SessionState.ALERT_TRIGGERED,
  SessionState.ESCALATED,
]);

export default function SessionStatusCard({
  childName,
  state,
  duration,
  destinationName,
}: SessionStatusCardProps) {
  const config = stateConfig[state];
  const isActive = activeStates.has(state);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.6, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive]);

  return (
    <View className="bg-dark-800 rounded-2xl overflow-hidden">
      {/* Color banner */}
      <View className={`${config.bannerClass} px-4 py-3 flex-row items-center justify-between`}>
        <Text className="text-white font-semibold text-sm">{config.label}</Text>
        {isActive && (
          <Animated.View
            className="w-2.5 h-2.5 rounded-full bg-white"
            style={{ opacity: pulseAnim }}
          />
        )}
      </View>

      {/* Content */}
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-lg font-bold">{childName}</Text>
          <Badge label={config.label} variant={config.badgeVariant} />
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-dark-400 text-sm">Duration: {duration}</Text>
          {destinationName && (
            <Text className="text-dark-400 text-sm">{destinationName}</Text>
          )}
        </View>
      </View>
    </View>
  );
}
