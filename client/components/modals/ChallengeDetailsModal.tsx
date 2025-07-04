import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import Colors from '../../constants/Colors';

interface ChallengeDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  challenge: {
    id: string;
    name: string;
    description: string;
    participants: number;
    timeLeft: number;
    reward: string;
    type: string;
    target: string;
    currentProgress: number;
    maxProgress: number;
  };
}

export const ChallengeDetailsModal: React.FC<ChallengeDetailsModalProps> = ({
  visible,
  onClose,
  challenge,
}) => {
  const progressPercentage = (challenge.currentProgress / challenge.maxProgress) * 100;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'steps':
        return '👟';
      case 'calories':
        return '🔥';
      case 'distance':
        return '🏃';
      default:
        return '🎯';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s left`;
    } else {
      return `${secs}s left`;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Challenge Header */}
            <View style={styles.challengeHeader}>
              <View style={styles.challengeIcon}>
                <Text style={styles.challengeIconText}>{getTypeIcon(challenge.type)}</Text>
              </View>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeName}>{challenge.name}</Text>
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
              </View>
            </View>

            {/* Time and Participants */}
            <Card style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Time Left</Text>
                  <Text style={styles.statValue}>{formatTime(challenge.timeLeft)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Participants</Text>
                  <Text style={styles.statValue}>{challenge.participants}</Text>
                </View>
              </View>
            </Card>

            {/* Progress */}
            <Card style={styles.progressCard}>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progressPercentage}%` }
                  ]} 
                />
              </View>
              <View style={styles.progressStats}>
                <Text style={styles.progressText}>
                  {challenge.currentProgress} / {challenge.maxProgress} {challenge.target}
                </Text>
                <Text style={styles.progressPercentage}>{progressPercentage.toFixed(1)}%</Text>
              </View>
            </Card>

            {/* Reward */}
            <Card style={styles.rewardCard}>
              <Text style={styles.rewardTitle}>Reward</Text>
              <View style={styles.rewardContent}>
                <Text style={styles.rewardIcon}>🏆</Text>
                <Text style={styles.rewardText}>{challenge.reward}</Text>
              </View>
            </Card>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Continue Challenge</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Share Progress</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.backgroundGradient[0],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 0,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.primaryText,
  },
  content: {
    padding: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  challengeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  challengeIconText: {
    fontSize: 28,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: Colors.secondaryText,
    lineHeight: 20,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  progressCard: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  rewardCard: {
    marginBottom: 24,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  rewardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.gold,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  secondaryButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
}); 