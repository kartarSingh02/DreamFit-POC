import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { ScreenContainer } from '../layout/ScreenContainer';
import { useStepCounter } from '../StepCounterContext';

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

const performanceInsights = [
  { title: 'Best Performance Day', value: 'Wednesday', icon: '📈', color: Colors.gold },
  { title: 'Average Daily Steps', value: '8,375', icon: '👟', color: Colors.accent },
  { title: 'Goal Completion Rate', value: '87%', icon: '🎯', color: '#4CAF50' },
  { title: 'Active Days This Month', value: '28/30', icon: '📅', color: '#2196F3' },
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

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => (
  <Card style={styles.goalCard}>
    <View style={styles.goalHeader}>
      <Text style={styles.goalIcon}>{goal.icon}</Text>
      <Text style={styles.goalName}>{goal.name}</Text>
    </View>
    <View style={styles.goalProgress}>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${goal.progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{goal.progress}%</Text>
    </View>
    <View style={styles.goalStats}>
      <Text style={styles.goalCurrent}>{goal.current.toLocaleString()}</Text>
      <Text style={styles.goalTarget}>/ {goal.target.toLocaleString()}</Text>
    </View>
  </Card>
);

interface AchievementCardProps {
  achievement: {
    id: number;
    name: string;
    description: string;
    earned: boolean;
    icon: string;
  };
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => (
  <Card style={[styles.achievementCard, !achievement.earned && styles.achievementLocked]}>
    <View style={styles.achievementHeader}>
      <Text style={[styles.achievementIcon, !achievement.earned && styles.achievementIconLocked]}>
        {achievement.icon}
      </Text>
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementName, !achievement.earned && styles.achievementNameLocked]}>
          {achievement.name}
        </Text>
        <Text style={[styles.achievementDescription, !achievement.earned && styles.achievementDescriptionLocked]}>
          {achievement.description}
        </Text>
      </View>
      {achievement.earned && (
        <Ionicons name="checkmark-circle" size={24} color={Colors.gold} />
      )}
    </View>
  </Card>
);

interface InsightCardProps {
  insight: {
    title: string;
    value: string;
    icon: string;
    color: string;
  };
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => (
  <Card style={styles.insightCard}>
    <View style={styles.insightHeader}>
      <Text style={styles.insightIcon}>{insight.icon}</Text>
      <Text style={styles.insightTitle}>{insight.title}</Text>
    </View>
    <Text style={[styles.insightValue, { color: insight.color }]}>{insight.value}</Text>
  </Card>
);

interface AnalyticsScreenProps {
  scrollToSection?: string;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ scrollToSection }) => {
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

  const periodData = getPeriodData();
  const trackingInfo = getTrackingStatus();

  return (
    <ScreenContainer>
      <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.subtitle}>Track your progress and performance</Text>
          </View>
          <View style={styles.trackingStatus}>
            <Text style={styles.trackingStatusText}>
              {trackingInfo.status}
            </Text>
            <Text style={styles.trackingStatusLabel}>Step Tracking</Text>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Current Period Stats</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Ionicons name="walk" size={24} color={Colors.accent} />
              <Text style={styles.statValue}>{periodData.steps.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </Card>
            <Card style={styles.statCard}>
              <Ionicons name="flame" size={24} color={Colors.accent} />
              <Text style={styles.statValue}>{periodData.calories.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </Card>
            <Card style={styles.statCard}>
              <Ionicons name="map" size={24} color={Colors.accent} />
              <Text style={styles.statValue}>{periodData.distance.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Distance (km)</Text>
            </Card>
          </View>
        </View>

        {/* Performance Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Performance Insights</Text>
          <View style={styles.insightsGrid}>
            {performanceInsights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </View>
        </View>

        {/* Goals */}
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </View>

        {/* Rewards & Achievements */}
        <View style={styles.rewardsSection} ref={rewardsSectionRef}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          <View style={styles.rewardsRow}>
            <View style={styles.rewardItem}><Text style={styles.rewardIcon}>💎</Text><Text style={styles.rewardValue}>{rewards.points}</Text><Text style={styles.rewardLabel}>Points</Text></View>
            <View style={styles.rewardItem}><Text style={styles.rewardIcon}>👑</Text><Text style={styles.rewardValue}>{rewards.crowns}</Text><Text style={styles.rewardLabel}>Crowns</Text></View>
            <View style={styles.rewardItem}><Text style={styles.rewardIcon}>💍</Text><Text style={styles.rewardValue}>{rewards.rings}</Text><Text style={styles.rewardLabel}>Rings</Text></View>
            <View style={styles.rewardItem}><Text style={styles.rewardIcon}>🏅</Text><Text style={styles.rewardValue}>{rewards.badges}</Text><Text style={styles.rewardLabel}>Badges</Text></View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </View>

        {/* Live Step Counter */}
        <Card style={styles.stepCounterCard}>
          <Text style={styles.stepCounterTitle}>Today's Progress</Text>
          <View style={styles.stepCounterDisplay}>
            <Text style={styles.stepCount}>{stepCount}</Text>
            <Text style={styles.stepCountLabel}>steps today</Text>
          </View>
          <Text style={styles.stepCounterStatus}>
            {trackingInfo.message}
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  trackingStatus: {
    alignItems: 'center',
  },
  trackingStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 2,
  },
  trackingStatusLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: Colors.cardBackground,
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
  periodButtonActive: {
    backgroundColor: Colors.accent,
  },
  periodText: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  periodTextActive: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
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
    color: Colors.primaryText,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
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
    color: Colors.secondaryText,
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
    color: Colors.primaryText,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#2d2d2d',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
  },
  goalStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  goalCurrent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  goalTarget: {
    fontSize: 14,
    color: Colors.secondaryText,
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
    color: Colors.primaryText,
    marginBottom: 4,
  },
  achievementNameLocked: {
    color: Colors.secondaryText,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  achievementDescriptionLocked: {
    color: Colors.secondaryText,
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
    color: Colors.primaryText,
    marginBottom: 16,
  },
  stepCounterDisplay: {
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  stepCountLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  stepCounterStatus: {
    fontSize: 14,
    color: Colors.secondaryText,
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
    color: Colors.primaryText,
  },
  rewardLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
}); 