import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { ScreenContainer } from '../layout/ScreenContainer';
import { useNavigation } from '@react-navigation/native';
import { TrendingChallenges } from '../challengeComponents/TrendingChallenges';
import { AddMoneyModal } from '../ui/AddMoneyModal';

// Enhanced trending challenges data
const enhancedTrendingChallenges = [
  {
    id: '1',
    name: 'Weekend Warrior',
    participants: 1247,
    reward: '1000 Points + Crown',
    type: 'steps',
    difficulty: 'medium',
    timeLimit: '48h',
    category: 'popular',
    trending: true,
  },
  {
    id: '2',
    name: 'Calorie Crusher',
    participants: 892,
    reward: 'Ring + 500 Points',
    type: 'calories',
    difficulty: 'hard',
    timeLimit: '24h',
    category: 'trending',
    trending: true,
  },
  {
    id: '3',
    name: 'Speed Demon',
    participants: 567,
    reward: 'Voucher + 300 Points',
    type: 'distance',
    difficulty: 'easy',
    timeLimit: '12h',
    category: 'new',
    trending: true,
  },
  {
    id: '4',
    name: 'Morning Glory',
    participants: 2341,
    reward: 'Crown + 800 Points',
    type: 'steps',
    difficulty: 'medium',
    timeLimit: '6h',
    category: 'featured',
    trending: true,
  },
];

// Featured challenges with special rewards
const featuredChallenges = [
  {
    id: 'f1',
    name: 'Marathon Master',
    description: 'Complete a full marathon distance in 7 days',
    participants: 156,
    reward: 'Legendary Ring + 2000 Points',
    type: 'distance',
    difficulty: 'legendary',
    timeLimit: '7 days',
    specialReward: '🏆 Trophy',
    category: 'featured',
  },
  {
    id: 'f2',
    name: 'Calorie King',
    description: 'Burn 10,000 calories in one week',
    participants: 89,
    reward: 'Epic Crown + 1500 Points',
    type: 'calories',
    difficulty: 'epic',
    timeLimit: '7 days',
    specialReward: '👑 Golden Crown',
    category: 'featured',
  },
];

// Leaderboard data
const leaderboardData = [
  { rank: 1, name: 'Sarah Johnson', points: 15420, avatar: '👑', streak: 15 },
  { rank: 2, name: 'Mike Chen', points: 12850, avatar: '🥈', streak: 12 },
  { rank: 3, name: 'Emma Davis', points: 11230, avatar: '🥉', streak: 8 },
  { rank: 4, name: 'Alex Rodriguez', points: 9870, avatar: '4️⃣', streak: 6 },
  { rank: 5, name: 'Lisa Wang', points: 8540, avatar: '5️⃣', streak: 10 },
];

// Categories for filtering
const challengeCategories = [
  { id: 'all', name: 'All', icon: '🏆' },
  { id: 'trending', name: 'Trending', icon: '🔥' },
  { id: 'popular', name: 'Popular', icon: '⭐' },
  { id: 'new', name: 'New', icon: '🆕' },
  { id: 'featured', name: 'Featured', icon: '💎' },
];

interface LeaderboardItemProps {
  item: {
    rank: number;
    name: string;
    points: number;
    avatar: string;
    streak: number;
  };
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ item }) => (
  <View style={styles.leaderboardItem}>
    <View style={styles.rankContainer}>
      <Text style={styles.rankText}>{item.rank}</Text>
      <Text style={styles.avatarText}>{item.avatar}</Text>
    </View>
    <View style={styles.userInfo}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.streakText}>{item.streak} day streak</Text>
    </View>
    <View style={styles.pointsContainer}>
      <Text style={styles.pointsText}>{item.points.toLocaleString()}</Text>
      <Text style={styles.pointsLabel}>points</Text>
    </View>
  </View>
);

interface FeaturedChallengeCardProps {
  challenge: any;
  onJoin: (challenge: any) => void;
}

const FeaturedChallengeCard: React.FC<FeaturedChallengeCardProps> = ({ challenge, onJoin }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      case 'epic':
        return '#9C27B0';
      case 'legendary':
        return '#FFD700';
      default:
        return Colors.accent;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'steps':
        return '👟';
      case 'calories':
        return '🔥';
      case 'distance':
        return '🏃';
      default:
        return '🎯';
    }
  };

  return (
    <Card style={styles.featuredCard}>
      <View style={styles.featuredHeader}>
        <View style={styles.featuredIcon}>
          <Text style={styles.featuredIconText}>{getTypeIcon(challenge.type)}</Text>
        </View>
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredName}>{challenge.name}</Text>
          <Text style={styles.featuredDescription}>{challenge.description}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
          <Text style={styles.difficultyText}>{challenge.difficulty.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.featuredStats}>
        <View style={styles.statItem}>
          <Text style={styles.featuredStatLabel}>Participants</Text>
          <Text style={styles.statValue}>{challenge.participants}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.featuredStatLabel}>Time Limit</Text>
          <Text style={styles.statValue}>{challenge.timeLimit}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.featuredStatLabel}>Special Reward</Text>
          <Text style={styles.statValue}>{challenge.specialReward}</Text>
        </View>
      </View>
      
      <View style={styles.featuredFooter}>
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardLabel}>Reward:</Text>
          <Text style={styles.rewardText}>{challenge.reward}</Text>
        </View>
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={() => onJoin(challenge)}
        >
          <Text style={styles.joinButtonText}>Join Challenge</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export const TrendingScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addMoneyVisible, setAddMoneyVisible] = useState(false);
  const navigation = useNavigation();

  const handleJoinChallenge = (challenge: any) => {
    Alert.alert(
      'Join Challenge',
      `Are you sure you want to join "${challenge.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join', 
          onPress: () => {
            Alert.alert('Success', `You've joined ${challenge.name}!`);
          }
        },
      ]
    );
  };

  const filteredChallenges = selectedCategory === 'all' 
    ? enhancedTrendingChallenges 
    : enhancedTrendingChallenges.filter(challenge => challenge.category === selectedCategory);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text variant="h1" weight="bold" style={styles.title}>
          Trending
        </Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Discover hot challenges and compete with others
            </Text>
          </View>
          <TouchableOpacity onPress={() => setAddMoneyVisible(true)} style={styles.walletButton}>
            <Ionicons name="wallet" size={24} color={Colors.primaryText} />
            <Ionicons name="add" size={16} color={Colors.primaryText} style={styles.addIcon} />
        </TouchableOpacity>
      </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {challengeCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
      </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💎 Featured Challenges</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
              </View>
          {featuredChallenges.map((challenge) => (
            <FeaturedChallengeCard 
              key={challenge.id} 
              challenge={challenge} 
              onJoin={handleJoinChallenge}
            />
          ))}
        </View>

        {/* Trending Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Challenges</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {filteredChallenges.map((challenge) => (
              <View key={challenge.id} style={styles.challengeCardContainer}>
                <Card style={styles.challengeCard}>
                  <View style={styles.challengeHeader}>
                    <View style={styles.challengeIcon}>
                      <Text style={styles.challengeIconText}>
                        {challenge.type === 'steps' ? '👟' : challenge.type === 'calories' ? '🔥' : '🏃'}
                      </Text>
                    </View>
                    <View style={styles.challengeInfo}>
                      <Text style={styles.challengeName}>{challenge.name}</Text>
                      <View style={styles.challengeMeta}>
                        <View style={[styles.difficultyBadge, { backgroundColor: challenge.difficulty === 'easy' ? '#4CAF50' : challenge.difficulty === 'medium' ? '#FF9800' : '#F44336' }]}>
                          <Text style={styles.difficultyText}>{challenge.difficulty.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.timeLimit}>{challenge.timeLimit}</Text>
                      </View>
                    </View>
                    <View style={styles.participantsContainer}>
                      <Text style={styles.participantsText}>{challenge.participants}</Text>
                      <Text style={styles.participantsLabel}>participants</Text>
                    </View>
                  </View>
                  
                  <View style={styles.challengeFooter}>
                    <View style={styles.rewardContainer}>
                      <Text style={styles.rewardLabel}>Reward:</Text>
                      <Text style={styles.rewardText}>{challenge.reward}</Text>
                    </View>
                  <TouchableOpacity
                      style={styles.joinButton}
                      onPress={() => handleJoinChallenge(challenge)}
                    >
                      <Text style={styles.joinButtonText}>Join</Text>
                  </TouchableOpacity>
                  </View>
                </Card>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Leaderboard */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 Top Performers</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
            </View>
          <Card style={styles.leaderboardCard}>
            {leaderboardData.map((item) => (
              <LeaderboardItem key={item.rank} item={item} />
            ))}
          </Card>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Quick Stats</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>2,847</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Active Challenges</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>89,420</Text>
              <Text style={styles.statLabel}>Total Steps Today</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>12,450</Text>
              <Text style={styles.statLabel}>Calories Burned</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
      <AddMoneyModal visible={addMoneyVisible} onClose={() => setAddMoneyVisible(false)} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    color: Colors.primaryText,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.secondaryText,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addIcon: {
    marginLeft: -8,
    marginTop: -6,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  categoryButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: Colors.primaryText,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  challengeCardContainer: {
    marginRight: 16,
    width: 280,
  },
  challengeCard: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeIconText: {
    fontSize: 20,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  challengeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  timeLimit: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  participantsContainer: {
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  participantsLabel: {
    fontSize: 10,
    color: Colors.secondaryText,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flex: 1,
  },
  rewardLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 2,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.gold,
  },
  joinButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  featuredCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuredIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featuredIconText: {
    fontSize: 24,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: Colors.secondaryText,
    lineHeight: 20,
  },
  featuredStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  featuredStatLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaderboardCard: {
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 40,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  avatarText: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 2,
  },
  streakText: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  pointsLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
}); 