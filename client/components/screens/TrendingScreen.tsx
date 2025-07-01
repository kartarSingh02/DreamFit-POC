import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import { Carousel } from '../ui/Carousel';
import { GlassCard } from '../ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { ScreenContainer } from '../layout/ScreenContainer';
import { useNavigation } from '@react-navigation/native';

const trendingCards = [
  {
    key: 'marathon',
    content: (
      <>
        <Text variant="h3" weight="bold" style={{ color: Colors.primaryText, marginBottom: 6 }}>
          Weekend Marathon
        </Text>
        <Text variant="body" style={{ color: Colors.primaryText }}>
          Join the 10K step challenge this weekend and win exciting rewards!
        </Text>
      </>
    ),
    image: require('../../assets/images/splash-icon.png'),
  },
  {
    key: 'new-challenge',
    content: (
      <>
        <Text variant="h3" weight="bold" style={{ color: Colors.primaryText, marginBottom: 6 }}>
          Yoga Flex Challenge
        </Text>
        <Text variant="body" style={{ color: Colors.primaryText }}>
          Try our new yoga challenge and improve your flexibility.
        </Text>
      </>
    ),
    image: require('../../assets/images/partial-react-logo.png'),
  },
  {
    key: 'prizes',
    content: (
      <>
        <Text variant="h3" weight="bold" style={{ color: Colors.primaryText, marginBottom: 6 }}>
          Prizes & Vouchers
        </Text>
        <Text variant="body" style={{ color: Colors.primaryText }}>
          Participate in trending challenges and win Amazon vouchers!
        </Text>
      </>
    ),
    icon: 'gift',
  },
];

// Add a constant for challenge time slots
const TIME_RANGES = [
  { label: 'Morning', start: '05:00', end: '09:00' },
  { label: 'Evening', start: '18:00', end: '22:00' },
];

// Dummy challenge data (should be moved to a constants file in a real app)
const CHALLENGES = [
  { id: 1, date: '2024-06-10', time: '05:10', description: 'Pool 1: Early riser challenge' },
  { id: 2, date: '2024-06-10', time: '06:20', description: 'Pool 2: Sunrise steps' },
  { id: 3, date: '2024-06-10', time: '18:10', description: 'Pool 3: Evening energy' },
  { id: 4, date: '2024-06-11', time: '05:30', description: 'Pool 4: Morning boost' },
  { id: 5, date: '2024-06-11', time: '19:00', description: 'Pool 5: Night owl steps' },
];

// 10 pool data
const POOLS = [
  { time: '5:00 am - 5:10 am', description: 'Start your day strong! Join the early risers.' },
  { time: '5:10 am - 5:20 am', description: 'Keep the momentum going, every step counts.' },
  { time: '5:20 am - 5:30 am', description: 'Push your limits, you are unstoppable.' },
  { time: '5:30 am - 5:40 am', description: 'Consistency is the key to success.' },
  { time: '5:40 am - 5:50 am', description: 'Rise and shine, let\'s get moving!' },
  { time: '5:50 am - 6:00 am', description: 'A new day, a new challenge.' },
  { time: '6:00 pm - 6:10 pm', description: 'Evening energy boost, let\'s go!' },
  { time: '6:10 pm - 6:20 pm', description: 'Finish strong, you\'re almost there.' },
  { time: '6:20 pm - 6:30 pm', description: 'Every step brings you closer to your goal.' },
  { time: '6:30 pm - 6:40 pm', description: 'Celebrate your progress, keep moving!' },
];

type PoolCardProps = {
  time: string;
  description: string;
};
const PoolCard = ({ time, description }: PoolCardProps) => (
  <View style={{
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 24,
    marginBottom: 14,
    flexDirection: 'column',
    minWidth: 0,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    shadowColor: Colors.shadowColor,
    shadowOffset: Colors.shadowOffset,
    shadowOpacity: Colors.shadowOpacity,
    shadowRadius: Colors.shadowRadius,
    elevation: Colors.elevation,
  }}>
    <Text variant="caption" color="accent" style={{ fontWeight: 'bold', marginBottom: 8 }}>{time}</Text>
    <Text variant="body" style={{ color: Colors.primaryText }}>{description}</Text>
  </View>
);

export const TrendingScreen: React.FC = () => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeRangeModalVisible, setTimeRangeModalVisible] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<typeof TIME_RANGES[0] | null>(null);
  const navigation = useNavigation();

  // Show pools only if both date and time range are selected
  const filteredPools = selectedTimeRange
    ? POOLS.filter(pool => {
        // Parse pool start time
        const poolStart = pool.time.split(' - ')[0];
        // Check if pool is in selected time range
        return (
          poolStart >= selectedTimeRange.start && poolStart < selectedTimeRange.end
        );
      })
    : POOLS;

  // Format selected date for display
  const formattedDate = selectedDate ? selectedDate.toLocaleDateString() : 'Select Date';

  return (
    <ScreenContainer>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text variant="h2" weight="bold" style={styles.title}>
          Trending
        </Text>
        <TouchableOpacity onPress={() => (navigation as any).navigate('Wallet')} style={{ padding: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="wallet" size={28} color={Colors.primaryText} />
            <Ionicons name="add" size={18} color={Colors.primaryText} style={{ marginLeft: -10, marginTop: -8 }} />
          </View>
        </TouchableOpacity>
      </View>
      <Text variant="body" color="secondary" style={{ color: Colors.secondaryText, marginBottom: 16 }}>
        Hot workouts and challenges
      </Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Carousel
          data={trendingCards}
          cardHeight={160}
          autoScroll={true}
          cardWidthPercent={0.88}
          gap={16}
          renderCard={card => (
            <GlassCard style={{ height: 160, padding: 0 }}>
              <View style={styles.cardContentRow}>
                <View style={{ flex: 1 }}>{card.content}</View>
                {card.image && (
                  <Image source={card.image} style={styles.cardImage} resizeMode="contain" />
                )}
                {card.icon && (
                  <Ionicons name={card.icon as any} size={54} color={Colors.accent} style={{ marginLeft: 10, opacity: 0.9 }} />
                )}
              </View>
            </GlassCard>
          )}
        />
        {/* More Challenges heading with calendar icon */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 8 }}>
          <Text variant="h2" weight="bold">More Challenges</Text>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <Ionicons name="calendar" size={28} color={Colors.primaryText} />
          </TouchableOpacity>
        </View>
        {/* Show selected date and time range, and button to pick time range if date is picked */}
        {selectedDate && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text variant="body" style={{ marginRight: 12 }}>{formattedDate}</Text>
            <TouchableOpacity onPress={() => setTimeRangeModalVisible(true)} style={{ backgroundColor: Colors.accent, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text variant="body" style={{ color: Colors.primaryText }}>{selectedTimeRange ? selectedTimeRange.label : 'Select Time Range'}</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Time Range Modal */}
        {timeRangeModalVisible && (
          <Modal
            visible={timeRangeModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setTimeRangeModalVisible(false)}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: Colors.cardBackground, borderRadius: 12, padding: 24, minWidth: 220 }}>
                <Text variant="h3" style={{ marginBottom: 12, color: Colors.primaryText }}>Select Time Range</Text>
                {TIME_RANGES.map(range => (
                  <TouchableOpacity
                    key={range.label}
                    onPress={() => {
                      setSelectedTimeRange(range);
                      setTimeRangeModalVisible(false);
                    }}
                    style={{ marginBottom: 10 }}
                  >
                    <Text variant="body" style={{ color: Colors.primaryText }}>{range.label}: {range.start} - {range.end}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setTimeRangeModalVisible(false)} style={{ marginTop: 18 }}>
                  <Text variant="body" color="accent">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
        {/* List of pools (filtered by time range if selected) */}
        {filteredPools.map((pool, idx) => (
          <PoolCard key={idx} time={pool.time} description={pool.description} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 32,
    // backgroundColor: Colors.cardBackground, // removed for gradient
  },
  title: {
    color: Colors.primaryText,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  cardImage: {
    width: 60,
    height: 60,
    marginLeft: 16,
    borderRadius: 30,
    backgroundColor: Colors.backgroundGradient[1],
  },
}); 