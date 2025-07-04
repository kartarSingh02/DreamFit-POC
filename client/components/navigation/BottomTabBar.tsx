import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { isSmallScreen, iconSize, fontSize, padding } from '../../constants/Responsive';

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
    <LinearGradient
      colors={['#0A1A1A', '#1A2E2E']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
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
                size={iconSize.md}
                color={isActive ? '#4A9B8F' : '#9ca3af'}
              />
              <Text
                variant="caption"
                color={isActive ? 'accent' : 'secondary'}
                weight="medium"
                style={[styles.tabText, { fontSize: fontSize.xs }]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(74, 155, 143, 0.15)',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  tabContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: padding.sm,
    paddingHorizontal: 0,
    width: '100%',
  },
  tabButton: {
    alignItems: 'center' as const,
    flex: 1,
    paddingVertical: padding.sm,
    paddingHorizontal: 0,
    borderRadius: 8,
  },
  tabText: {
    marginTop: 4,
  },
}); 