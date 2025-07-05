import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../components/ui/Text';
import { ScreenContainer } from '../components/layout/ScreenContainer';

const FriendsActivityScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.header}>Friends Activity</Text>
        <Text style={styles.placeholder}>All your friends' activities will appear here.</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  placeholder: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FriendsActivityScreen; 