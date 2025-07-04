import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { ScreenContainer } from '../layout/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { AddMoneyModal } from '../ui/AddMoneyModal';
import { padding, margin, fontSize, spacing } from '../../constants/Responsive';

// Generate upcoming pools for next 10 slots
const generateUpcomingPools = () => {
  const pools = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Define time slots: 5-9am and 6-10pm, 10-minute intervals
  const morningSlots = [];
  const eveningSlots = [];
  
  // Morning slots (5:00 AM to 9:00 AM)
  for (let hour = 5; hour < 9; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      morningSlots.push({ hour, minute });
    }
  }
  
  // Evening slots (6:00 PM to 10:00 PM)
  for (let hour = 18; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      eveningSlots.push({ hour, minute });
    }
  }
  
  const allSlots = [...morningSlots, ...eveningSlots];
  let poolId = 1;
  
  // Generate pools for today and tomorrow
  for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
    const poolDate = new Date(today);
    poolDate.setDate(today.getDate() + dayOffset);
    
    for (const slot of allSlots) {
      const poolTime = new Date(poolDate);
      poolTime.setHours(slot.hour, slot.minute, 0, 0);
      
      // Only include future pools
      if (poolTime > now) {
        const timeString = poolTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        const endTime = new Date(poolTime);
        endTime.setMinutes(poolTime.getMinutes() + 10);
        const endTimeString = endTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        
        pools.push({
          id: poolId++,
          name: `${timeString} Walking Pool`,
          timeSlot: `${timeString} - ${endTimeString}`,
          startTime: poolTime,
          participants: Math.floor(Math.random() * 50) + 1,
          entryFee: 10,
          totalPool: Math.floor(Math.random() * 500) + 100,
          status: 'upcoming',
          timeLeft: '00:00', // Will be calculated
          type: 'walking',
        });
      }
    }
  }
  
  return pools.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

// Mock completed/active pools for history
const mockHistoryPools = [
  {
    id: 1001,
    name: '8:30 AM Walking Pool',
    timeSlot: '8:30 AM - 8:40 AM',
    participants: 45,
    entryFee: 10,
    totalPool: 450,
    status: 'completed',
    winnings: 0,
    position: 12,
    type: 'walking',
  },
  {
    id: 1002,
    name: '7:00 PM Walking Pool',
    timeSlot: '7:00 PM - 7:10 PM',
    participants: 67,
    entryFee: 10,
    totalPool: 670,
    status: 'completed',
    winnings: 25,
    position: 3,
    type: 'walking',
  },
  {
    id: 1003,
    name: '6:20 PM Walking Pool',
    timeSlot: '6:20 PM - 6:30 PM',
    participants: 23,
    entryFee: 10,
    totalPool: 230,
    status: 'active',
    timeLeft: '05:30',
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



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: margin.lg,
  },
  headerTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: Colors.secondaryText,
  },
  searchContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: padding.lg,
    paddingVertical: padding.md,
    marginBottom: margin.lg,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: fontSize.md,
    color: Colors.primaryText,
  },
  scheduleCard: {
    marginBottom: margin.lg,
    padding: padding.lg,
  },
  scheduleHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.md,
  },
  scheduleTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    marginLeft: spacing.sm,
  },
  scheduleDetails: {
    gap: spacing.xs,
  },
  scheduleText: {
    fontSize: fontSize.sm,
    color: Colors.secondaryText,
  },
  tabsContainer: {
    flexDirection: 'row' as const,
    marginBottom: margin.lg,
    backgroundColor: Colors.cardBackground,
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
  activeTab: {
    backgroundColor: Colors.accent,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: '600' as const,
    color: Colors.secondaryText,
  },
  activeTabText: {
    color: Colors.primaryText,
  },
  poolsContainer: {
    gap: spacing.md,
  },
  emptyCard: {
    padding: padding.xl,
    alignItems: 'center' as const,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: Colors.secondaryText,
    textAlign: 'center' as const,
    marginTop: spacing.md,
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
  poolTitleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  poolName: {
    fontSize: fontSize.md,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    marginLeft: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
  },
  poolDetails: {
    gap: spacing.sm,
    marginBottom: margin.lg,
  },
  detailRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: Colors.secondaryText,
    marginLeft: spacing.sm,
  },
  joinButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: Colors.accent,
    paddingVertical: padding.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  joinButtonText: {
    fontSize: fontSize.md,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
  },
  reminderButton: {
    backgroundColor: Colors.gold,
  },
  countdownContainer: {
    backgroundColor: Colors.accent,
    padding: padding.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    alignItems: 'center' as const,
  },
  countdownLabel: {
    fontSize: fontSize.xs,
    color: Colors.primaryText,
    marginBottom: spacing.xs,
  },
  countdownTime: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
  },
  payoutInfo: {
    backgroundColor: Colors.cardBackground,
    padding: padding.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  payoutTitle: {
    fontSize: fontSize.sm,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    marginBottom: spacing.sm,
  },
  payoutRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: spacing.xs,
  },
  payoutRank: {
    fontSize: fontSize.xs,
    color: Colors.secondaryText,
  },
  payoutAmount: {
    fontSize: fontSize.xs,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
  },
});

export const ChallengesScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [addMoneyVisible, setAddMoneyVisible] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1250);
  const [joinedPools, setJoinedPools] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingPools, setUpcomingPools] = useState<any[]>([]);

  useEffect(() => {
    setUpcomingPools(generateUpcomingPools());
  }, []);

  const handleJoinPool = (pool: any) => {
    if (joinedPools.includes(pool.id)) return;
    if (walletBalance < pool.entryFee) {
      setAddMoneyVisible(true);
      return;
    }
    setWalletBalance(bal => bal - pool.entryFee);
    setJoinedPools(ids => [...ids, pool.id]);
    Alert.alert('Success', `You have registered for ${pool.name}! ₹${pool.entryFee} deducted from your wallet.`);
  };

  const getFilteredPools = () => {
    let pools = [];
    
    if (selectedTab === 'upcoming') {
      pools = upcomingPools;
    } else if (selectedTab === 'active') {
      pools = mockHistoryPools.filter(p => p.status === 'active');
    } else if (selectedTab === 'completed') {
      pools = mockHistoryPools.filter(p => p.status === 'completed');
    }

    // Filter by search query
    if (searchQuery) {
      pools = pools.filter(pool => 
        pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.timeSlot.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return pools;
  };

  const formatTimeLeft = (startTime: Date) => {
    const now = new Date();
    const diff = startTime.getTime() - now.getTime();
    if (diff <= 0) return '00:00';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const filteredPools = getFilteredPools();

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Walking Pools</Text>
          <Text style={styles.headerSubtitle}>Join walking challenges and win rewards!</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.secondaryText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pools by time..."
            placeholderTextColor={Colors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Schedule Info */}
        <Card style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <Ionicons name="calendar" size={24} color={Colors.accent} />
            <Text style={styles.scheduleTitle}>Pool Schedule</Text>
          </View>
          <View style={styles.scheduleDetails}>
            <Text style={styles.scheduleText}>• Morning: 5:00 AM - 9:00 AM (10-min intervals)</Text>
            <Text style={styles.scheduleText}>• Evening: 6:00 PM - 10:00 PM (10-min intervals)</Text>
            <Text style={styles.scheduleText}>• Entry Fee: ₹10 per pool</Text>
            <Text style={styles.scheduleText}>• Register up to 1 day in advance</Text>
          </View>
        </Card>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'upcoming' && styles.activeTab]} 
            onPress={() => setSelectedTab('upcoming')}
          >
            <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.activeTabText]}>
              Upcoming ({upcomingPools.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'active' && styles.activeTab]} 
            onPress={() => setSelectedTab('active')}
          >
            <Text style={[styles.tabText, selectedTab === 'active' && styles.activeTabText]}>
              Live Now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'completed' && styles.activeTab]} 
            onPress={() => setSelectedTab('completed')}
          >
            <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pools List */}
        <View style={styles.poolsContainer}>
          {filteredPools.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Ionicons name="search" size={48} color={Colors.secondaryText} />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No pools found for your search.' : 'No pools available in this category.'}
              </Text>
            </Card>
          ) : (
            filteredPools.map(pool => (
              <Card key={pool.id} style={styles.poolCard}>
                <View style={styles.poolHeader}>
                  <View style={styles.poolTitleRow}>
                    <Ionicons name="walk" size={20} color={Colors.accent} />
                    <Text style={styles.poolName}>{pool.name}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge, 
                    { 
                      backgroundColor: pool.status === 'active' ? Colors.accent : 
                                    pool.status === 'upcoming' ? Colors.gold : 
                                    Colors.secondaryText 
                    }
                  ]}> 
                    <Text style={styles.statusText}>
                      {pool.status === 'active' ? 'LIVE NOW' : 
                       pool.status === 'upcoming' ? 'UPCOMING' : 
                       'COMPLETED'}
                    </Text>
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
                  
                  {/* Show time left for upcoming pools */}
                  {pool.status === 'upcoming' && (
                    <View style={styles.detailRow}>
                      <Ionicons name="timer" size={16} color={Colors.gold} />
                      <Text style={[styles.detailText, { color: Colors.gold }]}>
                        Starts in: {formatTimeLeft(pool.startTime)}
                      </Text>
                    </View>
                  )}
                  
                  {/* Show results for completed pools */}
                  {pool.status === 'completed' && (
                    <View style={styles.detailRow}>
                      <Ionicons name="medal" size={16} color={pool.winnings > 0 ? Colors.gold : Colors.secondaryText} />
                      <Text style={[styles.detailText, { color: pool.winnings > 0 ? Colors.gold : Colors.secondaryText }]}>
                        Position: {pool.position} • Winnings: ₹{pool.winnings}
                      </Text>
                    </View>
                  )}
                </View>
                
                {/* Join/Register Button - Only show for upcoming pools */}
                {pool.status === 'upcoming' && (
                  joinedPools.includes(pool.id) ? (
                    <View style={[styles.joinButton, { backgroundColor: Colors.secondaryText }]}> 
                      <Text style={[styles.joinButtonText, { color: Colors.primaryText }]}>Registered</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinPool(pool)}>
                      <Ionicons name="log-in" size={18} color={Colors.primaryText} />
                      <Text style={styles.joinButtonText}>Join for ₹{pool.entryFee}</Text>
                    </TouchableOpacity>
                  )
                )}
              </Card>
            ))
          )}
        </View>
      </ScrollView>
      <AddMoneyModal visible={addMoneyVisible} onClose={() => setAddMoneyVisible(false)} />
    </ScreenContainer>
  );
}; 