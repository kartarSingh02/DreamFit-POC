import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { ScreenContainer } from '../layout/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { AddMoneyModal } from '../ui/AddMoneyModal';
import { padding, margin, fontSize, spacing } from '../../constants/Responsive';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { colors } = useTheme();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.accent;
      case 'upcoming': return colors.gold;
      case 'completed': return colors.secondaryText;
      default: return colors.secondaryText;
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
          <Ionicons name="walk" size={20} color={colors.accent} />
          <Text style={[styles.poolName, { color: colors.primaryText }]}>{pool.name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pool.status) }]}>
          <Text style={[styles.statusText, { color: pool.status === 'completed' ? colors.primaryText : '#fff' }]}>{getStatusText(pool.status)}</Text>
        </View>
      </View>

      <View style={styles.poolDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={colors.secondaryText} />
          <Text style={[styles.detailText, { color: colors.primaryText }]}>{pool.timeSlot}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people" size={16} color={colors.secondaryText} />
          <Text style={[styles.detailText, { color: colors.primaryText }]}>{pool.participants} participants</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="wallet" size={16} color={colors.secondaryText} />
          <Text style={[styles.detailText, { color: colors.primaryText }]}>Entry: ₹{pool.entryFee}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="trophy" size={16} color={colors.secondaryText} />
          <Text style={[styles.detailText, { color: colors.primaryText }]}>Pool: ₹{pool.totalPool}</Text>
        </View>
      </View>

      {pool.status === 'active' && (
        <View style={[styles.countdownContainer, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.countdownLabel, { color: colors.primaryText }]}>Time Remaining:</Text>
          <Text style={[styles.countdownTime, { color: colors.accent }]}>{pool.timeLeft}</Text>
        </View>
      )}

      <View style={[styles.payoutInfo, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.payoutTitle, { color: colors.primaryText }]}>Payout Structure:</Text>
        <View style={styles.payoutRow}>
          <Text style={[styles.payoutRank, { color: colors.primaryText }]}>🥇 1st:</Text>
          <Text style={[styles.payoutAmount, { color: colors.accent }]}>₹{Math.round(pool.totalPool * 0.10)}</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={[styles.payoutRank, { color: colors.primaryText }]}>🥈 2nd:</Text>
          <Text style={[styles.payoutAmount, { color: colors.accent }]}>₹{Math.round(pool.totalPool * 0.05)}</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={[styles.payoutRank, { color: colors.primaryText }]}>🥉 3rd:</Text>
          <Text style={[styles.payoutAmount, { color: colors.accent }]}>₹{Math.round(pool.totalPool * 0.03)}</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={[styles.payoutRank, { color: colors.primaryText }]}>4th-50th:</Text>
          <Text style={[styles.payoutAmount, { color: colors.accent }]}>₹10 (refund)</Text>
        </View>
      </View>

      {pool.status === 'active' && (
        <TouchableOpacity 
          style={[styles.joinButton, { backgroundColor: colors.accent }]}
          onPress={() => onJoin(pool)}
        >
          <Text style={[styles.joinButtonText, { color: '#fff' }]}>Join Pool</Text>
        </TouchableOpacity>
      )}

      {pool.status === 'upcoming' && (
        <TouchableOpacity 
          style={[styles.joinButton, { backgroundColor: colors.secondaryText }]}
          onPress={() => onJoin(pool)}
        >
          <Text style={[styles.joinButtonText, { color: '#fff' }]}>Join Pool</Text>
        </TouchableOpacity>
      )}

      {pool.status === 'completed' && (
        <View style={[styles.completedInfo, { backgroundColor: colors.cardBackground }]}>
          {pool.winnings > 0 ? (
            <>
              <Text style={[styles.completedText, { color: colors.accent }]}>You won ₹{pool.winnings}!</Text>
              <Text style={[styles.positionText, { color: colors.secondaryText }]}>Position: #{pool.position}</Text>
            </>
          ) : (
            <>
              <Text style={[styles.completedText, { color: colors.secondaryText }]}>No winnings</Text>
              <Text style={[styles.positionText, { color: colors.secondaryText }]}>Position: #{pool.position}</Text>
            </>
          )}
        </View>
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
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold' as const,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
  },
  searchContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: 12,
    paddingHorizontal: padding.lg,
    paddingVertical: padding.md,
    marginBottom: margin.lg,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: fontSize.md,
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
    marginLeft: spacing.sm,
  },
  scheduleDetails: {
    gap: spacing.xs,
  },
  scheduleText: {
    fontSize: fontSize.sm,
  },
  tabsContainer: {
    flexDirection: 'row' as const,
    marginBottom: margin.lg,
    borderRadius: 12,
    padding: spacing.xs,
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
  walletInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
  },
  walletBalance: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
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
    marginLeft: spacing.sm,
  },
  joinButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: padding.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  joinButtonText: {
    fontSize: fontSize.md,
    fontWeight: 'bold' as const,
  },
  countdownContainer: {
    padding: padding.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    alignItems: 'center' as const,
  },
  countdownLabel: {
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  countdownTime: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
  },
  payoutInfo: {
    padding: padding.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  payoutTitle: {
    fontSize: fontSize.sm,
    fontWeight: 'bold' as const,
    marginBottom: spacing.sm,
  },
  payoutRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: spacing.xs,
  },
  payoutRank: {
    fontSize: fontSize.xs,
  },
  payoutAmount: {
    fontSize: fontSize.xs,
    fontWeight: 'bold' as const,
  },
  completedInfo: {
    padding: padding.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  completedText: {
    fontSize: fontSize.sm,
    fontWeight: 'bold' as const,
    marginBottom: spacing.xs,
  },
  positionText: {
    fontSize: fontSize.xs,
  },
});

export const ChallengesScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingPools, setUpcomingPools] = useState<any[]>([]);
  const [historyPools, setHistoryPools] = useState<any[]>(mockHistoryPools);

  useEffect(() => {
    setUpcomingPools(generateUpcomingPools());
    
    // Update countdown every second for active pools
    const interval = setInterval(() => {
      setHistoryPools(prev => prev.map(pool => {
        if (pool.status === 'active' && pool.timeLeft) {
          const [minutes, seconds] = pool.timeLeft.split(':').map(Number);
          if (seconds > 0) {
            return { ...pool, timeLeft: `${minutes}:${(seconds - 1).toString().padStart(2, '0')}` };
          } else if (minutes > 0) {
            return { ...pool, timeLeft: `${minutes - 1}:59` };
          } else {
            return { ...pool, status: 'completed', timeLeft: '00:00' };
          }
        }
        return pool;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinPool = (pool: any) => {
    if (userWalletBalance < pool.entryFee) {
      setShowAddMoneyModal(true);
      return;
    }
    
    Alert.alert(
      'Join Pool',
      `Join ${pool.name} for ₹${pool.entryFee}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join', 
          onPress: () => {
            Alert.alert('Success', `You've joined ${pool.name}!`);
          }
        }
      ]
    );
  };

  const getFilteredPools = () => {
    const pools = selectedTab === 'upcoming' ? upcomingPools : historyPools;
    if (!searchQuery) return pools;
    
    return pools.filter(pool => 
      pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.timeSlot.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const formatTimeLeft = (startTime: Date) => {
    const now = new Date();
    const diff = startTime.getTime() - now.getTime();
    
    if (diff <= 0) return '00:00';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ScreenContainer key={theme}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header} key={`header-${theme}`}>
          <View>
            <Text style={[styles.title, { color: colors.primaryText }]}>Challenges & Pools</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Join walking pools and earn rewards</Text>
          </View>
          <View style={styles.walletInfo}>
            <Ionicons name="wallet" size={20} color={colors.accent} />
            <Text style={[styles.walletBalance, { color: colors.primaryText }]}>₹{userWalletBalance}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]} key={`search-${theme}`}>
          <Ionicons name="search" size={20} color={colors.secondaryText} />
          <TextInput
            style={[styles.searchInput, { color: colors.primaryText }]}
            placeholder="Search pools..."
            placeholderTextColor={colors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: colors.cardBackground }]} key={`tabs-${theme}`}>
          {['upcoming', 'history'].map(tab => (
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
                { color: selectedTab === tab ? '#fff' : colors.secondaryText }
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pools List */}
        <View style={styles.poolsContainer}>
          {getFilteredPools().map(pool => (
            <PoolCard key={pool.id} pool={pool} onJoin={handleJoinPool} />
          ))}
        </View>
      </ScrollView>

      <AddMoneyModal 
        visible={showAddMoneyModal} 
        onClose={() => setShowAddMoneyModal(false)} 
      />
    </ScreenContainer>
  );
}; 