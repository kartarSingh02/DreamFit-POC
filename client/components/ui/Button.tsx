import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-bg-secondary';
      case 'secondary':
        return 'bg-bg-primary border border-text-secondary';
      case 'accent':
        return 'bg-accent';
      default:
        return 'bg-bg-secondary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2';
      case 'medium':
        return 'px-4 py-3';
      case 'large':
        return 'px-6 py-4';
      default:
        return 'px-4 py-3';
    }
  };

  return (
    <TouchableOpacity
      className={`rounded-lg ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      activeOpacity={0.8}
      {...props}
    >
      <Text className={`text-center font-semibold ${
        variant === 'secondary' ? 'text-text-primary' : 'text-text-primary'
      }`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}; 