import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import cn from 'clsx';

const variantClasses = {
  primary: {
    button: "bg-emerald-500",
    text: "text-white",
  },
  danger: {
    button: "bg-red-500",
    text: "text-white",
  },
  secondary: {
    button: "bg-gray-200",
    text: "text-gray-800",
  },
  disabled: {
    button: "bg-gray-400",
    text: "text-white",
  },
};

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  style?: string;
  textStyle?: string;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) => {
  // Determine which variant to use
  const currentVariant = disabled ? 'disabled' : variant;

  return (
    <TouchableOpacity
      className={cn(
        'rounded-xl min-h-14 px-6 py-4 items-center justify-center',
        variantClasses[currentVariant].button,
        style
      )}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variantClasses[currentVariant].text === 'text-white' ? 'white' : 'black'} />
      ) : (
        <Text
          className={cn(
            'text-base font-semibold',
            variantClasses[currentVariant].text,
            textStyle
          )}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
