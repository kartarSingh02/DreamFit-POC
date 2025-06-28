import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { BottomTabBar } from '../navigation/BottomTabBar';
import { 
  HomeScreen, 
  TrendingScreen, 
  ChallengesScreen, 
  LeaderboardScreen, 
  ProfileScreen 
} from '../screens';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const renderTabContent = () => {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderTabContent()}
      </View>
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
}); 