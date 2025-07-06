import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../layout/ScreenContainer';
import { useStepCounter } from '../StepCounterContext';
import { useTheme } from '../../contexts/ThemeContext';

// Mock data for analytics
const weeklySteps = [8500, 9200, 7800, 10500, 8900, 11200, 9600];
const weeklyCalories = [320, 350, 290, 400, 340, 420, 370];
const weeklyDistance = [6.2, 7.1, 5.8, 8.3, 6.9, 8.8, 7.4];

const monthlyData = {
  totalSteps: 234500,
  totalCalories: 12500,
  totalDistance: 185.2,
  activeDays: 28,
  bestDay: 'Wednesday',
  averageSteps: 8375,
  goalCompletion: 87,
};

const goals = [
  { id: 1, name: 'Daily Steps', target: 10000, current: 9600, progress: 96, icon: '👟' },
  { id: 2, name: 'Weekly Distance', target: 50, current: 42.5, progress: 85, icon: '🏃' },
  { id: 3, name: 'Monthly Calories', target: 15000, current: 12500, progress: 83, icon: '🔥' },
];

const achievements = [
  { id: 1, name: 'Early Bird', description: 'Walk 5000 steps before 9 AM', earned: true, icon: '🌅' },
  { id: 2, name: 'Weekend Warrior', description: 'Complete 7-day streak', earned: true, icon: '⚡' },
  { id: 3, name: 'Marathon Walker', description: 'Walk 42km in a month', earned: false, icon: '🏃' },
];

const rewards = {
  points: 1250,
  crowns: 2,
  rings: 5,
  badges: 8,
};

interface GoalCardProps {
  goal: {
    id: number;
    name: string;
    target: number;
    current: number;
    progress: number;
    icon: string;
  };
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { colors } = useTheme();
  
  return (
    <Card style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalIcon}>{goal.icon}</Text>
        <Text style={[styles.goalName, { color: colors.primaryText }]}>{goal.name}</Text>
      </View>
      <View style={styles.goalProgress}>
        <View style={[styles.progressBarBg, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.progressBarFill, { width: `${goal.progress}%`, backgroundColor: colors.accent }]} />
        </View>
        <Text style={[styles.progressText, { color: colors.primaryText }]}>{goal.progress}%</Text>
      </View>
      <View style={styles.goalStats}>
        <Text style={[styles.goalCurrent, { color: colors.primaryText }]}>{goal.current.toLocaleString()}</Text>
        <Text style={[styles.goalTarget, { color: colors.secondaryText }]}>/ {goal.target.toLocaleString()}</Text>
      </View>
    </Card>
  );
};

interface AchievementCardProps {
  achievement: {
    id: number;
    name: string;
    description: string;
    earned: boolean;
    icon: string;
  };
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { colors } = useTheme();
  
  return (
    <Card style={[styles.achievementCard, !achievement.earned && styles.achievementLocked]}>
      <View style={styles.achievementHeader}>
        <Text style={[styles.achievementIcon, !achievement.earned && styles.achievementIconLocked]}>
          {achievement.icon}
        </Text>
        <View style={styles.achievementInfo}>
          <Text style={[
            styles.achievementName, 
            { color: colors.primaryText },
            !achievement.earned && { color: colors.secondaryText }
          ]}>
            {achievement.name}
          </Text>
          <Text style={[
            styles.achievementDescription, 
            { color: colors.secondaryText },
            !achievement.earned && { color: colors.secondaryText }
          ]}>
            {achievement.description}
          </Text>
        </View>
        {achievement.earned && (
          <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
        )}
      </View>
    </Card>
  );
};

interface InsightCardProps {
  insight: {
    title: string;
    value: string;
    icon: string;
    color: string;
  };
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const { colors } = useTheme();
  
  return (
    <Card style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <Text style={styles.insightIcon}>{insight.icon}</Text>
        <Text style={[styles.insightTitle, { color: colors.primaryText }]}>{insight.title}</Text>
      </View>
      <Text style={[styles.insightValue, { color: insight.color }]}>{insight.value}</Text>
    </Card>
  );
};

interface AnalyticsScreenProps {
  scrollToSection?: string;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ scrollToSection }) => {
  const { colors } = useTheme();
  const { stepCount, isActive, hasActiveParticipation } = useStepCounter();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const scrollViewRef = useRef<ScrollView>(null);
  const rewardsSectionRef = useRef<View>(null);

  useEffect(() => {
    if (
      scrollToSection === 'rewards' &&
      rewardsSectionRef.current &&
      scrollViewRef.current &&
      typeof scrollViewRef.current.getInnerViewNode === 'function'
    ) {
      setTimeout(() => {
        if (rewardsSectionRef.current && scrollViewRef.current && typeof scrollViewRef.current.getInnerViewNode === 'function') {
          rewardsSectionRef.current.measureLayout(
            scrollViewRef.current.getInnerViewNode(),
            (x, y) => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y, animated: true });
              }
            }
          );
        }
      }, 300);
    }
  }, [scrollToSection]);

  const getPeriodData = () => {
    switch (selectedPeriod) {
      case 'week':
        return {
          steps: weeklySteps.reduce((a, b) => a + b, 0),
          calories: weeklyCalories.reduce((a, b) => a + b, 0),
          distance: weeklyDistance.reduce((a, b) => a + b, 0),
        };
      case 'month':
        return {
          steps: monthlyData.totalSteps,
          calories: monthlyData.totalCalories,
          distance: monthlyData.totalDistance,
        };
      default:
        return {
          steps: monthlyData.totalSteps * 12,
          calories: monthlyData.totalCalories * 12,
          distance: monthlyData.totalDistance * 12,
        };
    }
  };

  const getTrackingStatus = () => {
    if (hasActiveParticipation && isActive) {
      return { status: '🟢 Active', message: 'Tracking steps for active challenges/pools' };
    } else if (hasActiveParticipation && !isActive) {
      return { status: '🟡 Waiting', message: 'Joined challenges/pools - tracking starts soon' };
    } else {
      return { status: '🔴 Inactive', message: 'Join a challenge or pool to start tracking' };
    }
  };

  const performanceInsights = [
    { title: 'Best Performance Day', value: 'Wednesday', icon: '📈', color: '#FFD700' },
    { title: 'Average Daily Steps', value: '8,375', icon: '👟', color: colors.accent },
    { title: 'Goal Completion Rate', value: '87%', icon: '🎯', color: '#4CAF50' },
    { title: 'Active Days This Month', value: '28/30', icon: '📅', color: '#2196F3' },
  ];

  const periodData = getPeriodData();
  const trackingInfo = getTrackingStatus();

  return (
    <ScreenContainer>
      <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primaryText }]}>Analytics</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Track your fitness progress</Text>
        </View>

        {/* Period Selector */}
        <View style={[styles.periodContainer, { backgroundColor: colors.cardBackground }]}>
          {(['week', 'month', 'year'] as const).map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodTab,
                selectedPeriod === period && { backgroundColor: colors.accent }
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                { color: colors.secondaryText },
                selectedPeriod === period && { color: '#FFFFFF' }
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Stats */}
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { color: colors.primaryText }]}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.primaryText }]}>{periodData.steps.toLocaleString()}</Text>
              <Text style={[styles.summaryLabel, { color: colors.secondaryText }]}>Steps</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.primaryText }]}>{periodData.calories.toLocaleString()}</Text>
              <Text style={[styles.summaryLabel, { color: colors.secondaryText }]}>Calories</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.primaryText }]}>{periodData.distance.toFixed(1)}</Text>
              <Text style={[styles.summaryLabel, { color: colors.secondaryText }]}>Distance (km)</Text>
            </View>
          </View>
        </Card>

        {/* Tracking Status */}
        <Card style={styles.trackingCard}>
          <View style={styles.trackingHeader}>
            <Ionicons name="pulse" size={24} color={colors.accent} />
            <Text style={[styles.trackingTitle, { color: colors.primaryText }]}>Tracking Status</Text>
          </View>
          <Text style={[styles.trackingStatus, { color: colors.primaryText }]}>{trackingInfo.status}</Text>
          <Text style={[styles.trackingMessage, { color: colors.secondaryText }]}>{trackingInfo.message}</Text>
        </Card>

        {/* Goals */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Goals</Text>
        </View>
        <View style={styles.goalsContainer}>
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </View>

        {/* Performance Insights */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Performance Insights</Text>
        </View>
        <View style={styles.insightsContainer}>
          {performanceInsights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Achievements</Text>
        </View>
        <View style={styles.achievementsContainer}>
          {achievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </View>

        {/* Rewards */}
        <View ref={rewardsSectionRef} style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Rewards</Text>
        </View>
        <Card style={styles.rewardsCard}>
          <View style={styles.rewardsGrid}>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>👑</Text>
              <Text style={[styles.rewardValue, { color: colors.primaryText }]}>{rewards.crowns}</Text>
              <Text style={[styles.rewardLabel, { color: colors.secondaryText }]}>Crowns</Text>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>💍</Text>
              <Text style={[styles.rewardValue, { color: colors.primaryText }]}>{rewards.rings}</Text>
              <Text style={[styles.rewardLabel, { color: colors.secondaryText }]}>Rings</Text>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>🏆</Text>
              <Text style={[styles.rewardValue, { color: colors.primaryText }]}>{rewards.badges}</Text>
              <Text style={[styles.rewardLabel, { color: colors.secondaryText }]}>Badges</Text>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardIcon}>⭐</Text>
              <Text style={[styles.rewardValue, { color: colors.primaryText }]}>{rewards.points}</Text>
              <Text style={[styles.rewardLabel, { color: colors.secondaryText }]}>Points</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  trackingStatus: {
    alignItems: 'center',
  },
  trackingStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  trackingStatusLabel: {
    fontSize: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  insightsSection: {
    marginBottom: 24,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  insightCard: {
    width: '48%',
    marginBottom: 12,
    padding: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 12,
    flex: 1,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalsSection: {
    marginBottom: 24,
  },
  goalCard: {
    marginBottom: 12,
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  goalStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  goalCurrent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalTarget: {
    fontSize: 14,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementCard: {
    marginBottom: 12,
    padding: 16,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementNameLocked: {
    color: '#666',
  },
  achievementDescription: {
    fontSize: 14,
  },
  achievementDescriptionLocked: {
    opacity: 0.7,
  },
  stepCounterCard: {
    marginBottom: 24,
    padding: 20,
    alignItems: 'center',
  },
  stepCounterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  stepCounterDisplay: {
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  stepCountLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  stepCounterStatus: {
    fontSize: 14,
  },
  rewardsSection: {
    marginBottom: 24,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rewardItem: {
    alignItems: 'center',
    flex: 1,
  },
  rewardIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  rewardValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rewardLabel: {
    fontSize: 12,
  },
  // Missing styles
  periodContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    padding: 4,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryCard: {
    marginBottom: 24,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
  },
  trackingCard: {
    marginBottom: 24,
    padding: 16,
  },
  trackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  trackingMessage: {
    fontSize: 14,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  goalsContainer: {
    marginBottom: 24,
  },
  insightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  achievementsContainer: {
    marginBottom: 24,
  },
  rewardsCard: {
    marginBottom: 24,
    padding: 16,
  },
  rewardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}); 