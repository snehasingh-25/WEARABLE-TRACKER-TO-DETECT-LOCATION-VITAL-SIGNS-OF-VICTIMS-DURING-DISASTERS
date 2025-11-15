import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cn from 'clsx';
import Card from './Card';

interface VitalSignCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  unit: string;
  color?: string;
  style?: string;
}

const VitalSignCard = ({
  icon,
  label,
  value,
  unit,
  color = '#10b981',
  style,
}: VitalSignCardProps) => {
  return (
    <Card style={cn('items-center min-w-[150px]', style)}>
      <View className="mb-3">
        <Ionicons name={icon} size={32} color={color} />
      </View>

      <Text className="text-sm text-gray-500 mb-2">{label}</Text>

      <View className="flex-row items-baseline">
        <Text className="text-xl font-bold text-gray-800">{value}</Text>
        <Text className="text-base text-gray-500 ml-1">{unit}</Text>
      </View>
    </Card>
  );
};

export default VitalSignCard;
