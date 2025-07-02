import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

const leaderboardData = {
  Global: [
    { position: 1, name: 'Alice', steps: 50000 },
    { position: 2, name: 'Bob', steps: 48000 },
    { position: 3, name: 'Charlie', steps: 47000 },
    { position: 4, name: 'David', steps: 46000 },
    { position: 5, name: 'Eva', steps: 45000 },
  ],
  Country: [
    { position: 1, name: 'Alice', steps: 30000 },
    { position: 2, name: 'Frank', steps: 29000 },
    { position: 3, name: 'Grace', steps: 28000 },
    { position: 4, name: 'Hannah', steps: 27000 },
    { position: 5, name: 'Ivan', steps: 26000 },
  ],
  Friends: [
    { position: 1, name: 'You', steps: 20000 },
    { position: 2, name: 'Jack', steps: 18000 },
    { position: 3, name: 'Eva', steps: 17000 },
    { position: 4, name: 'Charlie', steps: 16000 },
    { position: 5, name: 'Bob', steps: 15000 },
  ],
};

const tabs = ['Global', 'Country', 'Friends'];

export const LeaderboardTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Global');
  const data = leaderboardData[activeTab];
  // User row for demo if not in top 5
  const userRow = { position: 1000, name: 'You', steps: 1234 };
  const userInTop = data.some(row => row.name === 'You');

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>#</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Steps</Text>
        </View>
        {data.map((row, idx) => (
          <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt, row.name === 'You' && styles.userRow]}> 
            <Text style={[styles.tableCell, row.name === 'You' && styles.userCell]}>{row.position}</Text>
            <Text style={[styles.tableCell, row.name === 'You' && styles.userCell]}>{row.name}</Text>
            <Text style={[styles.tableCell, row.name === 'You' && styles.userCell]}>{row.steps}</Text>
          </View>
        ))}
        {!userInTop && (
          <View style={[styles.tableRow, styles.userRow]}> 
            <Text style={[styles.tableCell, styles.userCell]}>{userRow.position}</Text>
            <Text style={[styles.tableCell, styles.userCell]}>{userRow.name}</Text>
            <Text style={[styles.tableCell, styles.userCell]}>{userRow.steps}</Text>
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
  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: Colors.backgroundGradient[1],
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: Colors.backgroundGradient[1],
  },
  activeTab: {
    backgroundColor: Colors.accent,
  },
  tabText: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeTabText: {
    color: Colors.cardBackground,
  },
  tableContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    marginTop: 8,
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
  totalSteps: {
    color: Colors.gold,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    textAlign: 'center',
  },
});

export default LeaderboardTabs; 