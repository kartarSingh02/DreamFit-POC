import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text variant="h2" weight="bold" style={styles.title}>
        Home
      </Text>
      <Text variant="body" color="secondary">
        Welcome to DreamFit - Your Fitness Fantasy
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