import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text } from '../ui/Text';
import { Carousel } from '../ui/Carousel';
import { GlassCard } from '../ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { ScreenContainer } from '../layout/ScreenContainer';

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

export const TrendingScreen: React.FC = () => {
  return (
    <ScreenContainer>
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
        <Text variant="h2" weight="bold" style={styles.title}>
          Trending
        </Text>
        <Text variant="body" color="secondary" style={{ color: Colors.secondaryText }}>
          Hot workouts and challenges
        </Text>
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
    marginBottom: 16,
    marginTop: 16,
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