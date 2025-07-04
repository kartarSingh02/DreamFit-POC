import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { BottomTabBar } from '../navigation/BottomTabBar';
import { 
  HomeScreen, 
  TrendingScreen, 
  ChallengesScreen, 
  LeaderboardScreen, 
  ProfileScreen 
} from '../screens';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabPress = (tabKey: string) => {
    console.log('Tab pressed:', tabKey);
    setActiveTab(tabKey);
  };

  const renderTabContent = () => {
    console.log('Rendering tab content for:', activeTab);
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'trending':
        return <TrendingScreen />;
      case 'challenges':
        return <ChallengesScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return children;
    }
  };

  return (
    <LinearGradient
      colors={Colors.backgroundGradient as [string, string, string]}
      style={styles.gradientBg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.5, 1]}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {renderTabContent()}
        </View>
        <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
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