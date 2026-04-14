import React from 'react';
import { View, Text } from 'react-native';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface ChildCardProps {
  name: string;
  status: 'safe' | 'in_transit' | 'needs_attention' | 'idle';
  lastActivity?: string;
  onPress?: () => void;
}

const statusConfig: Record<
  ChildCardProps['status'],
  { label: string; variant: 'safe' | 'danger' | 'warning' | 'info' | 'neutral' }
> = {
  safe: { label: 'Safe', variant: 'safe' },
  in_transit: { label: 'In Transit', variant: 'info' },
  needs_attention: { label: 'Needs Attention', variant: 'danger' },
  idle: { label: 'Idle', variant: 'neutral' },
};

export default function ChildCard({ name, status, lastActivity, onPress }: ChildCardProps) {
  const config = statusConfig[status];

  return (
    <Card variant="outlined" pressable={!!onPress} onPress={onPress}>
      <View className="flex-row items-center">
        <Avatar name={name} size="lg" />
        <View className="flex-1 ml-3">
          <Text className="text-white text-base font-semibold">{name}</Text>
          {lastActivity && (
            <Text className="text-dark-400 text-xs mt-1">{lastActivity}</Text>
          )}
        </View>
        <Badge label={config.label} variant={config.variant} />
      </View>
    </Card>
  );
}
