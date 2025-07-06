import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { colors, theme } = useTheme();

  const getCardStyle = () => {
    const variantStyle = { 
      backgroundColor: colors.cardBackground, 
      borderColor: colors.borderColor,
      borderWidth: 1, // Always show border
      // Add shadows for light theme
      ...(theme === 'light' && {
        shadowColor: colors.shadowColor,
        shadowOffset: colors.shadowOffset,
        shadowOpacity: colors.shadowOpacity,
        shadowRadius: colors.shadowRadius,
        elevation: colors.elevation,
      })
    };
    const paddingStyle = styles[`padding_${padding}`];
    
    return [styles.base, variantStyle, paddingStyle, style];
  };

  return (
    <View style={getCardStyle()} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    borderWidth: 1,
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