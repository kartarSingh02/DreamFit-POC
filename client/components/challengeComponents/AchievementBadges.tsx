import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import Colors from '../../constants/Colors';

interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const mockAchievementBadges: AchievementBadge[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first challenge',
    icon: '👣',
    isUnlocked: true,
    rarity: 'common',
  },
  {
    id: '2',
    name: 'Step Master',
    description: 'Complete 10 step challenges',
    icon: '👟',
    isUnlocked: false,
    progress: 7,
    maxProgress: 10,
    rarity: 'rare',
  },
  {
    id: '3',
    name: 'Calorie King',
    description: 'Burn 10,000 calories total',
    icon: '🔥',
    isUnlocked: false,
    progress: 8500,
    maxProgress: 10000,
    rarity: 'epic',
  },
  {
    id: '4',
    name: 'Marathon Runner',
    description: 'Complete a 42km challenge',
    icon: '🏃',
    isUnlocked: false,
    rarity: 'legendary',
  },
  {
    id: '5',
    name: 'Weekend Warrior',
    description: 'Complete 5 weekend challenges',
    icon: '⚔️',
    isUnlocked: true,
    rarity: 'rare',
  },
  {
    id: '6',
    name: 'Early Bird',
    description: 'Complete 3 morning challenges',
    icon: '🌅',
    isUnlocked: false,
    progress: 2,
    maxProgress: 3,
    rarity: 'common',
  },
];

interface AchievementBadgeCardProps {
  badge: AchievementBadge;
}

const AchievementBadgeCard: React.FC<AchievementBadgeCardProps> = ({ badge }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#B0B0B0';
      case 'rare':
        return '#4CAF50';
      case 'epic':
        return '#9C27B0';
      case 'legendary':
        return '#FFD700';
      default:
        return Colors.accent;
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'Common';
      case 'rare':
        return 'Rare';
      case 'epic':
        return 'Epic';
      case 'legendary':
        return 'Legendary';
      default:
        return 'Common';
    }
  };

  const progressPercentage = badge.progress && badge.maxProgress 
    ? (badge.progress / badge.maxProgress) * 100 
    : 0;

  return (
    <Card style={[styles.badgeCard, { opacity: badge.isUnlocked ? 1 : 0.6 }]}>
      <View style={styles.badgeHeader}>
        <View style={[styles.badgeIcon, { backgroundColor: getRarityColor(badge.rarity) }]}>
          <Text style={styles.badgeIconText}>{badge.icon}</Text>
        </View>
        <View style={styles.badgeInfo}>
          <Text style={styles.badgeName}>{badge.name}</Text>
          <Text style={styles.badgeDescription}>{badge.description}</Text>
        </View>
        <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(badge.rarity) }]}>
          <Text style={styles.rarityText}>{getRarityLabel(badge.rarity)}</Text>
        </View>
      </View>
      
      {!badge.isUnlocked && badge.progress && badge.maxProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {badge.progress} / {badge.maxProgress}
          </Text>
        </View>
      )}
      
      {badge.isUnlocked && (
        <View style={styles.unlockedContainer}>
          <Text style={styles.unlockedText}>✓ Unlocked</Text>
        </View>
      )}
    </Card>
  );
};

export const AchievementBadges: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Achievements</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mockAchievementBadges.map((badge) => (
          <View key={badge.id} style={styles.cardContainer}>
            <AchievementBadgeCard badge={badge} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginRight: 16,
    width: 200,
  },
  badgeCard: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeIconText: {
    fontSize: 20,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 2,
  },
  badgeDescription: {
    fontSize: 12,
    color: Colors.secondaryText,
    lineHeight: 16,
  },
  rarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rarityText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.cardBackground,
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  unlockedContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  unlockedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
}); 