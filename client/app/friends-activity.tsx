import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../components/ui/Text';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { useTheme } from '../contexts/ThemeContext';

const FriendsActivityScreen: React.FC = () => {
  const { colors } = useTheme();
  
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={[styles.header, { color: colors.primaryText }]}>Friends Activity</Text>
        <Text style={[styles.placeholder, { color: colors.secondaryText }]}>All your friends' activities will appear here.</Text>
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
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FriendsActivityScreen; 