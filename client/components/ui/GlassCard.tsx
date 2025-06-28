import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassCardProps {
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ style, children }) => (
  <View style={[styles.outer, style]}>
    <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
    <LinearGradient
      colors={["rgba(255,255,255,0.22)", "rgba(255,255,255,0.10)"]}
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
    <View style={styles.inner}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  outer: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  inner: {
    padding: 24,
    borderRadius: 22,
  },
}); 