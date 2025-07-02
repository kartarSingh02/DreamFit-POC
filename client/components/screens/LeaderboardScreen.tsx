import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { RecentPoolsTable } from '../leaderboardComponents/RecentPoolsTable';
import { LeaderboardTabs } from '../leaderboardComponents/LeaderboardTabs';
import Colors from '../../constants/Colors';
import { Text } from '../ui/Text';

export const LeaderboardScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text variant="h2" weight="bold" style={styles.title}>
          Leaderboard
        </Text>
      </View>
      <Text variant="body" color="secondary" style={styles.subtitle}>
        Compete with other fitness enthusiasts
      </Text>
      <RecentPoolsTable />
      <Text variant="h2" weight="bold" style={styles.sectionHeading}>
        Global Leaderboard
      </Text>
      <LeaderboardTabs />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    // backgroundColor: Colors.backgroundGradient[0],
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    color: Colors.primaryText,
    marginBottom: 0,
  },
  subtitle: {
    color: Colors.secondaryText,
  },
  sectionHeading: {
    color: Colors.primaryText,
    marginBottom: 0,
  },
}); 