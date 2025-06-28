import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';

interface TabItem {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tabKey: string) => void;
}

const tabs: TabItem[] = [
  {
    key: 'home',
    title: 'Home',
    icon: 'home',
    route: 'home'
  },
  {
    key: 'trending',
    title: 'Trending',
    icon: 'flame',
    route: 'trending'
  },
  {
    key: 'challenges',
    title: 'Challenges',
    icon: 'locate',
    route: 'challenges'
  },
  {
    key: 'leaderboard',
    title: 'Leaderboard',
    icon: 'trophy',
    route: 'leaderboard'
  },
  {
    key: 'profile',
    title: 'Profile',
    icon: 'person',
    route: 'profile'
  }
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabPress
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={24}
                color={isActive ? '#ff6b35' : '#9ca3af'}
              />
              <Text
                variant="caption"
                color={isActive ? 'accent' : 'secondary'}
                weight="medium"
                style={styles.tabText}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#2d2d2d',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabText: {
    marginTop: 4,
  },
}); 