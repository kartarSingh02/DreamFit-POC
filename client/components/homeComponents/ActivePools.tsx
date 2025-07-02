import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../ui/GlassCard';
import Colors from '../../constants/Colors';

const pools = [
  {
    id: 1,
    time: '7:00pm - 8:00pm',
    entry: 50,
    prize: 500,
    status: 'upcoming',
  },
  {
    id: 2,
    time: '5:00pm - 6:00pm',
    entry: 100,
    prize: 1000,
    status: 'registered',
  },
];

export const ActivePools: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.heading}>Upcoming Pools</Text>
    {pools.map((pool) => (
      <GlassCard key={pool.id} style={styles.poolCard}>
        <View style={styles.row}>
          <Ionicons name="walk" size={32} color="#ff6b35" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.time}>{pool.time}</Text>
            <Text style={styles.detail}>Entry: ₹{pool.entry} | Prize: ₹{pool.prize}</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{pool.status === 'registered' ? 'View' : 'Join'}</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  heading: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 4,
  },
  poolCard: {
    marginBottom: 12,
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  time: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  detail: {
    color: Colors.accent,
    fontSize: 13,
    marginBottom: 2,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  buttonText: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 