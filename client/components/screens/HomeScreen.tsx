import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import Colors from '../../constants/Colors';
import { ScreenContainer } from '../layout/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';

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
const QuickStat = ({ icon, label, value }: QuickStatProps) => (
  <View style={styles.quickStat}>
    <View style={styles.quickStatIcon}>{icon}</View>
    <Text style={styles.quickStatValue}>{value}</Text>
    <Text style={styles.quickStatLabel}>{label}</Text>
  </View>
);

type RewardItemProps = { icon: string; value: string | number; label: string };
const RewardItem = ({ icon, value, label }: RewardItemProps) => (
  <View style={styles.rewardItem}>
    <Text style={styles.rewardIcon}>{icon}</Text>
    <Text style={styles.rewardValue}>{value}</Text>
    <Text style={styles.rewardLabel}>{label}</Text>
  </View>
);

type ActiveChallenge = { id: number; name: string; progress: number; timeLeft: string; reward: string };
type ActiveChallengeCardProps = { challenge: ActiveChallenge };
const ActiveChallengeCard = ({ challenge }: ActiveChallengeCardProps) => (
  <Card style={styles.activeChallengeCard}>
    <View style={styles.activeChallengeHeader}>
      <Text style={styles.activeChallengeName}>{challenge.name}</Text>
      <Text style={styles.activeChallengeReward}>{challenge.reward}</Text>
    </View>
    <View style={styles.progressBarBg}>
      <View style={[styles.progressBarFill, { width: `${challenge.progress}%` }]} />
    </View>
    <View style={styles.activeChallengeFooter}>
      <Text style={styles.activeChallengeProgress}>{challenge.progress}%</Text>
      <Text style={styles.activeChallengeTime}>{challenge.timeLeft} left</Text>
    </View>
  </Card>
);

export const HomeScreen: React.FC = () => {
  const handleAddMoney = () => {
    Alert.alert(
      'Add Money to Wallet',
      'How much would you like to add?',
      [
        { text: '₹100', onPress: () => Alert.alert('Success', '₹100 added to wallet!') },
        { text: '₹500', onPress: () => Alert.alert('Success', '₹500 added to wallet!') },
        { text: '₹1000', onPress: () => Alert.alert('Success', '₹1000 added to wallet!') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleJoinPool = () => {
    Alert.alert(
      'Join Pool',
      'Entry fee: ₹10\n\nPayout Structure:\n🥇 1st: 10% of pool\n🥈 2nd: 5% of pool\n🥉 3rd: 3% of pool\n4th-50th: Return ₹10\n\nJoin now?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Join Pool', onPress: () => Alert.alert('Success', 'You\'ve joined the pool! Good luck!') },
      ]
    );
  };

  return (
    <View style={styles.bg}>
      <ScreenContainer>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Welcome Banner */}
          <Card style={styles.welcomeBanner}>
            <View style={styles.welcomeRow}>
              <Image source={{ uri: user.imageUri }} style={styles.profilePhoto} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.motivation}>
                  "Every step counts. Keep moving!"
                </Text>
              </View>
              <View style={styles.streakContainer}>
                <Ionicons name="flame" size={22} color={Colors.accent} />
                <Text style={styles.streakText}>{user.streak}d</Text>
              </View>
            </View>
          </Card>

          {/* Wallet Balance */}
          <Card style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <Text style={styles.walletTitle}>Wallet Balance</Text>
              <TouchableOpacity onPress={handleAddMoney} style={styles.addMoneyBtn}>
                <Ionicons name="add" size={16} color={Colors.primaryText} />
                <Text style={styles.addMoneyText}>Add Money</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.walletBalance}>₹{user.walletBalance}</Text>
            <Text style={styles.walletSubtext}>Available for pool entries</Text>
          </Card>

          {/* Quick Stats */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <TouchableOpacity><Text style={styles.sectionAction}>View All</Text></TouchableOpacity>
          </View>
          <View style={styles.quickStatsRow}>
            <QuickStat icon={<Ionicons name="walk" size={24} color={Colors.accent} />} label="Steps" value={stats.steps} />
            <QuickStat icon={<Ionicons name="flame" size={24} color={Colors.accent} />} label="Calories" value={stats.calories} />
            <QuickStat icon={<Ionicons name="map" size={24} color={Colors.accent} />} label="Distance" value={`${stats.distance} km`} />
            <QuickStat icon={<Ionicons name="time" size={24} color={Colors.accent} />} label="Active" value={`${stats.activeTime}m`} />
          </View>

          {/* Active Challenges Preview */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            <TouchableOpacity><Text style={styles.sectionAction}>See All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeChallengesScroll}>
            {activeChallenges.map(challenge => (
              <View key={challenge.id} style={styles.activeChallengeCardWrapper}>
                <ActiveChallengeCard challenge={challenge} />
              </View>
            ))}
          </ScrollView>

          {/* Rewards & Achievements */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Rewards & Achievements</Text>
            <TouchableOpacity><Text style={styles.sectionAction}>View</Text></TouchableOpacity>
          </View>
          <View style={styles.rewardsRow}>
            <RewardItem icon="💎" value={rewards.points} label="Points" />
            <RewardItem icon="👑" value={rewards.crowns} label="Crowns" />
            <RewardItem icon="💍" value={rewards.rings} label="Rings" />
            <RewardItem icon="🏅" value={rewards.badges} label="Badges" />
          </View>

          {/* Friends Activity Feed */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Friends Activity</Text>
            <TouchableOpacity><Text style={styles.sectionAction}>See All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendsScroll}>
            {friends.map((friend, idx) => (
              <View key={idx} style={styles.friendCard}>
                <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendActivity}>{friend.activity}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Quick Actions */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={styles.quickActionBtn} onPress={handleJoinPool}>
              <Ionicons name="trophy" size={22} color={Colors.primaryText} />
              <Text style={styles.quickActionText}>Join Pool</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionBtn}>
              <Ionicons name="barbell" size={22} color={Colors.primaryText} />
              <Text style={styles.quickActionText}>Start Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionBtn}>
              <Ionicons name="podium" size={22} color={Colors.primaryText} />
              <Text style={styles.quickActionText}>Leaderboard</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: Colors.backgroundGradient[0],
  },
  container: {
    flex: 1,
  },
  welcomeBanner: {
    marginTop: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 18,
    backgroundColor: Colors.cardBackground,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.accent,
    backgroundColor: Colors.cardBackground,
  },
  welcomeText: {
    color: Colors.secondaryText,
    fontSize: 14,
  },
  userName: {
    color: Colors.primaryText,
    fontSize: 20,
    fontWeight: 'bold',
  },
  motivation: {
    color: Colors.accent,
    fontSize: 13,
    marginTop: 4,
  },
  streakContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 12,
  },
  streakText: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 18,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionAction: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 8,
  },
  quickStat: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatIcon: {
    marginBottom: 4,
  },
  quickStatValue: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  quickStatLabel: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
  activeChallengesScroll: {
    marginBottom: 8,
  },
  activeChallengeCardWrapper: {
    marginRight: 14,
    width: 200,
  },
  activeChallengeCard: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.cardBackground,
  },
  activeChallengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeChallengeName: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 15,
  },
  activeChallengeReward: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#2d2d2d',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  activeChallengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeChallengeProgress: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 13,
  },
  activeChallengeTime: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 8,
  },
  rewardItem: {
    alignItems: 'center',
    flex: 1,
  },
  rewardIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  rewardValue: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  rewardLabel: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
  friendsScroll: {
    marginBottom: 8,
  },
  friendCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 100,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
  },
  friendName: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 13,
  },
  friendActivity: {
    color: Colors.secondaryText,
    fontSize: 11,
    textAlign: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 32,
  },
  quickActionBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 6,
  },
  quickActionText: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 6,
  },
  walletCard: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderColor,
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
    color: Colors.primaryText,
  },
  addMoneyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addMoneyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginLeft: 4,
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.gold,
    marginBottom: 4,
  },
  walletSubtext: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
}); 