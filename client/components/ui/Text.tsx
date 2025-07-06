import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CustomTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'accent';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export const Text: React.FC<CustomTextProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  weight = 'normal',
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const getTextStyle = () => {
    const variantStyle = styles[variant];
    const colorStyle = {
      color: color === 'primary' ? colors.primaryText : 
             color === 'secondary' ? colors.secondaryText : 
             colors.accent
    };
    const weightStyle = styles[`weight_${weight}`];
    
    return [variantStyle, colorStyle, weightStyle, style];
  };

  return (
    <RNText style={getTextStyle()} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  // Variants
  h1: {
    fontSize: 30,
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Weights
  weight_normal: {
    fontWeight: '400',
  },
  weight_medium: {
    fontWeight: '500',
  },
  weight_semibold: {
    fontWeight: '600',
  },
  weight_bold: {
    fontWeight: '700',
  },
}); 