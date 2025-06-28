import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { Text } from './ui/Text';

export const StepCounter: React.FC = () => {
  const [isStepTestActive, setIsStepTestActive] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    checkPedometerAvailability();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const checkPedometerAvailability = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      console.log('Pedometer available:', isAvailable);
      setIsPedometerAvailable(isAvailable);
    } catch (error) {
      console.log('Error checking pedometer:', error);
      setIsPedometerAvailable(false);
    }
  };

  const startStepTest = async () => {
    try {
      console.log('Starting step test...');
      
      // Request location permissions
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', locationStatus);
      
      if (locationStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is needed for accurate step counting. Please enable it in settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Request activity recognition permission (Android only)
      if (Platform.OS === 'android') {
        const activityStatus = await PermissionsAndroid.request(
          'android.permission.ACTIVITY_RECOGNITION',
          {
            title: 'Activity Recognition Permission',
            message: 'DreamFit needs access to your physical activity to count steps.',
            buttonPositive: 'OK',
          }
        );
        if (activityStatus !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Required',
            'Activity Recognition permission is needed for step counting. Please enable it in settings.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      // Check if pedometer is available
      if (!isPedometerAvailable) {
        Alert.alert(
          'Step Counter Not Available',
          'Step counting is not available on this device. Please try on a device with motion sensors.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Start step counting
      const newSubscription = Pedometer.watchStepCount((result) => {
        console.log('Step count update:', result.steps);
        setStepCount(result.steps);
      });

      setSubscription(newSubscription);
      setIsStepTestActive(true);
      setStepCount(0);
      
      console.log('Step test started successfully');
    } catch (error) {
      console.log('Error starting step test:', error);
      Alert.alert(
        'Error',
        'Failed to start step counter. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const stopStepTest = () => {
    console.log('Stopping step test...');
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    setIsStepTestActive(false);
    setStepCount(0);
    console.log('Step test stopped');
  };

  const renderStepCounterContent = () => {
    if (isStepTestActive) {
      return (
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
          <TouchableOpacity style={styles.stopButton} onPress={stopStepTest} activeOpacity={0.8}>
            <Text variant="body" weight="semibold" color="primary">
              Stop Test
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.stepCardContent}>
        <Text variant="h3" weight="bold" style={styles.stepCardTitle}>
          Test Your Step Counter
        </Text>
        <Text variant="body" color="secondary" style={styles.stepCardDescription}>
          Take a quick test to calibrate your step counter and ensure accurate tracking
        </Text>
        <TouchableOpacity style={styles.stepButton} onPress={startStepTest} activeOpacity={0.8}>
          <Text variant="body" weight="semibold" color="primary">
            Start Test
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.stepCard}>
      {renderStepCounterContent()}
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