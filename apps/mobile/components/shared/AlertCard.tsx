import React from 'react';
import { View, Text } from 'react-native';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { AlertSeverity } from '../../lib/types';

interface AlertCardProps {
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  resolved?: boolean;
  onResolve?: () => void;
}

const severityConfig: Record<AlertSeverity, { icon: string; borderClass: string; textClass: string }> = {
  low: { icon: '\u2139\uFE0F', borderClass: 'border-dark-600', textClass: 'text-dark-300' },
  medium: { icon: '\u26A0\uFE0F', borderClass: 'border-warning-500', textClass: 'text-warning-500' },
  high: { icon: '\uD83D\uDEA8', borderClass: 'border-danger-500', textClass: 'text-danger-500' },
  critical: { icon: '\uD83D\uDD34', borderClass: 'border-danger-600', textClass: 'text-danger-500' },
};

export default function AlertCard({
  message,
  severity,
  timestamp,
  resolved = false,
  onResolve,
}: AlertCardProps) {
  const config = severityConfig[severity];

  return (
    <Card variant="outlined" className={config.borderClass}>
      <View className="flex-row items-start">
        <Text className="text-lg mr-3">{config.icon}</Text>
        <View className="flex-1">
          <Text className={`text-sm font-medium ${resolved ? 'text-dark-500' : 'text-white'}`}>
            {message}
          </Text>
          <Text className="text-dark-500 text-xs mt-1">{timestamp}</Text>
          {resolved && (
            <Text className="text-safe-500 text-xs mt-1">Resolved</Text>
          )}
        </View>
      </View>
      {!resolved && onResolve && (
        <View className="mt-3">
          <Button
            title="Resolve"
            onPress={onResolve}
            variant="outline"
            size="sm"
            fullWidth={false}
          />
        </View>
      )}
    </Card>
  );
}
