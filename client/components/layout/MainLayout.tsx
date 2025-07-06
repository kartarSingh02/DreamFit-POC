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
import { useTheme } from '../../contexts/ThemeContext';

interface MainLayoutProps {
  children?: React.ReactNode;
}

type AppState = 'signin' | 'permissions' | 'main';

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [analyticsScrollTo, setAnalyticsScrollTo] = useState<string | undefined>(undefined);
  const [appState, setAppState] = useState<AppState>('signin');
  const { colors } = useTheme();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTabSwitch = (tab: string, section?: string) => {
    setActiveTab(tab);
    if (section) {
      setAnalyticsScrollTo(section);
    }
  };

  const handleSignInSuccess = () => {
    setAppState('permissions');
  };

  const handlePermissionsGranted = () => {
    setAppState('main');
  };

  // Show sign-in screen first
  if (appState === 'signin') {
    return (
      <LinearGradient
        colors={colors.backgroundGradient as [string, string, string]}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <LoginScreen onLoginSuccess={handleSignInSuccess} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Show permission handler after sign-in
  if (appState === 'permissions') {
    return (
      <LinearGradient
        colors={colors.backgroundGradient as [string, string, string]}
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

  // Show main app after permissions granted
  return (
    <LinearGradient
      colors={colors.backgroundGradient as [string, string, string]}
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
                return <HomeScreen onTabSwitch={handleTabSwitch} />;
              case 'challenges':
                return <ChallengesAndPoolsScreen />;
              case 'analytics':
                return <AnalyticsScreen scrollToSection={analyticsScrollTo} />;
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
}); 