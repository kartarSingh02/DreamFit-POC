import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { ScreenContainer } from '../layout/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

// Mock data for pools
const mockPools = [
  {
    id: 1,
    name: 'Morning Walk Pool',
    timeSlot: '5:00 AM - 5:10 AM',
    participants: 156,
    entryFee: 10,
    totalPool: 1560,
    status: 'active',
    timeLeft: '2:34',
    type: 'walking',
  },
  {
    id: 2,
    name: 'Evening Walk Pool',
    timeSlot: '6:00 PM - 6:10 PM',
    participants: 89,
    entryFee: 10,
    totalPool: 890,
    status: 'upcoming',
    timeLeft: '4:22',
    type: 'walking',
  },
  {
    id: 3,
    name: 'Sunrise Steps',
    timeSlot: '6:30 AM - 6:40 AM',
    participants: 203,
    entryFee: 10,
    totalPool: 2030,
    status: 'completed',
    timeLeft: '0:00',
    type: 'walking',
  },
];

const userWalletBalance = 1250; // in rupees

const PoolCard: React.FC<{ pool: any; onJoin: (pool: any) => void }> = ({ pool, onJoin }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.accent;
      case 'upcoming': return Colors.gold;
      case 'completed': return Colors.secondaryText;
      default: return Colors.secondaryText;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'LIVE NOW';
      case 'upcoming': return 'UPCOMING';
      case 'completed': return 'COMPLETED';
      default: return 'UNKNOWN';
    }
  };

  return (
    <Card style={styles.poolCard}>
      <View style={styles.poolHeader}>
        <View style={styles.poolTitleRow}>
          <Ionicons name="walk" size={20} color={Colors.accent} />
          <Text style={styles.poolName}>{pool.name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pool.status) }]}>
          <Text style={styles.statusText}>{getStatusText(pool.status)}</Text>
        </View>
      </View>

      <View style={styles.poolDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={Colors.secondaryText} />
          <Text style={styles.detailText}>{pool.timeSlot}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people" size={16} color={Colors.secondaryText} />
          <Text style={styles.detailText}>{pool.participants} participants</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="wallet" size={16} color={Colors.secondaryText} />
          <Text style={styles.detailText}>Entry: ₹{pool.entryFee}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="trophy" size={16} color={Colors.secondaryText} />
          <Text style={styles.detailText}>Pool: ₹{pool.totalPool}</Text>
        </View>
      </View>

      {pool.status === 'active' && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownLabel}>Time Remaining:</Text>
          <Text style={styles.countdownTime}>{pool.timeLeft}</Text>
        </View>
      )}

      <View style={styles.payoutInfo}>
        <Text style={styles.payoutTitle}>Payout Structure:</Text>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutRank}>🥇 1st:</Text>
          <Text style={styles.payoutAmount}>₹{Math.round(pool.totalPool * 0.10)}</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutRank}>🥈 2nd:</Text>
          <Text style={styles.payoutAmount}>₹{Math.round(pool.totalPool * 0.05)}</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutRank}>🥉 3rd:</Text>
          <Text style={styles.payoutAmount}>₹{Math.round(pool.totalPool * 0.03)}</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={styles.payoutRank}>4th-50th:</Text>
          <Text style={styles.payoutAmount}>₹10 (refund)</Text>
        </View>
      </View>

      {pool.status === 'active' && (
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={() => onJoin(pool)}
        >
          <Ionicons name="play" size={18} color={Colors.primaryText} />
          <Text style={styles.joinButtonText}>Join Pool</Text>
        </TouchableOpacity>
      )}

      {pool.status === 'upcoming' && (
        <TouchableOpacity 
          style={[styles.joinButton, styles.reminderButton]} 
          onPress={() => Alert.alert('Reminder Set', 'You\'ll be notified when this pool starts!')}
        >
          <Ionicons name="notifications" size={18} color={Colors.primaryText} />
          <Text style={styles.joinButtonText}>Set Reminder</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

export const ChallengesScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('active');

  const handleJoinPool = (pool: any) => {
    if (userWalletBalance < pool.entryFee) {
      Alert.alert(
        'Insufficient Balance',
        'You need ₹10 to join this pool. Add money to your wallet?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Money', onPress: () => Alert.alert('Add Money', 'Redirecting to wallet...') },
        ]
      );
      return;
    }

    Alert.alert(
      'Join Pool',
      `Join "${pool.name}"?\n\nEntry Fee: ₹${pool.entryFee}\nPool Size: ₹${pool.totalPool}\nParticipants: ${pool.participants}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join Pool', 
          onPress: () => Alert.alert('Success', 'You\'ve joined the pool! Start walking to compete!') 
        },
      ]
    );
  };

  const filteredPools = mockPools.filter(pool => {
    if (selectedTab === 'active') return pool.status === 'active';
    if (selectedTab === 'upcoming') return pool.status === 'upcoming';
    if (selectedTab === 'completed') return pool.status === 'completed';
    return true;
  });

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Walking Pools</Text>
            <Text style={styles.subtitle}>Join 10-minute walking challenges</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings" size={24} color={Colors.primaryText} />
          </TouchableOpacity>
        </View>

        {/* Pool Schedule Info */}
        <Card style={styles.scheduleCard}>
          <Text style={styles.scheduleTitle}>Pool Schedule</Text>
          <View style={styles.scheduleRow}>
            <Ionicons name="sunny" size={16} color={Colors.gold} />
            <Text style={styles.scheduleText}>Morning: 5:00 AM - 9:00 AM (10-min intervals)</Text>
          </View>
          <View style={styles.scheduleRow}>
            <Ionicons name="moon" size={16} color={Colors.accent} />
            <Text style={styles.scheduleText}>Evening: 6:00 PM - 10:00 PM (10-min intervals)</Text>
          </View>
        </Card>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['active', 'upcoming', 'completed'].map(tab => (
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

        {/* Pools List */}
        <View style={styles.poolsContainer}>
          {filteredPools.map(pool => (
            <PoolCard key={pool.id} pool={pool} onJoin={handleJoinPool} />
          ))}
        </View>

        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Pool Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Pools Joined</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹450</Text>
              <Text style={styles.statLabel}>Total Won</Text>
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
  settingsBtn: {
    padding: 8,
  },
  scheduleCard: {
    marginBottom: 20,
    padding: 16,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 8,
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
  poolsContainer: {
    marginBottom: 20,
  },
  poolCard: {
    marginBottom: 16,
    padding: 16,
  },
  poolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  poolTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  poolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginLeft: 8,
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
  poolDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 8,
  },
  countdownContainer: {
    backgroundColor: Colors.accent,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 12,
    color: Colors.primaryText,
    marginBottom: 4,
  },
  countdownTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  payoutInfo: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  payoutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 8,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  payoutRank: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  payoutAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: 8,
  },
  reminderButton: {
    backgroundColor: Colors.gold,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginLeft: 6,
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
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
}); 