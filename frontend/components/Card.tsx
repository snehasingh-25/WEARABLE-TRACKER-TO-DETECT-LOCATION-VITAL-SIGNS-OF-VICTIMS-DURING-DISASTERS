import React, { ReactNode } from 'react';
import { View } from 'react-native';
import cn from 'clsx';
import { CardProps } from '@/type';

const Card = ({ children, style }: CardProps) => {
  return <View className={cn('card', style)}>{children}</View>;
};

export default Card;
