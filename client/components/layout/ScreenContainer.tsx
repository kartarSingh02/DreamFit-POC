import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { padding } from '../../constants/Responsive';

export const ScreenContainer: React.FC<ViewProps> = ({ children, style, ...props }) => {
  const { colors } = useTheme();
  
  return (
    <LinearGradient colors={colors.backgroundGradient as [string, string]} style={styles.gradient}>
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.container, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  </LinearGradient>
);
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: padding.lg,
  },
}); 