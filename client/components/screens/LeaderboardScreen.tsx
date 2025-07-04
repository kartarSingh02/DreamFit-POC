import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Colors from '../../constants/Colors';
import { Text } from '../ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { ScreenContainer } from '../layout/ScreenContainer';

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

const TopPerformersList: React.FC<{ data: any[] }> = ({ data }) => (
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
        <Text style={styles.topPerformerName}>{user.name}</Text>
        <Text style={styles.topPerformerSteps}>{user.steps.toLocaleString()} steps</Text>
        <Text style={styles.topPerformerEarnings}>₹{user.earnings}</Text>
      </View>
    ))}
  </View>
);

const UserPoolCard: React.FC<{ pool: any }> = ({ pool }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return Colors.gold;
      case 'refund': return Colors.accent;
      default: return Colors.secondaryText;
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
          <Text style={styles.poolName}>{pool.name}</Text>
          <Text style={styles.poolDate}>{pool.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pool.status) }]}>
          <Text style={styles.statusText}>{getStatusText(pool.status)}</Text>
        </View>
      </View>

      <View style={styles.poolStats}>
        <View style={styles.statItem}>
          <Ionicons name="walk" size={16} color={Colors.secondaryText} />
          <Text style={styles.statValue}>{pool.steps.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Steps</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="trophy" size={16} color={Colors.secondaryText} />
          <Text style={styles.statValue}>#{pool.position}</Text>
          <Text style={styles.statLabel}>Position</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="wallet" size={16} color={Colors.secondaryText} />
          <Text style={styles.statValue}>₹{pool.earnings}</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
      </View>
    </Card>
  );
};

export const LeaderboardScreen: React.FC = () => {
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
            <Text style={styles.title}>Leaderboard</Text>
            <Text style={styles.subtitle}>Top performers in walking pools</Text>
          </View>
          <TouchableOpacity 
            style={[styles.friendsToggle, showFriends && styles.friendsToggleActive]}
            onPress={() => setShowFriends(!showFriends)}
          >
            <Ionicons name={showFriends ? 'people' : 'earth'} size={20} color={showFriends ? Colors.primaryText : Colors.secondaryText} />
            <Text style={styles.friendsToggleText}>{showFriends ? 'Friends' : 'Global'}</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['daily', 'weekly', 'all-time'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top 5 Performers List */}
        <Card style={styles.topPerformersCard}>
          <Text style={styles.podiumTitle}>Top 5 Performers</Text>
          <TopPerformersList data={leaderboardData} />
        </Card>

        {/* User's Rank */}
        <Card style={styles.userRankCard}>
          <View style={styles.userRankHeader}>
            <Text style={styles.userRankTitle}>Your Rank</Text>
            <Text style={styles.userRankNumber}>{userObj ? `#${userObj.rank}` : '-'}</Text>
          </View>
          <View style={styles.userRankDetails}>
            {userObj ? (
              <>
                <Image source={{ uri: userObj.avatar }} style={styles.userRankAvatar} />
                <View style={styles.userRankInfo}>
                  <Text style={styles.userRankName}>{userObj.name}</Text>
                  <Text style={styles.userRankSteps}>{userObj.steps.toLocaleString()} steps</Text>
                  <Text style={styles.userRankEarnings}>₹{userObj.earnings} earned</Text>
                </View>
              </>
            ) : (
              <Text style={styles.userRankName}>Not ranked</Text>
            )}
          </View>
        </Card>

        {/* Last 5 Pools */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Last 5 Pools</Text>
          <TouchableOpacity><Text style={styles.sectionAction}>View All</Text></TouchableOpacity>
        </View>

        <View style={styles.poolsContainer}>
          {mockUserPools.map(pool => (
            <UserPoolCard key={pool.id} pool={pool} />
          ))}
        </View>

        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Performance Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Pools Joined</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹301</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Top 3 Finishes</Text>
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  friendsToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
  },
  friendsToggleActive: {
    backgroundColor: Colors.accent,
  },
  walletCard: {
    marginBottom: 20,
    padding: 16,
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
  walletBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gold,
    marginTop: 4,
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  withdrawText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginLeft: 4,
  },
  walletSubtext: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  activeTabText: {
    color: Colors.primaryText,
  },
  topPerformersCard: {
    marginBottom: 20,
    padding: 16,
  },
  podiumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 16,
    textAlign: 'center',
  },
  topPerformersList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  topPerformerItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  topPerformerAvatarWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  topPerformerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  topPerformerMedal: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -12 }],
    fontSize: 18,
  },
  topPerformerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryText,
    textAlign: 'center',
  },
  topPerformerSteps: {
    fontSize: 10,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  topPerformerEarnings: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.gold,
    textAlign: 'center',
  },
  userRankCard: {
    marginBottom: 20,
    padding: 16,
  },
  userRankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userRankTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  userRankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  userRankDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRankAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userRankInfo: {
    flex: 1,
  },
  userRankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  userRankSteps: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  userRankEarnings: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.gold,
    marginTop: 2,
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
  sectionAction: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
  },
  poolsContainer: {
    marginBottom: 20,
  },
  poolCard: {
    marginBottom: 12,
    padding: 16,
  },
  poolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  poolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  poolDate: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  poolStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  statsCard: {
    padding: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  friendsToggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginLeft: 4,
  },
}); 