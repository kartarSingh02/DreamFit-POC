import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../layout/ScreenContainer';
import { AddMoneyModal } from '../ui/AddMoneyModal';
import { useStepCounter } from '../StepCounterContext';
import { useTheme } from '../../contexts/ThemeContext';
import Colors from '@/constants/Colors';

// Trending challenges data
const trendingChallenges = [
  {
    id: '1',
    name: 'Weekend Warrior',
    participants: 1247,
    reward: '1000 Points + Crown',
    type: 'steps',
    difficulty: 'medium',
    timeLimit: '48h',
    category: 'trending',
  },
  {
    id: '2',
    name: 'Calorie Crusher',
    participants: 892,
    reward: 'Ring + 500 Points',
    type: 'calories',
    difficulty: 'hard',
    timeLimit: '24h',
    category: 'trending',
  },
  {
    id: '3',
    name: 'Speed Demon',
    participants: 567,
    reward: 'Voucher + 300 Points',
    type: 'distance',
    difficulty: 'easy',
    timeLimit: '12h',
    category: 'new',
  },
];

// Featured challenges
const featuredChallenges = [
  {
    id: 'f1',
    name: 'Marathon Master',
    description: 'Complete a full marathon distance in 7 days',
    participants: 156,
    reward: 'Legendary Ring + 2000 Points',
    type: 'distance',
    difficulty: 'legendary',
    timeLimit: '7 days',
    specialReward: '🏆 Trophy',
  },
  {
    id: 'f2',
    name: 'Calorie King',
    description: 'Burn 10,000 calories in one week',
    participants: 89,
    reward: 'Epic Crown + 1500 Points',
    type: 'calories',
    difficulty: 'epic',
    timeLimit: '7 days',
    specialReward: '👑 Golden Crown',
  },
];

// Generate upcoming pools
const generateUpcomingPools = () => {
  const pools = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const morningSlots = [];
  const eveningSlots = [];
  
  for (let hour = 5; hour < 9; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      morningSlots.push({ hour, minute });
    }
  }
  
  for (let hour = 18; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      eveningSlots.push({ hour, minute });
    }
  }
  
  const allSlots = [...morningSlots, ...eveningSlots];
  let poolId = 1;
  
  for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
    const poolDate = new Date(today);
    poolDate.setDate(today.getDate() + dayOffset);
    
    for (const slot of allSlots) {
      const poolTime = new Date(poolDate);
      poolTime.setHours(slot.hour, slot.minute, 0, 0);
      
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
          type: 'walking',
        });
      }
    }
  }
  
  return pools.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

// Mock completed/active pools
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

interface ChallengeCardProps {
  challenge: any;
  onJoin: (challenge: any) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin }) => {
  const { colors } = useTheme();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FFD700';
      default: return colors.accent;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'steps': return '👟';
      case 'calories': return '🔥';
      case 'distance': return '🏃';
      default: return '🎯';
    }
  };

  return (
    <Card style={[styles.challengeCard, { borderColor: colors.borderColor }]}>
      <View style={styles.challengeHeader}>
        <View style={[styles.challengeIcon, { backgroundColor: colors.accent }]}>
          <Text style={styles.challengeIconText}>{getTypeIcon(challenge.type)}</Text>
        </View>
        <View style={styles.challengeInfo}>
          <Text style={[styles.challengeName, { color: colors.primaryText }]}>{challenge.name}</Text>
          {challenge.description && (
            <Text style={[styles.challengeDescription, { color: colors.secondaryText }]}>{challenge.description}</Text>
          )}
          <View style={styles.challengeMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
              <Text style={[styles.difficultyText, { color: colors.primaryText }]}>{challenge.difficulty.toUpperCase()}</Text>
            </View>
            <Text style={[styles.timeLimit, { color: colors.secondaryText }]}>{challenge.timeLimit}</Text>
          </View>
        </View>
        <View style={styles.participantsContainer}>
          <Text style={[styles.participantsText, { color: colors.primaryText }]}>{challenge.participants}</Text>
          <Text style={[styles.participantsLabel, { color: colors.secondaryText }]}>participants</Text>
        </View>
      </View>
      
      <View style={styles.challengeFooter}>
        <View style={styles.rewardContainer}>
          <Text style={[styles.rewardLabel, { color: colors.secondaryText }]}>Reward:</Text>
          <Text style={[styles.rewardText, { color: colors.gold }]}>{challenge.reward}</Text>
          {challenge.specialReward && (
            <Text style={[styles.specialReward, { color: colors.accent }]}>{challenge.specialReward}</Text>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.joinButton, { backgroundColor: colors.accent }]}
          onPress={() => onJoin(challenge)}
        >
          <Text style={[styles.joinButtonText, { color: colors.primaryText }]}>Join</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

interface PoolCardProps {
  pool: any;
  onJoin: (pool: any) => void;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, onJoin }) => {
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
          <Text style={[styles.statusText, { color: colors.primaryText }]}>{getStatusText(pool.status)}</Text>
        </View>
      </View>

      <View style={styles.poolDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={colors.secondaryText} />
          <Text style={[styles.detailText, { color: colors.secondaryText }]}>{pool.timeSlot}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people" size={16} color={colors.secondaryText} />
          <Text style={[styles.detailText, { color: colors.secondaryText }]}>{pool.participants} participants</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="wallet" size={16} color={colors.secondaryText} />
          <Text style={[styles.detailText, { color: colors.secondaryText }]}>Entry: ₹{pool.entryFee}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="trophy" size={16} color={colors.secondaryText} />
          <Text style={[styles.detailText, { color: colors.secondaryText }]}>Pool: ₹{pool.totalPool}</Text>
        </View>
      </View>

      {pool.status === 'active' && (
        <View style={[styles.countdownContainer, { backgroundColor: colors.accent }]}>
          <Text style={[styles.countdownLabel, { color: colors.primaryText }]}>Time Remaining:</Text>
          <Text style={[styles.countdownTime, { color: colors.primaryText }]}>{pool.timeLeft}</Text>
        </View>
      )}

      <View style={styles.payoutInfo}>
        <Text style={[styles.payoutTitle, { color: colors.primaryText }]}>Payout Structure:</Text>
        <View style={styles.payoutRow}>
          <Text style={[styles.payoutRank, { color: colors.secondaryText }]}>🥇 1st:</Text>
          <Text style={[styles.payoutAmount, { color: colors.gold }]}>₹{Math.round(pool.totalPool * 0.10)}</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={[styles.payoutRank, { color: colors.secondaryText }]}>🥈 2nd:</Text>
          <Text style={[styles.payoutAmount, { color: colors.gold }]}>₹{Math.round(pool.totalPool * 0.05)}</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={[styles.payoutRank, { color: colors.secondaryText }]}>🥉 3rd:</Text>
          <Text style={[styles.payoutAmount, { color: colors.gold }]}>₹{Math.round(pool.totalPool * 0.03)}</Text>
        </View>
        <View style={styles.payoutRow}>
          <Text style={[styles.payoutRank, { color: colors.secondaryText }]}>4th-50th:</Text>
          <Text style={[styles.payoutAmount, { color: colors.gold }]}>₹10 (refund)</Text>
        </View>
      </View>

      {pool.status === 'upcoming' && (
        <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.accent }]} onPress={() => onJoin(pool)}>
          <Text style={[styles.joinButtonText, { color: colors.primaryText }]}>Join Pool</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

const MyParticipationTab: React.FC<{ myJoinedPools: any[]; myJoinedChallenges: any[]; styles: any; }> = ({ myJoinedPools, myJoinedChallenges, styles }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.myParticipationContainer}>
      <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>My Joined Pools & Challenges</Text>
      {myJoinedPools.length === 0 && myJoinedChallenges.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="star-outline" size={48} color={colors.secondaryText} />
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>You haven't joined any pools or challenges yet.</Text>
        </Card>
      ) : (
        <>
          {myJoinedPools.map(pool => (
            <Card key={`pool-${pool.id}`} style={styles.myItemCard}>
              <Text style={[styles.myItemType, { color: colors.primaryText }]}>🚶 Walking Pool</Text>
              <Text style={[styles.myItemName, { color: colors.primaryText }]}>{pool.name}</Text>
              <Text style={[styles.myItemDetail, { color: colors.secondaryText }]}>Time: {pool.timeSlot}</Text>
              <Text style={[styles.myItemDetail, { color: colors.secondaryText }]}>Entry Fee: ₹{pool.entryFee}</Text>
              <Text style={[styles.myItemDetail, { color: colors.secondaryText }]}>Status: {pool.status === 'active' ? 'Live' : pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}</Text>
            </Card>
          ))}
          {myJoinedChallenges.map(challenge => (
            <Card key={`challenge-${challenge.id}`} style={styles.myItemCard}>
              <Text style={[styles.myItemType, { color: colors.primaryText }]}>🏆 Challenge</Text>
              <Text style={[styles.myItemName, { color: colors.primaryText }]}>{challenge.name}</Text>
              <Text style={[styles.myItemDetail, { color: colors.secondaryText }]}>Reward: {challenge.reward}</Text>
              <Text style={[styles.myItemDetail, { color: colors.secondaryText }]}>Difficulty: {challenge.difficulty}</Text>
            </Card>
          ))}
        </>
      )}
    </View>
  );
};

export const ChallengesAndPoolsScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'pools' | 'challenges' | 'my'>('pools');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPoolTab, setSelectedPoolTab] = useState<'upcoming' | 'active' | 'completed'>('upcoming');
  const [addMoneyVisible, setAddMoneyVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingPools, setUpcomingPools] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(1250);
  const [joinedPools, setJoinedPools] = useState<number[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  
  // Step counter context
  const { setActiveParticipation } = useStepCounter();

  useEffect(() => {
    setUpcomingPools(generateUpcomingPools());
  }, []);

  // Check if user has any active participation
  useEffect(() => {
    const hasActive = joinedPools.length > 0 || joinedChallenges.length > 0;
    setActiveParticipation(hasActive);
  }, [joinedPools, joinedChallenges, setActiveParticipation]);

  // Timer to check if joined pools have started
  useEffect(() => {
    if (joinedPools.length === 0) return;

    const checkPoolStatus = () => {
      const now = new Date();
      const activePools = joinedPools.filter(poolId => {
        const pool = upcomingPools.find(p => p.id === poolId);
        if (!pool) return false;
        return pool.startTime <= now && now <= new Date(pool.startTime.getTime() + 10 * 60 * 1000); // 10 minutes
      });

      if (activePools.length > 0) {
        // Pool is active, ensure tracking is on
        setActiveParticipation(true);
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkPoolStatus, 30000);
    checkPoolStatus(); // Check immediately

    return () => clearInterval(interval);
  }, [joinedPools, upcomingPools, setActiveParticipation]);

  const handleJoinChallenge = (challenge: any) => {
    Alert.alert(
      'Join Challenge',
      `Are you sure you want to join "${challenge.name}"?\n\nStep tracking will start automatically.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join', 
          onPress: () => {
            setJoinedChallenges(prev => [...prev, challenge.id]);
            Alert.alert('Success', `You've joined ${challenge.name}! Step tracking is now active.`);
          }
        },
      ]
    );
  };

  const handleJoinPool = (pool: any) => {
    if (joinedPools.includes(pool.id)) return;
    if (walletBalance < pool.entryFee) {
      setAddMoneyVisible(true);
      return;
    }
    setWalletBalance(bal => bal - pool.entryFee);
    setJoinedPools(ids => [...ids, pool.id]);
    Alert.alert('Success', `You have registered for ${pool.name}! ₹${pool.entryFee} deducted from your wallet.\n\nStep tracking will start when the pool begins.`);
  };

  const getFilteredPools = () => {
    let pools = [];
    
    if (selectedPoolTab === 'upcoming') {
      pools = upcomingPools;
    } else if (selectedPoolTab === 'active') {
      pools = mockHistoryPools.filter(p => p.status === 'active');
    } else if (selectedPoolTab === 'completed') {
      pools = mockHistoryPools.filter(p => p.status === 'completed');
    }

    if (searchQuery) {
      pools = pools.filter(pool => 
        pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.timeSlot.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return pools;
  };

  const filteredChallenges = selectedCategory === 'all' 
    ? trendingChallenges 
    : trendingChallenges.filter(challenge => challenge.category === selectedCategory);

  const filteredPools = getFilteredPools();

  // Helper to get joined pools/challenges data
  const myJoinedPools = upcomingPools.filter(pool => joinedPools.includes(pool.id)).concat(
    mockHistoryPools.filter(pool => joinedPools.includes(pool.id))
  );
  const myJoinedChallenges = trendingChallenges.filter(challenge => joinedChallenges.includes(challenge.id));

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.primaryText }]}>Challenges</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Join walking pools and challenges to win rewards!</Text>
          </View>
          <TouchableOpacity onPress={() => setAddMoneyVisible(true)} style={[styles.walletButton, { backgroundColor: colors.accent }]}>
            <Ionicons name="wallet" size={24} color={colors.primaryText} />
            <Ionicons name="add" size={16} color={colors.primaryText} style={styles.addIcon} />
          </TouchableOpacity>
        </View>

        {/* Main Tabs */}
        <View style={[styles.mainTabs, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity 
            style={[styles.mainTab, activeTab === 'pools' && { backgroundColor: colors.accent }]} 
            onPress={() => setActiveTab('pools')}
          >
            <Text style={[
              styles.mainTabText, 
              { color: colors.secondaryText },
              activeTab === 'pools' && { color: '#FFFFFF' }
            ]}>
              🚶 Walking Pools
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.mainTab, activeTab === 'challenges' && { backgroundColor: colors.accent }]} 
            onPress={() => setActiveTab('challenges')}
          >
            <Text style={[
              styles.mainTabText, 
              { color: colors.secondaryText },
              activeTab === 'challenges' && { color: '#FFFFFF' }
            ]}>
              🏆 Challenges
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.mainTab, activeTab === 'my' && { backgroundColor: colors.accent }]} 
            onPress={() => setActiveTab('my')}
          >
            <Text style={[
              styles.mainTabText, 
              { color: colors.secondaryText },
              activeTab === 'my' && { color: '#FFFFFF' }
            ]}>
              ⭐ My Participation
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'my' && (
          <MyParticipationTab myJoinedPools={myJoinedPools} myJoinedChallenges={myJoinedChallenges} styles={styles} />
        )}

        {activeTab === 'challenges' && (
          <>
            {/* Category Filters */}
            <View style={styles.categoryContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[
                  { id: 'all', name: 'All', icon: '🏆' },
                  { id: 'trending', name: 'Trending', icon: '🔥' },
                  { id: 'new', name: 'New', icon: '🆕' },
                ].map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      { backgroundColor: colors.cardBackground },
                      selectedCategory === category.id && { backgroundColor: colors.accent }
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryText,
                      { color: colors.secondaryText },
                      selectedCategory === category.id && { color: '#FFFFFF' }
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {/* Featured Challenges */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💎 Featured Challenges</Text>
              {featuredChallenges.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onJoin={handleJoinChallenge}
                />
              ))}
            </View>
            {/* Trending Challenges */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔥 Trending Challenges</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {filteredChallenges.map((challenge) => (
                  <View key={challenge.id} style={styles.challengeCardContainer}>
                    <ChallengeCard challenge={challenge} onJoin={handleJoinChallenge} />
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        {activeTab === 'pools' && (
          <>
            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
              <Ionicons name="search" size={20} color={colors.secondaryText} />
              <TextInput
                style={[styles.searchInput, { color: colors.primaryText }]}
                placeholder="Search pools by time..."
                placeholderTextColor={colors.secondaryText}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Schedule Info */}
            <Card style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <Ionicons name="calendar" size={24} color={colors.accent} />
                <Text style={styles.scheduleTitle}>Pool Schedule</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={[styles.scheduleText, { color: colors.secondaryText }]}>• Morning: 5:00 AM - 9:00 AM (10-min intervals)</Text>
                <Text style={[styles.scheduleText, { color: colors.secondaryText }]}>• Evening: 6:00 PM - 10:00 PM (10-min intervals)</Text>
                <Text style={[styles.scheduleText, { color: colors.secondaryText }]}>• Entry Fee: ₹10 per pool</Text>
              </View>
            </Card>

            {/* Pool Tabs */}
            <View style={[styles.poolTabs, { backgroundColor: colors.cardBackground }]}>
              <TouchableOpacity 
                style={[styles.poolTab, selectedPoolTab === 'upcoming' && { backgroundColor: colors.accent }]} 
                onPress={() => setSelectedPoolTab('upcoming')}
              >
                <Text style={[
                  styles.poolTabText, 
                  { color: colors.secondaryText },
                  selectedPoolTab === 'upcoming' && { color: '#FFFFFF' }
                ]}>
                  Upcoming ({upcomingPools.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.poolTab, selectedPoolTab === 'active' && { backgroundColor: colors.accent }]} 
                onPress={() => setSelectedPoolTab('active')}
              >
                <Text style={[
                  styles.poolTabText, 
                  { color: colors.secondaryText },
                  selectedPoolTab === 'active' && { color: '#FFFFFF' }
                ]}>
                  Live Now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.poolTab, selectedPoolTab === 'completed' && { backgroundColor: colors.accent }]} 
                onPress={() => setSelectedPoolTab('completed')}
              >
                <Text style={[
                  styles.poolTabText, 
                  { color: colors.secondaryText },
                  selectedPoolTab === 'completed' && { color: '#FFFFFF' }
                ]}>
                  History
                </Text>
              </TouchableOpacity>
            </View>

            {/* Pools List */}
            <View style={styles.poolsContainer}>
              {filteredPools.length === 0 ? (
                <Card style={styles.emptyCard}>
                  <Ionicons name="search" size={48} color={colors.secondaryText} />
                  <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                    {searchQuery ? 'No pools found for your search.' : 'No pools available in this category.'}
                  </Text>
                </Card>
              ) : (
                filteredPools.map(pool => (
                  <PoolCard key={pool.id} pool={pool} onJoin={handleJoinPool} />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
      <AddMoneyModal visible={addMoneyVisible} onClose={() => setAddMoneyVisible(false)} />
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
    alignItems: 'flex-start',
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
  walletButton: {
    position: 'relative',
    padding: 12,
    borderRadius: 12,
  },
  addIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  mainTabs: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    padding: 4,
  },
  mainTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  mainTabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryButtonActive: {
    // backgroundColor will be set inline
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingRight: 20,
  },
  challengeCardContainer: {
    marginRight: 16,
    width: 280,
  },
  challengeCard: {
    borderWidth: 1,
    padding: 16,
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
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  challengeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeLimit: {
    fontSize: 12,
  },
  participantsContainer: {
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  participantsLabel: {
    fontSize: 10,
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
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  specialReward: {
    fontSize: 12,
    marginTop: 2,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  scheduleCard: {
    marginBottom: 16,
    padding: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scheduleDetails: {
    marginLeft: 32,
  },
  scheduleText: {
    fontSize: 14,
    marginBottom: 4,
  },
  poolTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  poolTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  poolTabActive: {
    // backgroundColor will be set inline
  },
  poolTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  poolTabTextActive: {
    fontWeight: '600',
  },
  poolsContainer: {
    marginBottom: 24,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
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
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
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
    marginLeft: 8,
  },
  countdownContainer: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  countdownTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  payoutInfo: {
    marginBottom: 12,
  },
  payoutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  payoutRank: {
    fontSize: 12,
  },
  payoutAmount: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  myItemCard: {
    marginBottom: 12,
    padding: 16,
  },
  myItemType: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  myItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  myItemDetail: {
    fontSize: 12,
    marginBottom: 4,
  },
}); 