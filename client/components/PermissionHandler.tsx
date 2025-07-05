import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Text } from './ui/Text';
import { Card } from './ui/Card';
import Colors from '../constants/Colors';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';

interface PermissionHandlerProps {
  onPermissionsGranted: () => void;
}

interface Permission {
  key: string;
  title: string;
  description: string;
  status: 'pending' | 'granted' | 'denied';
  required: boolean;
}

export const PermissionHandler: React.FC<PermissionHandlerProps> = ({ onPermissionsGranted }) => {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      key: 'activity',
      title: 'Activity Tracking',
      description: 'Track your steps and physical activity for walking pools and challenges',
      status: 'pending',
      required: true,
    },
    {
      key: 'location',
      title: 'Location Services',
      description: 'Improve step counting accuracy and enable location-based features',
      status: 'pending',
      required: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWeb, setIsWeb] = useState(false);

  useEffect(() => {
    // Detect if running on web/PC
    if (Platform.OS === 'web') {
      setIsWeb(true);
      // Mock all permissions as granted for web/PC
      setPermissions(prev => prev.map(p => ({ ...p, status: 'granted' })));
      setIsLoading(false);
      return;
    }
    checkExistingPermissions();
  }, []);

  const checkExistingPermissions = async () => {
    try {
      const activityStatus = await Pedometer.isAvailableAsync();
      const locationStatus = await Location.getForegroundPermissionsAsync();
      setPermissions(prev => prev.map(permission => {
        switch (permission.key) {
          case 'activity':
            return { ...permission, status: activityStatus ? 'granted' : 'pending' };
          case 'location':
            return { ...permission, status: locationStatus.status === 'granted' ? 'granted' : 'pending' };
          default:
            return permission;
        }
      }));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const requestPermission = async (permissionKey: string) => {
    if (isWeb) {
      // Instantly grant on web/PC
      setPermissions(prev => prev.map(p => p.key === permissionKey ? { ...p, status: 'granted' } : p));
      return;
    }
    try {
      let granted = false;
      switch (permissionKey) {
        case 'activity':
          Alert.alert(
            'Activity Tracking',
            'To enable step counting:\n\n1. Go to Settings > Privacy & Security > Motion & Fitness\n2. Enable "Fitness Tracking" for this app\n3. Return to the app',
            [
              { text: 'OK' }
            ]
          );
          return;
        case 'location':
          const locationResult = await Location.requestForegroundPermissionsAsync();
          granted = locationResult.status === 'granted';
          break;
      }
      setPermissions(prev => prev.map(p => p.key === permissionKey ? { ...p, status: granted ? 'granted' : 'denied' } : p));
    } catch (error) {}
  };

  const handleContinue = () => {
    const requiredPermissions = permissions.filter(p => p.required);
    const grantedRequired = requiredPermissions.every(p => p.status === 'granted');
    if (grantedRequired) {
      onPermissionsGranted();
    } else {
      Alert.alert(
        'Required Permissions',
        'Activity tracking permission is required to use the app. Please grant the necessary permissions.',
        [{ text: 'OK' }]
      );
    }
  };

  const canContinue = () => {
    const requiredPermissions = permissions.filter(p => p.required);
    return requiredPermissions.every(p => p.status === 'granted');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Card style={styles.loadingCard}>
          <Text style={styles.loadingText}>Checking permissions...</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to DreamFit</Text>
        <Text style={styles.subtitle}>Let's set up your experience</Text>
      </View>
      <View style={styles.permissionsContainer}>
        <Text style={styles.sectionTitle}>Required Permissions</Text>
        <Text style={styles.sectionDescription}>
          These permissions help us provide the best experience for walking pools and challenges.
        </Text>
        {isWeb && (
          <Card style={styles.permissionCard}>
            <Text style={{ color: Colors.warning, marginBottom: 8 }}>
              Step tracking is only available on mobile devices. Permissions are mocked for development.
            </Text>
          </Card>
        )}
        {permissions.map((permission) => (
          <Card key={permission.key} style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>{permission.title}</Text>
            <Text style={styles.permissionDescription}>{permission.description}</Text>
            <View style={styles.permissionActionRow}>
              <Text style={styles.permissionStatusLabel}>
                {permission.status === 'granted' ? 'Granted' : permission.required ? 'Required' : 'Optional'}
              </Text>
              {permission.status !== 'granted' && (
                <Text 
                  style={styles.permissionButton}
                  onPress={() => requestPermission(permission.key)}
                >
                  Grant Permission
                </Text>
              )}
            </View>
          </Card>
        ))}
      </View>
      <View style={styles.footer}>
        <Text 
          style={[styles.continueButton, !canContinue() && styles.continueButtonDisabled]}
          onPress={handleContinue}
        >
          {canContinue() ? 'Continue to App' : 'Grant Required Permissions'}
        </Text>
        <Text style={styles.skipText}>
          You can change these permissions later in Settings
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2222',
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  permissionsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 16,
  },
  permissionCard: {
    backgroundColor: '#122D2D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  permissionActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  permissionStatusLabel: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  permissionButton: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  loadingCard: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    color: Colors.secondaryText,
    fontSize: 16,
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  continueButton: {
    backgroundColor: Colors.accent,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    textAlign: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.secondaryText,
    color: '#888',
  },
  skipText: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 4,
  },
}); 