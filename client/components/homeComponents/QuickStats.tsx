import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const stats = {
  steps: 7890,
  calories: 320,
  distance: 5.2,
  rank: 'top 30%',
  toNext: 2000,
};

export const QuickStats: React.FC = () => (
  <GlassCard style={styles.card}>
    <View style={styles.row}>
      <View style={styles.statItem}>
        <Ionicons name="walk" size={24} color="#ff6b35" />
        <Text style={styles.statValue}>{stats.steps}</Text>
        <Text style={styles.statLabel}>Steps</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="flame" size={24} color="#ff6b35" />
        <Text style={styles.statValue}>{stats.calories}</Text>
        <Text style={styles.statLabel}>Calories</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="locate" size={24} color="#ff6b35" />
        <Text style={styles.statValue}>{stats.distance}</Text>
        <Text style={styles.statLabel}>Km</Text>
      </View>
    </View>
    <Text style={styles.rankText}>
      You're in the <Text style={styles.rankHighlight}>{stats.rank}</Text> of your pool! Walk <Text style={styles.rankHighlight}>{stats.toNext} steps</Text> to reach the top 50%.
    </Text>
  </GlassCard>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 2,
  },
  statLabel: {
    color: Colors.accent,
    fontSize: 13,
    marginTop: 1,
  },
  rankText: {
    color: Colors.primaryText,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 2,
  },
  rankHighlight: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
}); 