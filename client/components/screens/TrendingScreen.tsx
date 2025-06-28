import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';

export const TrendingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text variant="h2" weight="bold" style={styles.title}>
        Trending
      </Text>
      <Text variant="body" color="secondary">
        Hot workouts and challenges
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
  },
}); 