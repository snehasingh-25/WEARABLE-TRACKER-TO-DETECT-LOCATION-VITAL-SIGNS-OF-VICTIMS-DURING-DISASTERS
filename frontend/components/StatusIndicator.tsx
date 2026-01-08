import React from 'react';
import { View, Text } from 'react-native';
import cn from 'clsx';

interface StatusIndicatorProps {
  status: 'Safe' | 'Risk';
  size?: 'small' | 'large';
}

const StatusIndicator = ({ status, size = 'large' }: StatusIndicatorProps) => {
  const isSafe = status === 'Safe';
  const isSmall = size === 'small';

  return (
    <View
      className={cn(
        'flex-row items-center rounded-full',
        isSmall ? 'px-3 py-1' : 'px-5 py-3',
      )}
    >
      <View
        className={cn(
          'rounded-full mr-2',
          isSmall ? 'w-2 h-2' : 'w-3 h-3',
          isSafe ? 'bg-green-500' : 'bg-red-500'
        )}
      />
      <Text
        className={cn(
          'font-semibold',
          isSmall ? 'text-sm' : 'text-lg',
          isSafe ? 'text-green-500' : 'text-red-500'
        )}
      >
        {status}
      </Text>
    </View>
  );
};

export default StatusIndicator;
