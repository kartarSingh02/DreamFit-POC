import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';

export const LeaderboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text variant="h2" weight="bold" style={styles.title}>
        Leaderboard
      </Text>
      <Text variant="body" color="secondary">
        Compete with other fitness enthusiasts
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