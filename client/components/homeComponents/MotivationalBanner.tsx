import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

export const MotivationalBanner: React.FC = () => (
  <View style={styles.banner}>
    <Ionicons name="bulb" size={22} color="#fff" style={{ marginRight: 8 }} />
    <Text style={styles.text}>
      <Text style={styles.bold}>Tip:</Text> Stay hydrated! Invite friends to earn bonus cash. Take the stairs!
    </Text>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 16,
    // marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  text: {
    color: Colors.primaryText,
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
}); 