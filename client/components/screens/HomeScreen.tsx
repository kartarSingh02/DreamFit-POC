import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { ScreenContainer } from '../layout/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { AddMoneyModal } from '../ui/AddMoneyModal';

// Mock user and stats
const user = {
  name: 'Alex Johnson',
  imageUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  streak: 7,
  walletBalance: 1250, // in rupees
};
const stats = {
  steps: 7890,
  calories: 1234,
  distance: 6.2,
  activeTime: 72, // minutes
  streak: 7,
};
const rewards = {
  points: 1250,
  crowns: 2,
  rings: 5,
  badges: 8,
};
const friends = [
  { name: 'Sarah', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', activity: 'won a challenge!' },
  { name: 'Mike', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', activity: 'hit a 5-day streak!' },
  { name: 'Emma', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', activity: 'earned a badge!' },
];
const activeChallenges = [
  { id: 1, name: 'Step Challenge', progress: 65, timeLeft: '2h 30m', reward: '500 Points' },
  { id: 2, name: 'Calorie Burn', progress: 40, timeLeft: '5h 10m', reward: 'Crown' },
];

type QuickStatProps = { icon: React.ReactNode; label: string; value: string | number };
const QuickStat = ({ icon, label, value }: QuickStatProps) => {
  const { colors } = useTheme();
  return (
    <View style={styles.quickStat}>
      <View style={styles.quickStatIcon}>{icon}</View>
      <Text style={[styles.quickStatValue, { color: colors.primaryText }]}>{value}</Text>
      <Text style={[styles.quickStatLabel, { color: colors.secondaryText }]}>{label}</Text>
    </View>
  );
};

type RewardItemProps = { icon: string; value: string | number; label: string };
const RewardItem = ({ icon, value, label }: RewardItemProps) => {
  const { colors } = useTheme();
  return (
    <View style={styles.rewardItem}>
      <Text style={styles.rewardIcon}>{icon}</Text>
      <Text style={[styles.rewardValue, { color: colors.accent }]}>{value}</Text>
      <Text style={[styles.rewardLabel, { color: colors.secondaryText }]}>{label}</Text>
    </View>
  );
};

type ActiveChallenge = { id: number; name: string; progress: number; timeLeft: string; reward: string };
type ActiveChallengeCardProps = { challenge: ActiveChallenge };
const ActiveChallengeCard = ({ challenge }: ActiveChallengeCardProps) => {
  const { colors } = useTheme();
  return (
    <Card style={styles.activeChallengeCard}>
      <View style={styles.activeChallengeHeader}>
        <Text style={[styles.activeChallengeName, { color: colors.primaryText }]}>{challenge.name}</Text>
        <Text style={[styles.activeChallengeReward, { color: colors.accent }]}>{challenge.reward}</Text>
      </View>
      <View style={[styles.progressBarBg, { backgroundColor: colors.borderColor }]}>
        <View style={[styles.progressBarFill, { width: `${challenge.progress}%`, backgroundColor: colors.accent }]} />
      </View>
      <View style={styles.activeChallengeFooter}>
        <Text style={[styles.activeChallengeProgress, { color: colors.primaryText }]}>{challenge.progress}%</Text>
        <Text style={[styles.activeChallengeTime, { color: colors.secondaryText }]}>{challenge.timeLeft} left</Text>
      </View>
    </Card>
  );
};

interface HomeScreenProps {
  onTabSwitch?: (tabKey: string, section?: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onTabSwitch }) => {
  const { colors, theme } = useTheme();
  const [addMoneyVisible, setAddMoneyVisible] = useState(false);

  const handleAddMoney = () => {
    setAddMoneyVisible(true);
  };

  // Use onTabSwitch for tab navigation
  const handleViewAllStats = () => onTabSwitch && onTabSwitch('analytics');
  const handleSeeAllChallenges = () => onTabSwitch && onTabSwitch('challenges');
  const handleSeeAllFriends = () => onTabSwitch && onTabSwitch('leaderboard');
  const handleViewAchievements = () => onTabSwitch && onTabSwitch('analytics', 'rewards');

  return (
    <View style={styles.bg}>
      <ScreenContainer>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Welcome Banner */}
          <Card style={styles.welcomeBanner}>
            <View style={styles.welcomeRow}>
              <Image source={{ uri: user.imageUri }} style={styles.profilePhoto} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={[styles.welcomeText, { color: colors.secondaryText }]}>Welcome back,</Text>
                <Text style={[styles.userName, { color: colors.primaryText }]}>{user.name}</Text>
                <Text style={[styles.motivation, { color: colors.secondaryText }]}>
                  "Every step counts. Keep moving!"
                </Text>
              </View>
              <View style={styles.streakContainer}>
                <Ionicons name="flame" size={22} color={colors.accent} />
                <Text style={[styles.streakText, { color: colors.primaryText }]}>{user.streak}d</Text>
              </View>
            </View>
          </Card>

          {/* Quick Stats - HIGH PRIORITY */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Quick Stats</Text>
            <TouchableOpacity onPress={handleViewAllStats}>
              <Text style={[styles.sectionAction, { color: colors.accent }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.quickStatsRow}>
            <QuickStat icon={<Ionicons name="walk" size={24} color={colors.accent} />} label="Steps" value={stats.steps} />
            <QuickStat icon={<Ionicons name="flame" size={24} color={colors.accent} />} label="Calories" value={stats.calories} />
            <QuickStat icon={<Ionicons name="map" size={24} color={colors.accent} />} label="Distance" value={`${stats.distance} km`} />
            <QuickStat icon={<Ionicons name="time" size={24} color={colors.accent} />} label="Active" value={`${stats.activeTime}m`} />
          </View>

          {/* Wallet Balance - MOVED UP (HIGH PRIORITY) */}
          <Card style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <Text style={[styles.walletTitle, { color: colors.primaryText }]}>Wallet Balance</Text>
              <TouchableOpacity onPress={handleAddMoney} style={styles.addMoneyBtn}>
                <Ionicons name="add" size={16} color={colors.primaryText} />
                <Text style={[styles.addMoneyText, { color: colors.primaryText }]}>Add Money</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.walletBalance, { color: colors.accent }]}>₹{user.walletBalance}</Text>
            <Text style={[styles.walletSubtext, { color: colors.secondaryText }]}>Available for pool entries</Text>
          </Card>

          {/* Active Challenges Preview - HIGH PRIORITY */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Active Challenges</Text>
            <TouchableOpacity onPress={handleSeeAllChallenges}>
              <Text style={[styles.sectionAction, { color: colors.accent }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeChallengesScroll}>
            {activeChallenges.map(challenge => (
              <View key={challenge.id} style={styles.activeChallengeCardWrapper}>
                <ActiveChallengeCard challenge={challenge} />
              </View>
            ))}
          </ScrollView>

          {/* Friends Activity Feed - MEDIUM PRIORITY */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Friends Activity</Text>
            <TouchableOpacity onPress={handleSeeAllFriends}>
              <Text style={[styles.sectionAction, { color: colors.accent }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendsScroll}>
            {friends.map((friend, idx) => (
              <View key={idx} style={styles.friendCard}>
                <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                <Text style={[styles.friendName, { color: colors.primaryText }]}>{friend.name}</Text>
                <Text style={[styles.friendActivity, { color: colors.secondaryText }]}>{friend.activity}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Rewards & Achievements - MOVED DOWN (LOW PRIORITY) */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Rewards & Achievements</Text>
            <TouchableOpacity onPress={handleViewAchievements}>
              <Text style={[styles.sectionAction, { color: colors.accent }]}>View</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rewardsRow}>
            <RewardItem icon="💎" value={rewards.points} label="Points" />
            <RewardItem icon="👑" value={rewards.crowns} label="Crowns" />
            <RewardItem icon="💍" value={rewards.rings} label="Rings" />
            <RewardItem icon="🏅" value={rewards.badges} label="Badges" />
          </View>
        </ScrollView>
        <AddMoneyModal visible={addMoneyVisible} onClose={() => setAddMoneyVisible(false)} />
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  welcomeBanner: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 18,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  welcomeText: {
    fontSize: 14,
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  motivation: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickStat: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatIcon: {
    marginBottom: 8,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  quickStatLabel: {
    fontSize: 12,
  },
  walletCard: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 18,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addMoneyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addMoneyText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  walletSubtext: {
    fontSize: 12,
  },
  activeChallengesScroll: {
    marginBottom: 24,
  },
  activeChallengeCardWrapper: {
    marginRight: 16,
    width: 280,
  },
  activeChallengeCard: {
    padding: 16,
    borderRadius: 12,
  },
  activeChallengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeChallengeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeChallengeReward: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  activeChallengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeChallengeProgress: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeChallengeTime: {
    fontSize: 12,
  },
  friendsScroll: {
    marginBottom: 24,
  },
  friendCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  friendName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  friendActivity: {
    fontSize: 10,
    textAlign: 'center',
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rewardItem: {
    alignItems: 'center',
    flex: 1,
  },
  rewardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  rewardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  rewardLabel: {
    fontSize: 12,
  },
}); 