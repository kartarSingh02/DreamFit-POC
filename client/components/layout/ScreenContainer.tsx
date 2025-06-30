import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

export const ScreenContainer: React.FC<ViewProps> = ({ children, style, ...props }) => (
  <View style={[styles.container, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
}); 