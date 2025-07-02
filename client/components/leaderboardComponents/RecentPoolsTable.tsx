import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

// Hardcoded recent pools data
const recentPools = [
  { position: 1, name: 'Alice', steps: 12000, date: '2024-06-10', time: '05:10' },
  { position: 2, name: 'Bob', steps: 11500, date: '2024-06-10', time: '05:20' },
  { position: 3, name: 'Charlie', steps: 11000, date: '2024-06-10', time: '05:30' },
  { position: 4, name: 'David', steps: 10800, date: '2024-06-10', time: '05:40' },
  { position: 5, name: 'Eva', steps: 10500, date: '2024-06-10', time: '05:50' },
  { position: 6, name: 'Frank', steps: 10200, date: '2024-06-10', time: '06:00' },
  { position: 7, name: 'Grace', steps: 10000, date: '2024-06-10', time: '06:10' },
  { position: 8, name: 'Hannah', steps: 9800, date: '2024-06-10', time: '06:20' },
  { position: 9, name: 'Ivan', steps: 9500, date: '2024-06-10', time: '06:30' },
  { position: 10, name: 'Jack', steps: 9000, date: '2024-06-10', time: '06:40' },
];

// Example: user's rank is 1000
const userRank = 1000;
const userPool = { position: userRank, name: 'You', steps: 1000, date: '2024-06-10', time: '07:00' };

// Mock pool leaderboard data (could be different per pool, but same for now)
const poolLeaderboards = {
  '2024-06-10_05:10': [
    { position: 1, name: 'Alice', steps: 12000 },
    { position: 2, name: 'Bob', steps: 11500 },
    { position: 3, name: 'Charlie', steps: 11000 },
    { position: 4, name: 'David', steps: 10800 },
    { position: 5, name: 'Eva', steps: 10500 },
    { position: 6, name: 'Frank', steps: 10200 },
    { position: 7, name: 'Grace', steps: 10000 },
    { position: 8, name: 'Hannah', steps: 9800 },
    { position: 9, name: 'Ivan', steps: 9500 },
    { position: 10, name: 'Jack', steps: 9000 },
  ],
  // Add more keys for other pools if needed
};

export const RecentPoolsTable: React.FC = () => {
  // Default to first pool in lastFive
  const lastFive = recentPools.slice(-5);
  const [selectedPool, setSelectedPool] = useState(lastFive[0]);

  // Get leaderboard for selected pool
  const leaderboardKey = `${selectedPool.date}_${selectedPool.time}`;
  const leaderboard = poolLeaderboards[leaderboardKey] || poolLeaderboards['2024-06-10_05:10'];

  // Always show user's row at the end if not in top 10
  const userInTop = leaderboard.some(row => row.name === 'You');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Recent Pools</Text>
      {/* Carousel for last 5 pools */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
        {lastFive.map((pool, idx) => {
          const isSelected = pool === selectedPool;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.carouselCard, isSelected && styles.selectedCarouselCard]}
              onPress={() => setSelectedPool(pool)}
            >
              <Text style={styles.carouselDate}>{pool.date}</Text>
              <Text style={styles.carouselTime}>{pool.time}</Text>
              <Text style={styles.carouselSteps}>{pool.steps} steps</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {/* Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>#</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Steps</Text>
        </View>
        {leaderboard.map((row, idx) => (
          <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt, row.name === 'You' && styles.userRow]}> 
            <Text style={[styles.tableCell, row.name === 'You' && styles.userCell]}>{row.position}</Text>
            <Text style={[styles.tableCell, row.name === 'You' && styles.userCell]}>{row.name}</Text>
            <Text style={[styles.tableCell, row.name === 'You' && styles.userCell]}>{row.steps}</Text>
          </View>
        ))}
        {!userInTop && (
          <View style={[styles.tableRow, styles.userRow]}> 
            <Text style={[styles.tableCell, styles.userCell]}>{userPool.position}</Text>
            <Text style={[styles.tableCell, styles.userCell]}>{userPool.name}</Text>
            <Text style={[styles.tableCell, styles.userCell]}>{userPool.steps}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: Colors.shadowOffset,
    shadowOpacity: Colors.shadowOpacity,
    shadowRadius: Colors.shadowRadius,
    elevation: Colors.elevation,
  },
  heading: {
    color: Colors.primaryText,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  carousel: {
    marginBottom: 12,
  },
  carouselCard: {
    backgroundColor: Colors.backgroundGradient[1],
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  carouselDate: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 13,
  },
  carouselTime: {
    color: Colors.primaryText,
    fontSize: 12,
    marginBottom: 2,
  },
  carouselSteps: {
    color: Colors.gold,
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundGradient[1],
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableHeaderText: {
    flex: 1,
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: Colors.cardBackground,
  },
  tableRowAlt: {
    backgroundColor: Colors.backgroundGradient[1],
  },
  tableCell: {
    flex: 1,
    color: Colors.primaryText,
    fontSize: 13,
    textAlign: 'center',
  },
  userRow: {
    backgroundColor: Colors.gold,
  },
  userCell: {
    color: Colors.cardBackground,
    fontWeight: 'bold',
  },
  selectedCarouselCard: {
    borderWidth: 2,
    borderColor: Colors.accent,
  },
});

export default RecentPoolsTable; 