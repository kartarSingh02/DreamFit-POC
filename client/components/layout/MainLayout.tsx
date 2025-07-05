import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar } from '../navigation/BottomTabBar';
import { 
  HomeScreen, 
  ChallengesAndPoolsScreen, 
  AnalyticsScreen,
  LeaderboardScreen, 
  ProfileScreen,
  LoginScreen,
  RegisterScreen
} from '../screens';
import { PermissionHandler } from '../PermissionHandler';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';

interface MainLayoutProps {
  children?: React.ReactNode;
}

type AuthState = 'unauthenticated' | 'register' | 'authenticated' | 'permissionsGranted';

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  // Auth flow handlers
  const handleLoginSuccess = () => {
    setAuthState('authenticated');
  };
  const handleRegisterSuccess = () => {
    setAuthState('authenticated');
  };
  const handleSwitchToRegister = () => {
    setAuthState('register');
  };
  const handleSwitchToLogin = () => {
    setAuthState('unauthenticated');
  };
  const handlePermissionsGranted = () => {
    setAuthState('permissionsGranted');
  };

  // Render auth screens
  if (authState === 'unauthenticated') {
    return (
      <LinearGradient
        colors={Colors.backgroundGradient as [string, string, string]}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        </SafeAreaView>
      </LinearGradient>
    );
  }
  if (authState === 'register') {
    return (
      <LinearGradient
        colors={Colors.backgroundGradient as [string, string, string]}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <RegisterScreen onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={handleSwitchToLogin} />
        </SafeAreaView>
      </LinearGradient>
    );
  }
  if (authState === 'authenticated') {
    return (
      <LinearGradient
        colors={Colors.backgroundGradient as [string, string, string]}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <PermissionHandler onPermissionsGranted={handlePermissionsGranted} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Permissions granted, show main app
  return (
    <LinearGradient
      colors={Colors.backgroundGradient as [string, string, string]}
      style={styles.gradientBg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.5, 1]}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          {(() => {
            switch (activeTab) {
              case 'home':
                return <HomeScreen />;
              case 'challenges':
                return <ChallengesAndPoolsScreen />;
              case 'analytics':
                return <AnalyticsScreen />;
              case 'leaderboard':
                return <LeaderboardScreen />;
              case 'profile':
                return <ProfileScreen />;
              default:
                return children;
            }
          })()}
        </View>
      </SafeAreaView>
      <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
        <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  bottomSafeArea: {
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  debugIndicator: {
    backgroundColor: Colors.accent,
    padding: 8,
    alignItems: 'center',
  },
  debugText: {
    color: Colors.primaryText,
    fontWeight: 'bold',
  },
}); 