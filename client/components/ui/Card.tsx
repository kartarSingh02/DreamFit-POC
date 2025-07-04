import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

interface CardProps extends ViewProps {
  variant?: 'primary' | 'secondary';
  padding?: 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'primary',
  padding = 'medium',
  style,
  ...props
}) => {
  const getCardStyle = () => {
    const variantStyle = styles[variant];
    const paddingStyle = styles[`padding_${padding}`];
    
    return [variantStyle, paddingStyle, style];
  };

  return (
    <View style={getCardStyle()} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  primary: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  secondary: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  padding_small: {
    padding: 12,
  },
  padding_medium: {
    padding: 16,
  },
  padding_large: {
    padding: 24,
  },
}); 