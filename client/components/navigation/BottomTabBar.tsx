import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { fontSize } from '../../constants/Responsive';
import { useTheme } from '../../contexts/ThemeContext';

interface TabItem {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const tabs: TabItem[] = [
  {
    key: 'home',
    title: 'Home',
    icon: 'home',
    route: 'home'
  },
  {
    key: 'challenges',
    title: 'Challenges',
    icon: 'trophy',
    route: 'challenges'
  },
  {
    key: 'analytics',
    title: 'Analytics',
    icon: 'analytics',
    route: 'analytics'
  },
  {
    key: 'leaderboard',
    title: 'Leaderboard',
    icon: 'podium',
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
  const { colors } = useTheme();

  return (
    <LinearGradient
      colors={[colors.cardBackground, colors.cardBackground]}
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
                size={fontSize.md}
                color={isActive ? colors.accent : colors.secondaryText}
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
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  tabText: {
    marginTop: 4,
  },
}); 