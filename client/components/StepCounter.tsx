import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './ui/Text';
import { useStepCounter } from './StepCounterContext';

export const StepCounter: React.FC = () => {
  const { isActive, stepCount, start, stop, lastResult } = useStepCounter();

  return (
    <View style={styles.stepCard}>
      {isActive ? (
        <View style={styles.stepCardContent}>
          <Text variant="h3" weight="bold" style={styles.stepCardTitle}>
            Step Counter Test
          </Text>
          <View style={styles.stepCountContainer}>
            <Text variant="h1" weight="bold" color="accent" style={styles.stepCount}>
              {stepCount}
            </Text>
            <Text variant="body" color="secondary" style={styles.stepLabel}>
              steps
            </Text>
          </View>
          <TouchableOpacity style={styles.stopButton} onPress={stop} activeOpacity={0.8}>
            <Text variant="body" weight="semibold" color="primary">
              Stop Test
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.stepCardContent}>
          <Text variant="h3" weight="bold" style={styles.stepCardTitle}>
            Test Your Step Counter
          </Text>
          <Text variant="body" color="secondary" style={styles.stepCardDescription}>
            Take a quick test to calibrate your step counter and ensure accurate tracking
          </Text>
          <TouchableOpacity style={styles.stepButton} onPress={start} activeOpacity={0.8}>
            <Text variant="body" weight="semibold" color="primary">
              Start Test
            </Text>
          </TouchableOpacity>
          {lastResult !== null && (
            <Text style={{ marginTop: 16, color: '#ff6b35', fontWeight: 'bold', fontSize: 16 }}>
              You walked {lastResult} steps!
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stepCard: {
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },
  stepCardContent: {
    alignItems: 'center',
  },
  stepCardTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  stepCardDescription: {
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  stepCountContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  stepCount: {
    fontSize: 48,
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 16,
  },
  stepButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
}); 