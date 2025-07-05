import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { ScreenContainer } from '../layout/ScreenContainer';
import { AddMoneyModal } from '../ui/AddMoneyModal';
import { useStepCounter } from '../StepCounterContext';

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
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FFD700';
      default: return Colors.accent;
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
    <Card style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeIcon}>
          <Text style={styles.challengeIconText}>{getTypeIcon(challenge.type)}</Text>
        </View>
        <View style={styles.challengeInfo}>
          <Text style={styles.challengeName}>{challenge.name}</Text>
          {challenge.description && (
            <Text style={styles.challengeDescription}>{challenge.description}</Text>
          )}
          <View style={styles.challengeMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
              <Text style={styles.difficultyText}>{challenge.difficulty.toUpperCase()}</Text>
            </View>
            <Text style={styles.timeLimit}>{challenge.timeLimit}</Text>
          </View>
        </View>
        <View style={styles.participantsContainer}>
          <Text style={styles.participantsText}>{challenge.participants}</Text>
          <Text style={styles.participantsLabel}>participants</Text>
        </View>
      </View>
      
      <View style={styles.challengeFooter}>
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardLabel}>Reward:</Text>
          <Text style={styles.rewardText}>{challenge.reward}</Text>
          {challenge.specialReward && (
            <Text style={styles.specialReward}>{challenge.specialReward}</Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={() => onJoin(challenge)}
        >
          <Text style={styles.joinButtonText}>Join</Text>
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

      {pool.status === 'upcoming' && (
        <TouchableOpacity style={styles.joinButton} onPress={() => onJoin(pool)}>
          <Text style={styles.joinButtonText}>Join Pool</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

const MyParticipationTab: React.FC<{ myJoinedPools: any[]; myJoinedChallenges: any[]; styles: any; }> = ({ myJoinedPools, myJoinedChallenges, styles }) => (
  <View style={styles.myParticipationContainer}>
    <Text style={styles.sectionTitle}>My Joined Pools & Challenges</Text>
    {myJoinedPools.length === 0 && myJoinedChallenges.length === 0 ? (
      <Card style={styles.emptyCard}>
        <Ionicons name="star-outline" size={48} color={Colors.secondaryText} />
        <Text style={styles.emptyText}>You haven't joined any pools or challenges yet.</Text>
      </Card>
    ) : (
      <>
        {myJoinedPools.map(pool => (
          <Card key={`pool-${pool.id}`} style={styles.myItemCard}>
            <Text style={styles.myItemType}>🚶 Walking Pool</Text>
            <Text style={styles.myItemName}>{pool.name}</Text>
            <Text style={styles.myItemDetail}>Time: {pool.timeSlot}</Text>
            <Text style={styles.myItemDetail}>Entry Fee: ₹{pool.entryFee}</Text>
            <Text style={styles.myItemDetail}>Status: {pool.status === 'active' ? 'Live' : pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}</Text>
          </Card>
        ))}
        {myJoinedChallenges.map(challenge => (
          <Card key={`challenge-${challenge.id}`} style={styles.myItemCard}>
            <Text style={styles.myItemType}>🏆 Challenge</Text>
            <Text style={styles.myItemName}>{challenge.name}</Text>
            <Text style={styles.myItemDetail}>Reward: {challenge.reward}</Text>
            <Text style={styles.myItemDetail}>Difficulty: {challenge.difficulty}</Text>
          </Card>
        ))}
      </>
    )}
  </View>
);

export const ChallengesAndPoolsScreen: React.FC = () => {
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
            <Text style={styles.title}>Challenges</Text>
            <Text style={styles.subtitle}>Join walking pools and challenges to win rewards!</Text>
          </View>
          <TouchableOpacity onPress={() => setAddMoneyVisible(true)} style={styles.walletButton}>
            <Ionicons name="wallet" size={24} color={Colors.primaryText} />
            <Ionicons name="add" size={16} color={Colors.primaryText} style={styles.addIcon} />
          </TouchableOpacity>
        </View>

        {/* Main Tabs */}
        <View style={styles.mainTabs}>
          <TouchableOpacity 
            style={[styles.mainTab, activeTab === 'pools' && styles.mainTabActive]} 
            onPress={() => setActiveTab('pools')}
          >
            <Text style={[styles.mainTabText, activeTab === 'pools' && styles.mainTabTextActive]}>
              🚶 Walking Pools
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.mainTab, activeTab === 'challenges' && styles.mainTabActive]} 
            onPress={() => setActiveTab('challenges')}
          >
            <Text style={[styles.mainTabText, activeTab === 'challenges' && styles.mainTabTextActive]}>
              🏆 Challenges
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.mainTab, activeTab === 'my' && styles.mainTabActive]} 
            onPress={() => setActiveTab('my')}
          >
            <Text style={[styles.mainTabText, activeTab === 'my' && styles.mainTabTextActive]}>
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
                      selectedCategory === category.id && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.categoryTextActive
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
              </View>
            </Card>

            {/* Pool Tabs */}
            <View style={styles.poolTabs}>
              <TouchableOpacity 
                style={[styles.poolTab, selectedPoolTab === 'upcoming' && styles.poolTabActive]} 
                onPress={() => setSelectedPoolTab('upcoming')}
              >
                <Text style={[styles.poolTabText, selectedPoolTab === 'upcoming' && styles.poolTabTextActive]}>
                  Upcoming ({upcomingPools.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.poolTab, selectedPoolTab === 'active' && styles.poolTabActive]} 
                onPress={() => setSelectedPoolTab('active')}
              >
                <Text style={[styles.poolTabText, selectedPoolTab === 'active' && styles.poolTabTextActive]}>
                  Live Now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.poolTab, selectedPoolTab === 'completed' && styles.poolTabActive]} 
                onPress={() => setSelectedPoolTab('completed')}
              >
                <Text style={[styles.poolTabText, selectedPoolTab === 'completed' && styles.poolTabTextActive]}>
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
    color: Colors.primaryText,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  walletButton: {
    position: 'relative',
    backgroundColor: Colors.accent,
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
    backgroundColor: Colors.cardBackground,
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
  mainTabActive: {
    backgroundColor: Colors.accent,
  },
  mainTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  mainTabTextActive: {
    color: Colors.primaryText,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: Colors.accent,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
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
    borderColor: Colors.borderColor,
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
    backgroundColor: Colors.accent,
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
    color: Colors.primaryText,
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 12,
    color: Colors.secondaryText,
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
    color: Colors.primaryText,
  },
  timeLimit: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  participantsContainer: {
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  participantsLabel: {
    fontSize: 10,
    color: Colors.secondaryText,
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
    color: Colors.secondaryText,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.gold,
  },
  specialReward: {
    fontSize: 12,
    color: Colors.accent,
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: Colors.primaryText,
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
    color: Colors.primaryText,
    marginLeft: 8,
  },
  scheduleDetails: {
    marginLeft: 32,
  },
  scheduleText: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  poolTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: Colors.cardBackground,
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
    backgroundColor: Colors.accent,
  },
  poolTabText: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  poolTabTextActive: {
    color: Colors.primaryText,
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
    color: Colors.secondaryText,
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
    color: Colors.primaryText,
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
    padding: 8,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  payoutInfo: {
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
    color: Colors.gold,
  },
  myItemCard: {
    marginBottom: 12,
    padding: 16,
  },
  myItemType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  myItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  myItemDetail: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
}); 