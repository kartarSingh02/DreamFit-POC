import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Text } from '../ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { ScreenContainer } from '../layout/ScreenContainer';
import { padding, margin, fontSize, spacing } from '../../constants/Responsive';
import { useTheme } from '../../contexts/ThemeContext';

// Mock data for leaderboard
const mockLeaderboard = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    steps: 12450,
    rank: 1,
    earnings: 156,
    isUser: false,
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    steps: 11890,
    rank: 2,
    earnings: 78,
    isUser: false,
  },
  {
    id: 3,
    name: 'Mike Chen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    steps: 11560,
    rank: 3,
    earnings: 47,
    isUser: false,
  },
  {
    id: 4,
    name: 'Emma Davis',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    steps: 11230,
    rank: 4,
    earnings: 10,
    isUser: false,
  },
  {
    id: 5,
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    steps: 10980,
    rank: 5,
    earnings: 10,
    isUser: true,
  },
];

// Mock data for user's last 5 pools
const mockUserPools = [
  {
    id: 1,
    name: 'Morning Walk Pool',
    date: 'Today 5:00 AM',
    steps: 12450,
    position: 1,
    earnings: 156,
    status: 'won',
  },
  {
    id: 2,
    name: 'Evening Walk Pool',
    date: 'Yesterday 6:00 PM',
    steps: 11890,
    position: 2,
    earnings: 78,
    status: 'won',
  },
  {
    id: 3,
    name: 'Sunrise Steps',
    date: 'Yesterday 6:30 AM',
    steps: 11560,
    position: 3,
    earnings: 47,
    status: 'won',
  },
  {
    id: 4,
    name: 'Evening Walk Pool',
    date: '2 days ago 6:00 PM',
    steps: 11230,
    position: 4,
    earnings: 10,
    status: 'refund',
  },
  {
    id: 5,
    name: 'Morning Walk Pool',
    date: '2 days ago 5:00 AM',
    steps: 10980,
    position: 5,
    earnings: 10,
    status: 'refund',
  },
];

// Add mock friends leaderboard data
const friendsLeaderboard = [
  {
    id: 1,
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    steps: 10980,
    rank: 1,
    earnings: 10,
    isUser: true,
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    steps: 10500,
    rank: 2,
    earnings: 8,
    isUser: false,
  },
  {
    id: 3,
    name: 'Emma Davis',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    steps: 9800,
    rank: 3,
    earnings: 5,
    isUser: false,
  },
];

const userWalletBalance = 1250; // in rupees

const TopPerformersList: React.FC<{ data: any[] }> = ({ data }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.topPerformersList}>
      {data.slice(0, 5).map((user, idx) => (
        <View key={user.id} style={styles.topPerformerItem}>
          <View style={styles.topPerformerAvatarWrapper}>
            <Image source={{ uri: user.avatar }} style={styles.topPerformerAvatar} />
            {idx < 3 && (
              <Text style={styles.topPerformerMedal}>
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
              </Text>
            )}
          </View>
          <Text style={[styles.topPerformerName, { color: colors.primaryText }]}>{user.name}</Text>
          <Text style={[styles.topPerformerSteps, { color: colors.secondaryText }]}>{user.steps.toLocaleString()} steps</Text>
          <Text style={[styles.topPerformerEarnings, { color: colors.accent }]}>₹{user.earnings}</Text>
        </View>
      ))}
    </View>
  );
};

const UserPoolCard: React.FC<{ pool: any }> = ({ pool }) => {
  const { colors } = useTheme();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return '#FFD700'; // gold
      case 'refund': return colors.accent;
      default: return colors.secondaryText;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'won': return 'WON';
      case 'refund': return 'REFUND';
      default: return 'LOST';
    }
  };

  return (
    <Card style={styles.poolCard}>
      <View style={styles.poolHeader}>
        <View>
          <Text style={[styles.poolName, { color: colors.primaryText }]}>{pool.name}</Text>
          <Text style={[styles.poolDate, { color: colors.secondaryText }]}>{pool.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pool.status) }]}>
          <Text style={[styles.statusText, { color: '#fff' }]}>{getStatusText(pool.status)}</Text>
        </View>
      </View>

      <View style={styles.poolStats}>
        <View style={styles.statItem}>
          <Ionicons name="walk" size={16} color={colors.secondaryText} />
          <Text style={[styles.statValue, { color: colors.primaryText }]}>{pool.steps.toLocaleString()}</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Steps</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="trophy" size={16} color={colors.secondaryText} />
          <Text style={[styles.statValue, { color: colors.primaryText }]}>#{pool.position}</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Position</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="wallet" size={16} color={colors.secondaryText} />
          <Text style={[styles.statValue, { color: colors.primaryText }]}>₹{pool.earnings}</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Earnings</Text>
        </View>
      </View>
    </Card>
  );
};

export const LeaderboardScreen: React.FC = () => {
  const { colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState('daily');
  const [showFriends, setShowFriends] = useState(false);
  const leaderboardData = showFriends ? friendsLeaderboard : mockLeaderboard;
  // Find the user object for the 'Your Rank' card
  const userObj = leaderboardData.find(u => u.isUser);

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.primaryText }]}>Leaderboard</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Top performers in walking pools</Text>
          </View>
          <TouchableOpacity 
            style={[
              styles.friendsToggle, 
              { backgroundColor: colors.cardBackground },
              showFriends && { backgroundColor: colors.accent }
            ]}
            onPress={() => setShowFriends(!showFriends)}
          >
            <Ionicons name={showFriends ? 'people' : 'earth'} size={20} color={showFriends ? colors.primaryText : colors.secondaryText} />
            <Text style={[styles.friendsToggleText, { color: showFriends ? colors.primaryText : colors.secondaryText }]}>{showFriends ? 'Friends' : 'Global'}</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: colors.cardBackground }]}>
          {['daily', 'weekly', 'all-time'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab, 
                selectedTab === tab && { backgroundColor: colors.accent }
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[
                styles.tabText, 
                { color: colors.secondaryText },
                selectedTab === tab && { color: colors.primaryText }
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Performance Summary - moved to top */}
        <Card style={styles.statsCard}>
          <Text style={[styles.statsTitle, { color: colors.primaryText }]}>Performance Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primaryText }]}>5</Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Pools Joined</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primaryText }]}>₹301</Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Total Earned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primaryText }]}>3</Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Top 3 Finishes</Text>
            </View>
          </View>
        </Card>

        {/* Top 5 Performers List */}
        <Card style={styles.topPerformersCard}>
          <Text style={[styles.podiumTitle, { color: colors.primaryText }]}>Top 5 Performers</Text>
          <TopPerformersList data={leaderboardData} />
        </Card>

        {/* User's Rank */}
        <Card style={styles.userRankCard}>
          <View style={styles.userRankHeader}>
            <Text style={[styles.userRankTitle, { color: colors.primaryText }]}>Your Rank</Text>
            <Text style={[styles.userRankNumber, { color: colors.accent }]}>{userObj ? `#${userObj.rank}` : '-'}</Text>
          </View>
          <View style={styles.userRankDetails}>
            {userObj ? (
              <>
                <Image source={{ uri: userObj.avatar }} style={styles.userRankAvatar} />
                <View style={styles.userRankInfo}>
                  <Text style={[styles.userRankName, { color: colors.primaryText }]}>{userObj.name}</Text>
                  <Text style={[styles.userRankSteps, { color: colors.secondaryText }]}>{userObj.steps.toLocaleString()} steps</Text>
                  <Text style={[styles.userRankEarnings, { color: colors.accent }]}>₹{userObj.earnings} earned</Text>
                </View>
              </>
            ) : (
              <Text style={[styles.userRankName, { color: colors.primaryText }]}>Not ranked</Text>
            )}
          </View>
        </Card>

        {/* Last 5 Pools */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Your Last 5 Pools</Text>
          <TouchableOpacity><Text style={[styles.sectionAction, { color: colors.accent }]}>View All</Text></TouchableOpacity>
        </View>

        <View style={styles.poolsContainer}>
          {mockUserPools.map(pool => (
            <UserPoolCard key={pool.id} pool={pool} />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: margin.lg,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold' as const,
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  friendsToggle: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: padding.md,
    paddingVertical: padding.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  friendsToggleText: {
    fontSize: fontSize.sm,
    fontWeight: '600' as const,
  },
  tabContainer: {
    flexDirection: 'row' as const,
    marginBottom: margin.lg,
    borderRadius: 12,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: padding.md,
    paddingHorizontal: padding.lg,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: '600' as const,
  },
  topPerformersCard: {
    marginBottom: margin.lg,
    padding: padding.lg,
  },
  podiumTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
    marginBottom: spacing.md,
  },
  topPerformersList: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-end' as const,
    marginTop: spacing.md,
  },
  topPerformerItem: {
    alignItems: 'center' as const,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  topPerformerAvatarWrapper: {
    position: 'relative' as const,
    marginBottom: spacing.xs,
  },
  topPerformerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  topPerformerMedal: {
    position: 'absolute' as const,
    top: -12,
    left: '50%',
    transform: [{ translateX: -12 }],
    fontSize: 18,
  },
  topPerformerName: {
    fontSize: fontSize.xs,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  },
  topPerformerSteps: {
    fontSize: fontSize.xs,
    textAlign: 'center' as const,
  },
  topPerformerEarnings: {
    fontSize: fontSize.xs,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  },
  userRankCard: {
    marginBottom: margin.lg,
    padding: padding.lg,
  },
  userRankHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.md,
  },
  userRankTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold' as const,
  },
  userRankNumber: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
  },
  userRankDetails: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  userRankAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  userRankInfo: {
    flex: 1,
  },
  userRankName: {
    fontSize: fontSize.md,
    fontWeight: 'bold' as const,
  },
  userRankSteps: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  userRankEarnings: {
    fontSize: fontSize.sm,
    fontWeight: 'bold' as const,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: margin.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
  },
  sectionAction: {
    fontSize: fontSize.sm,
    fontWeight: '600' as const,
  },
  poolsContainer: {
    gap: spacing.md,
  },
  poolCard: {
    padding: padding.lg,
  },
  poolHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.md,
  },
  poolName: {
    fontSize: fontSize.md,
    fontWeight: 'bold' as const,
  },
  poolDate: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: padding.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold' as const,
  },
  poolStats: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: spacing.md,
  },
  statItem: {
    alignItems: 'center' as const,
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: 'bold' as const,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  statsCard: {
    padding: 16,
    marginBottom: margin.lg,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
}); 