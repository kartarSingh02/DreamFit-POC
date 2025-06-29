import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

interface ChallengeJoinModalProps {
  visible: boolean;
  onClose: () => void;
  time: string;
  description: string;
  totalUsers: number;
  entryFee: number;
  image: any;
  onRegister: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const ChallengeJoinModal: React.FC<ChallengeJoinModalProps> = ({
  visible,
  onClose,
  time,
  description,
  totalUsers,
  entryFee,
  image,
  onRegister,
}) => {
  const totalWinnings = Math.round(totalUsers * entryFee * 0.10);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.floatingCard}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.timeText}>{time}</Text>
                <View style={{ width: 28 }} /> {/* Placeholder for alignment */}
              </View>
              {/* Register Button */}
              <TouchableOpacity style={styles.registerButton} onPress={onRegister}>
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
              {/* Description */}
              <Text style={styles.description}>{description}</Text>
              {/* Total Winnings */}
              <Text style={styles.winningsText}>
                Total Winnings: <Text style={styles.winningsAmount}>₹{totalWinnings}</Text>
              </Text>
              {/* Image */}
              <Image source={image} style={styles.challengeImage} resizeMode="contain" />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingCard: {
    width: '90%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    marginTop: 32,
    // Position the card above the navbar
    maxHeight: SCREEN_HEIGHT * 0.8,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  registerButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  description: {
    fontSize: 15,
    color: Colors.secondaryText,
    marginVertical: 10,
    textAlign: 'center',
  },
  winningsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  winningsAmount: {
    fontSize: 22,
    color: Colors.accent,
    fontWeight: 'bold',
  },
  challengeImage: {
    width: '100%',
    height: 120,
    marginTop: 16,
    borderRadius: 10,
  },
}); 