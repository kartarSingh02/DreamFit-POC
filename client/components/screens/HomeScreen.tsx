import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Text } from '../ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../ui/GlassCard';
import { StepBarGraph } from '../ui/StepBarGraph';
import { Ionicons } from '@expo/vector-icons';
import { ActivePools } from '../homeComponents/ActivePools';
import { QuickStats } from '../homeComponents/QuickStats';
import { TrendingChallengesPreview } from '../homeComponents/TrendingChallengesPreview';
import { MotivationalBanner } from '../homeComponents/MotivationalBanner';
import { HeartbeatLineChart } from '../homeComponents/HeartbeatLineChart';

const stats = {
  calories: 1234,
  steps: 7890,
  distance: 6.2, // in km
  winnings: 5,
  matches: 12,
  winPercent: 80,
  totalMatches: 1180,
};

const user = {
  name: 'Alex Johnson',
  imageUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.88;
const CARD_SPACING = 16;
const SIDE_MARGIN = (SCREEN_WIDTH - CARD_WIDTH) / 2;

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 0,
  },
  carousel: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 16,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 22,
    padding: 28,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  cardTitle: {
    marginBottom: 3,
  },
  cardNumber: {
    marginBottom: 10,
    fontSize: 36,
  },
  cardStat: {
    marginBottom: 4,
  },
  cardImage: {
    width: 80,
    height: 80,
    marginLeft: 16,
    borderRadius: 40,
    backgroundColor: '#18181b',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5, 
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  indicatorDotActive: {
    opacity: 1,
    backgroundColor: '#ff6b35',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: 18,
  },
  helloText: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 0,
  },
  profilePhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#ff6b35',
    backgroundColor: '#23272f',
  },
});

const cardData = [
  {
    key: 'calories',
    gradient: ['#ff9966', '#ff5e62'], // orange to red
    content: (
      <>
        <Text variant="h3" weight="bold" style={[styles.cardTitle, { color: '#fff' }]}>
          Total Calories Burnt
        </Text>
        <Text variant="h1" weight="bold" style={[styles.cardNumber, { color: '#ff6b35', marginBottom: 4 }]}>
          {stats.calories} kcal
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
          <Text variant="body" style={{ color: '#fff', fontSize: 14 }}>
            Steps: 
          </Text>
          <Text variant="body" weight="semibold" style={{ color: '#ff6b35', fontSize: 15, marginLeft: 2 }}>
            {stats.steps}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text variant="body" style={{ color: '#fff', fontSize: 14 }}>
            Distance: 
          </Text>
          <Text variant="body" weight="semibold" style={{ color: '#ff6b35', fontSize: 15, marginLeft: 2 }}>
            {stats.distance} km
          </Text>
        </View>
      </>
    ),
    image: require('../../assets/images/partial-react-logo.png'), // Replace with person image
  },
  {
    key: 'winnings',
    gradient: ['#ff9966', '#ff5e62'], // orange to red (same as first card)
    content: (
      <>
        <Text variant="h3" weight="bold" style={[styles.cardTitle, { color: '#fff' }]}>
          Total Winnings
        </Text>
        <Text variant="h1" weight="bold" style={[styles.cardNumber, { color: '#ff6b35', marginBottom: 4 }]}>
          {stats.winnings}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
          <Text variant="body" style={{ color: '#fff', fontSize: 14 }}>
            Total Matches: 
          </Text>
          <Text variant="body" weight="semibold" style={{ color: '#ff6b35', fontSize: 15, marginLeft: 2 }}>
            {stats.matches}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text variant="body" style={{ color: '#fff', fontSize: 14 }}>
            Win %: 
          </Text>
          <Text variant="body" weight="semibold" style={{ color: '#ff6b35', fontSize: 15, marginLeft: 2 }}>
            {stats.winPercent}%
          </Text>
        </View>
      </>
    ),
    image: require('../../assets/images/adaptive-icon.png'), // Replace with trophy image
  },
  {
    key: 'wallet',
    gradient: ['#ff9966', '#ff5e62'], // orange to red
    content: (
      <>
        <Text variant="h3" weight="bold" style={[styles.cardTitle, { color: '#fff' }]}>
          Wallet Balance
        </Text>
        <Text variant="h1" weight="bold" style={[styles.cardNumber, { color: '#ff6b35', marginBottom: 4 }]}>
          ₹1,500
        </Text>
        <Text variant="body" style={{ color: '#fff', fontSize: 14, marginTop: 2 }}>
          Add money to your wallet to join more challenges!
        </Text>
      </>
    ),
    icon: 'wallet', // Ionicons wallet icon
  },
];

export const HomeScreen: React.FC = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % cardData.length;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * (CARD_WIDTH + CARD_SPACING),
        animated: true,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <LinearGradient
      colors={['#18181b', '#23272f']}
      style={styles.gradientBg}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text variant="h2" weight="bold" style={[styles.helloText, { marginLeft: 0 }]}>
            Hello, {user.name}
          </Text>
          <Image
            source={{ uri: user.imageUri }}
            style={styles.profilePhoto}
            resizeMode="cover"
          />
        </View>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 0, paddingRight: 0 }}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          onMomentumScrollEnd={e => {
            const index = Math.round(
              (e.nativeEvent.contentOffset.x - SIDE_MARGIN) / (CARD_WIDTH + CARD_SPACING)
            );
            setActiveIndex(index);
          }}
          style={{ flexGrow: 0 }}
          contentOffset={{ x: 0, y: 0 }}
        >
          <View style={{ width: SIDE_MARGIN }} />
          {cardData.map((card, idx) => (
            <View key={card.key} style={{ width: CARD_WIDTH, marginRight: idx === cardData.length - 1 ? 0 : CARD_SPACING }}>
              <GlassCard style={{ height: 180, padding: 0 }}>
                <View style={styles.cardContentRow}>
                  <View style={{ flex: 1 }}>{card.content}</View>
                  {card.image && (
                    <Image
                      source={card.image}
                      style={styles.cardImage}
                      resizeMode="contain"
                    />
                  )}
                  {card.icon && (
                    <Ionicons name={card.icon as any} size={54} color="#fff" style={{ marginLeft: 10, opacity: 0.9 }} />
                  )}
                </View>
              </GlassCard>
            </View>
          ))}
          <View style={{ width: SIDE_MARGIN }} />
        </ScrollView>
        {/* Carousel Indicator */}
        <View style={styles.indicatorContainer}>
          {cardData.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.indicatorDot,
                idx === activeIndex && styles.indicatorDotActive,
              ]}
            />
          ))}
        </View>
        <View style={{ marginBottom: 16 }}><MotivationalBanner /></View>
        <View style={{ marginBottom: 16 }}><StepBarGraph /></View>
        <View style={{ marginBottom: 16 }}><HeartbeatLineChart /></View>
        <View style={{ marginBottom: 16 }}><ActivePools /></View>
        <View style={{ marginBottom: 16 }}><TrendingChallengesPreview /></View>
      </ScrollView>
    </LinearGradient>
  );
}; 