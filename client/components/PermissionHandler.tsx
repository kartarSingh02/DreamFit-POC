import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, SafeAreaView } from 'react-native';
import { Text } from './ui/Text';
import { Card } from './ui/Card';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { padding } from '../constants/Responsive';
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
  const { colors } = useTheme();
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
      // For web/PC, show permissions as pending so user can see the flow
      setPermissions(prev => prev.map(p => ({ ...p, status: 'pending' })));
      setIsLoading(false);
      return;
    }
    checkExistingPermissions();
  }, []);

  const checkExistingPermissions = async () => {
    try {
      // For mobile devices, check actual permissions
      if (Platform.OS !== 'web') {
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
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const requestPermission = async (permissionKey: string) => {
    if (isWeb) {
      // For web/PC, directly grant the permission (simulate)
      setPermissions(prev => prev.map(p => p.key === permissionKey ? { ...p, status: 'granted' } : p));
      // Show a brief feedback
      console.log(`Permission ${permissionKey} granted (simulated)`);
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
      <LinearGradient
        colors={colors.backgroundGradient as [string, string, string]}
        style={styles.bg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <Card style={styles.loadingCard}>
              <Text style={[styles.loadingText, { color: colors.secondaryText }]}>Checking permissions...</Text>
            </Card>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={colors.backgroundGradient as [string, string, string]}
      style={styles.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.5, 1]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primaryText }]}>Welcome to DreamFit</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Let's set up your experience</Text>
          </View>
          <View style={styles.permissionsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Required Permissions</Text>
            <Text style={[styles.sectionDescription, { color: colors.secondaryText }]}>These permissions help us provide the best experience for walking pools and challenges.</Text>
            {isWeb && (
              <Card style={styles.permissionCard}>
                <Text style={{ color: colors.accent, marginBottom: 8 }}>
                  💻 Development Mode: Click "Grant Permission" buttons to simulate permission requests. On real devices, this would show native permission dialogs.
                </Text>
              </Card>
            )}
            {permissions.map((permission) => (
              <Card key={permission.key} style={styles.permissionCard}>
                <Text style={[styles.permissionTitle, { color: colors.primaryText }]}>{permission.title}</Text>
                <Text style={[styles.permissionDescription, { color: colors.secondaryText }]}>{permission.description}</Text>
                <View style={styles.permissionActionRow}>
                  <Text style={[styles.permissionStatusLabel, { color: colors.secondaryText }]}> {permission.status === 'granted' ? '✅ Granted' : permission.required ? 'Required' : 'Optional'} </Text>
                  {permission.status !== 'granted' && (
                    <Text 
                      style={[styles.permissionButton, { color: colors.accent }]}
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
              style={[
                styles.continueButton, 
                { 
                  backgroundColor: colors.accent,
                  opacity: canContinue() ? 1 : 0.5,
                  color: '#fff'
                }
              ]}
              onPress={handleContinue}
            >
              {canContinue() ? 'Continue to App' : 'Grant Required Permissions'}
            </Text>
            <Text style={[styles.skipText, { color: colors.secondaryText }]}>You can change these permissions later in Settings</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: padding.lg,
    paddingTop: padding.sm,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  permissionsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  permissionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 13,
    marginBottom: 8,
  },
  permissionActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  permissionStatusLabel: {
    fontSize: 13,
  },
  permissionButton: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  loadingCard: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  continueButton: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    textAlign: 'center',
  },
  skipText: {
    fontSize: 12,
    marginTop: 4,
  },
  bg: {
    flex: 1,
  },
}); 