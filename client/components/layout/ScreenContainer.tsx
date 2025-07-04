import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

export const ScreenContainer: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <LinearGradient colors={Colors.backgroundGradient as [string, string]} style={styles.gradient}>
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
}); 