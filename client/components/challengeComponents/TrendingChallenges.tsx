import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import Colors from '../../constants/Colors';

interface TrendingChallenge {
  id: string;
  name: string;
  participants: number;
  reward: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: string;
}

const mockTrendingChallenges: TrendingChallenge[] = [
  {
    id: '1',
    name: 'Weekend Warrior',
    participants: 1247,
    reward: '1000 Points + Crown',
    type: 'steps',
    difficulty: 'medium',
    timeLimit: '48h',
  },
  {
    id: '2',
    name: 'Calorie Crusher',
    participants: 892,
    reward: 'Ring + 500 Points',
    type: 'calories',
    difficulty: 'hard',
    timeLimit: '24h',
  },
  {
    id: '3',
    name: 'Speed Demon',
    participants: 567,
    reward: 'Voucher + 300 Points',
    type: 'distance',
    difficulty: 'easy',
    timeLimit: '12h',
  },
];

interface TrendingChallengeCardProps {
  challenge: TrendingChallenge;
  onJoin: (challenge: TrendingChallenge) => void;
}

const TrendingChallengeCard: React.FC<TrendingChallengeCardProps> = ({ challenge, onJoin }) => {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return Colors.accent;
    }
  };

  return (
    <Card style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeIcon}>
          <Text style={styles.challengeIconText}>{getTypeIcon(challenge.type)}</Text>
        </View>
        <View style={styles.challengeInfo}>
          <Text style={styles.challengeName}>{challenge.name}</Text>
          <View style={styles.challengeMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
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
          onPress={() => onJoin(challenge)}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

interface TrendingChallengesProps {
  onJoinChallenge: (challenge: TrendingChallenge) => void;
}

export const TrendingChallenges: React.FC<TrendingChallengesProps> = ({ onJoinChallenge }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔥 Trending Challenges</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mockTrendingChallenges.map((challenge) => (
          <View key={challenge.id} style={styles.cardContainer}>
            <TrendingChallengeCard 
              challenge={challenge} 
              onJoin={onJoinChallenge}
            />
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
}); 