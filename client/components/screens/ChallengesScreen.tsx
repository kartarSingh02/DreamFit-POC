import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';

export const ChallengesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text variant="h2" weight="bold" style={styles.title}>
        Challenges
      </Text>
      <Text variant="body" color="secondary">
        Complete challenges and earn rewards
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