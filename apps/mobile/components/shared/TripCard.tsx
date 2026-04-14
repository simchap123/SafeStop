import React from 'react';
import { View, Text } from 'react-native';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { ConfirmationType, SessionState } from '../../lib/types';

interface TripCardProps {
  date: string;
  childName: string;
  state: SessionState;
  confirmationType?: ConfirmationType;
  duration: string;
  onPress?: () => void;
}

const stateDisplay: Record<SessionState, { label: string; variant: 'safe' | 'danger' | 'warning' | 'info' | 'neutral' }> = {
  [SessionState.IDLE]: { label: 'Idle', variant: 'neutral' },
  [SessionState.DRIVING]: { label: 'In Progress', variant: 'info' },
  [SessionState.STOP_DETECTED]: { label: 'Stop Detected', variant: 'warning' },
  [SessionState.AWAITING_CONFIRMATION]: { label: 'Awaiting', variant: 'warning' },
  [SessionState.CONFIRMED_SAFE]: { label: 'Confirmed', variant: 'safe' },
  [SessionState.ALERT_TRIGGERED]: { label: 'Alert', variant: 'danger' },
  [SessionState.ESCALATED]: { label: 'Escalated', variant: 'danger' },
};

const confirmationLabels: Record<ConfirmationType, string> = {
  photo: 'Photo',
  manual: 'Manual',
  auto: 'Auto',
  co_parent: 'Co-Parent',
};

export default function TripCard({
  date,
  childName,
  state,
  confirmationType,
  duration,
  onPress,
}: TripCardProps) {
  const display = stateDisplay[state];

  return (
    <Card variant="outlined" pressable={!!onPress} onPress={onPress}>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-dark-400 text-xs">{date}</Text>
        <Badge label={display.label} variant={display.variant} />
      </View>
      <Text className="text-white text-base font-semibold mb-1">{childName}</Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-dark-400 text-sm">{duration}</Text>
        {confirmationType && (
          <Text className="text-dark-500 text-xs">
            {confirmationLabels[confirmationType]}
          </Text>
        )}
      </View>
    </Card>
  );
}
