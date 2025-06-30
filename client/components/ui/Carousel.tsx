import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, ViewStyle } from 'react-native';

interface CarouselCard {
  key: string;
  content: React.ReactNode;
  image?: any;
  icon?: string;
  gradient?: string[];
}

interface CarouselProps {
  data: CarouselCard[];
  cardWidthPercent?: number; // e.g., 0.88
  cardHeight?: number;
  autoScrollInterval?: number;
  renderCard: (card: CarouselCard) => React.ReactNode;
  style?: ViewStyle;
  autoScroll?: boolean;
  gap?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  data,
  cardWidthPercent = 1,
  cardHeight = 180,
  autoScrollInterval = 3000,
  renderCard,
  style,
  autoScroll = true,
  gap = 16,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [cardWidth, setCardWidth] = useState(() => {
    const screenWidth = Dimensions.get('window').width;
    return screenWidth * cardWidthPercent;
  });
  const [sideMargin, setSideMargin] = useState(() => {
    const screenWidth = Dimensions.get('window').width;
    return (screenWidth - screenWidth * cardWidthPercent) / 2;
  });

  useEffect(() => {
    const onChange = ({ window }: { window: { width: number } }) => {
      const newCardWidth = window.width * cardWidthPercent;
      setCardWidth(newCardWidth);
      setSideMargin((window.width - newCardWidth) / 2);
    };
    const sub = Dimensions.addEventListener('change', onChange);
    return () => {
      if (typeof sub?.remove === 'function') sub.remove();
    };
  }, [cardWidthPercent]);

  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => {
      let nextIndex = activeIndexRef.current + 1;
      if (nextIndex >= data.length) nextIndex = 0;
      scrollRef.current?.scrollTo({
        x: nextIndex * (cardWidth + gap),
        animated: true,
      });
      setActiveIndex(nextIndex);
      activeIndexRef.current = nextIndex;
    }, autoScrollInterval);
    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval, cardWidth, gap, data.length]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <View style={[styles.carouselContainer, style]}> 
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + gap}
        decelerationRate="fast"
        onMomentumScrollEnd={e => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / (cardWidth + gap)
          );
          setActiveIndex(Math.max(0, Math.min(index, data.length - 1)));
          activeIndexRef.current = Math.max(0, Math.min(index, data.length - 1));
        }}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{
          paddingHorizontal: sideMargin,
        }}
      >
        {data.map((card, idx) => (
          <View
            key={card.key}
            style={{
              width: cardWidth,
              height: cardHeight,
              marginRight: idx !== data.length - 1 ? gap : 0,
            }}
          >
            {renderCard(card)}
          </View>
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {data.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.indicatorDot,
              idx === activeIndex && styles.indicatorDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 16,
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
}); 