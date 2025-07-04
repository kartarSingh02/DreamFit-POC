import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard, Alert, Modal, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '../ui/Text';
import { StepCounter } from '../StepCounter';
import { Card } from '../ui/Card';
import Colors from '../../constants/Colors';
import { ChallengeJoinModal } from '../modals/ChallengeJoinModal';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../layout/ScreenContainer';
import { padding, margin, fontSize, spacing } from '../../constants/Responsive';
import { useStepCounter } from '../StepCounterContext';

interface UserProfile {
  name: string;
  bio: string;
  location: string;
  height: string;
  weight: string;
  age: string;
  gender: string;
  imageUri: string;
}

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  onPress: () => void;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onSave, isEditing, onPress }) => {
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    if (tempValue.trim() !== value) {
      onSave(tempValue.trim());
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <View style={styles.infoItem}>
      <Text variant="caption" style={{ color: '#fff' }}>{label}</Text>
      {isEditing ? (
        <TextInput
          value={tempValue}
          onChangeText={setTempValue}
          onBlur={handleBlur}
          style={styles.textInput}
          autoFocus
          selectTextOnFocus
        />
      ) : (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Text variant="body" weight="medium" style={[styles.editableText, { color: '#ff6b35' }]}>
            {value}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const ProfileScreen: React.FC = () => {
  console.log('ProfileScreen rendering...');
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    bio: 'Fitness enthusiast and adventure seeker. Always pushing my limits and inspiring others to do the same! 💪',
    location: 'New York, NY',
    height: '5\'8"',
    weight: '150 lbs',
    age: '28',
    gender: 'Male',
    imageUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [walkPermission, setWalkPermission] = useState(true);
  const challenge = {
    time: 'Anytime',
    description: 'Profile special challenge! Join and test your limits.',
    totalUsers: 500,
    entryFee: 20,
    image: require('../../assets/images/partial-react-logo.png'),
  };
  const [stepTestVisible, setStepTestVisible] = useState(false);
  const [stepPermissionChecked, setStepPermissionChecked] = useState(false);

  // Use real step counter
  const { isActive, stepCount, start, stop, lastResult } = useStepCounter();

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setEditingField(null);
  };

  const handleFieldPress = (field: string) => {
    setEditingField(field);
  };

  const handleOutsidePress = () => {
    if (editingField) {
      setEditingField(null);
    }
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to change your profile image.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfile(prev => ({ ...prev, imageUri: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to pick image. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  // Mock stats, rewards, and activity
  const stats = { steps: 7890, calories: 1234, distance: 6.2, streak: 7 };
  const rewards = { points: 1250, crowns: 2, rings: 5, badges: 8 };
  const activity = [
    { type: 'challenge', text: 'Joined Step Challenge', time: '2h ago' },
    { type: 'badge', text: 'Earned "Early Bird" badge', time: '1d ago' },
    { type: 'reward', text: 'Won 500 Points', time: '3d ago' },
  ];

  // Request activity/fitness permission when opening step counter test
  const requestStepPermission = async () => {
    // For demo: always allow, but show a message the first time
    if (!stepPermissionChecked) {
      Alert.alert(
        'Permission Required',
        'Please enable activity/fitness permissions to count your steps.',
        [{ text: 'OK' }]
      );
      setStepPermissionChecked(true);
    }
    return true;
  };

  const handleStartTest = async () => {
    const granted = await requestStepPermission();
    if (!granted) return;
    
    // Show platform-specific message
    if (Platform.OS === 'web') {
      Alert.alert(
        'Testing Mode',
        'You\'re testing on PC/Web. Step counting will be simulated for demonstration purposes. On a real device, it will use actual step sensors.',
        [{ text: 'OK' }]
      );
    }
    
    setStepTestVisible(true);
    start(); // Start real step counting (or mock on web)
  };

  const handleCloseTest = () => {
    setStepTestVisible(false);
    stop(); // Stop step counting
  };

  const handleStopTest = () => {
    setStepTestVisible(false);
    stop(); // Stop step counting and show result
    if (lastResult) {
      Alert.alert('Woho!', `You walked ${lastResult} steps!`);
    }
  };

  return (
    <ScreenContainer>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.profileContainer}>
            {/* Header: Avatar, Name, Edit/Settings */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                <Image source={{ uri: profile.imageUri }} style={styles.profileImage} />
              </TouchableOpacity>
              <View style={{ flex: 1, marginLeft: 16 }}>
                {editingField === 'name' ? (
                  <TextInput
                    value={profile.name}
                    onChangeText={(value) => setProfile(prev => ({ ...prev, name: value }))}
                    onBlur={() => setEditingField(null)}
                    style={styles.nameInput}
                    autoFocus
                    selectTextOnFocus
                  />
                ) : (
                  <TouchableOpacity onPress={() => handleFieldPress('name')} activeOpacity={0.7}>
                    <Text style={styles.profileName}>{profile.name}</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.profileBio}>{profile.bio}</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Stats Card */}
            <Card style={styles.statsCard}>
              <Text style={styles.statsTitle}>Your Stats</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.steps.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Steps Today</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.calories}</Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.distance}km</Text>
                  <Text style={styles.statLabel}>Distance</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.streak}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
              </View>
            </Card>

            {/* Rewards Card */}
            <Card style={styles.rewardsCard}>
              <Text style={styles.rewardsTitle}>Your Rewards</Text>
              <View style={styles.rewardsGrid}>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>👑</Text>
                  <Text style={styles.rewardValue}>{rewards.crowns}</Text>
                  <Text style={styles.rewardLabel}>Crowns</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>💍</Text>
                  <Text style={styles.rewardValue}>{rewards.rings}</Text>
                  <Text style={styles.rewardLabel}>Rings</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>🏆</Text>
                  <Text style={styles.rewardValue}>{rewards.badges}</Text>
                  <Text style={styles.rewardLabel}>Badges</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>⭐</Text>
                  <Text style={styles.rewardValue}>{rewards.points}</Text>
                  <Text style={styles.rewardLabel}>Points</Text>
                </View>
              </View>
            </Card>

            {/* Wallet Card */}
            <Card style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <Text style={styles.walletTitle}>Wallet Balance</Text>
                <TouchableOpacity style={styles.withdrawBtn}>
                  <Ionicons name="arrow-up" size={16} color={Colors.primaryText} />
                  <Text style={styles.withdrawText}>Withdraw</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.walletBalance}>₹1,250</Text>
              <Text style={styles.walletSubtext}>Available for pools and rewards</Text>
            </Card>

            {/* Recent Activity */}
            <Card style={styles.activityCard}>
              <Text style={styles.activityTitle}>Recent Activity</Text>
              {activity.map((item, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Ionicons 
                      name={item.type === 'challenge' ? 'trophy' : item.type === 'badge' ? 'star' : 'gift'} 
                      size={16} 
                      color={Colors.primaryText} 
                    />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>{item.text}</Text>
                    <Text style={styles.activityTime}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </Card>

            {/* Step Counter Test */}
            <Card style={styles.stepTestCard}>
              <Text style={styles.stepTestTitle}>Test Step Counter</Text>
              <Text style={{ fontSize: fontSize.sm, color: Colors.secondaryText, marginBottom: spacing.md, textAlign: 'center' }}>
                Test your step counter to ensure accurate tracking for walking pools
              </Text>
              <TouchableOpacity style={styles.stepTestButton} onPress={handleStartTest}>
                <Text style={styles.stepTestButtonText}>Start Step Counter Test</Text>
              </TouchableOpacity>
            </Card>

            {/* Basic Information */}
            <Card style={styles.infoCard}>
              <Text style={styles.infoTitle}>Basic Information</Text>
              <View style={styles.infoGrid}>
                <EditableField label="Location" value={profile.location} onSave={(value) => updateProfile('location', value)} isEditing={editingField === 'location'} onPress={() => handleFieldPress('location')} />
                <EditableField label="Height" value={profile.height} onSave={(value) => updateProfile('height', value)} isEditing={editingField === 'height'} onPress={() => handleFieldPress('height')} />
                <EditableField label="Weight" value={profile.weight} onSave={(value) => updateProfile('weight', value)} isEditing={editingField === 'weight'} onPress={() => handleFieldPress('weight')} />
                <EditableField label="Age" value={profile.age} onSave={(value) => updateProfile('age', value)} isEditing={editingField === 'age'} onPress={() => handleFieldPress('age')} />
                <EditableField label="Gender" value={profile.gender} onSave={(value) => updateProfile('gender', value)} isEditing={editingField === 'gender'} onPress={() => handleFieldPress('gender')} />
              </View>
            </Card>

          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Step Counter Test Modal */}
      <Modal
        visible={stepTestVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseTest}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Step Counter Test</Text>
            <Text style={{ fontSize: fontSize.sm, color: Colors.secondaryText, marginBottom: spacing.lg, textAlign: 'center' }}>
              {Platform.OS === 'web' 
                ? 'Testing on PC/Web - Step counting is simulated. On a real device, it will detect actual steps.'
                : 'Start walking to test your step counter. The counter will automatically detect your steps.'
              }
            </Text>
            
            <View style={styles.stepCountContainer}>
              <Text style={styles.modalSteps}>{stepCount}</Text>
              <Text style={{ fontSize: fontSize.md, color: Colors.secondaryText }}>steps</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]} 
                onPress={handleCloseTest}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={handleStopTest}
              >
                <Text style={styles.modalButtonText}>Stop Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    // No extra padding since ScreenContainer already provides padding
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.accent,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    borderBottomLeftRadius: 57,
    borderBottomRightRadius: 57,
    alignItems: 'center',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    textAlign: 'center',
  },
  nameInput: {
    fontSize: fontSize.xl,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent,
    paddingVertical: spacing.xs,
  },
  bioContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bio: {
    textAlign: 'center',
    lineHeight: 24,
  },
  bioInput: {
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    minHeight: 60,
    padding: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accent,
    width: '100%',
  },
  infoCard: {
    marginBottom: margin.lg,
    padding: padding.lg,
  },
  infoHeader: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    marginBottom: spacing.md,
  },
  infoGrid: {
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  editableText: {
    fontSize: fontSize.md,
    fontWeight: '500' as const,
  },
  textInput: {
    fontSize: fontSize.md,
    color: Colors.accent,
    fontWeight: '500' as const,
    textAlign: 'right' as const,
    minWidth: 100,
  },
  headerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: margin.lg,
  },
  settingsBtn: {
    padding: padding.md,
  },
  statsCard: {
    marginBottom: margin.lg,
    padding: padding.lg,
  },
  statsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  statItem: {
    alignItems: 'center' as const,
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold' as const,
    color: Colors.accent,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: Colors.secondaryText,
    marginTop: spacing.xs,
  },
  rewardsCard: {
    marginBottom: margin.lg,
    padding: padding.lg,
  },
  rewardsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  rewardItem: {
    alignItems: 'center' as const,
    flex: 1,
  },
  rewardIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  rewardValue: {
    fontSize: fontSize.md,
    fontWeight: 'bold' as const,
    color: Colors.gold,
  },
  rewardLabel: {
    fontSize: fontSize.xs,
    color: Colors.secondaryText,
    marginTop: spacing.xs,
  },
  activityCard: {
    marginBottom: margin.lg,
    padding: padding.lg,
  },
  activityTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    marginBottom: spacing.md,
  },
  activityItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  activityText: {
    fontSize: fontSize.sm,
    color: Colors.primaryText,
    fontWeight: '500' as const,
  },
  activityTime: {
    fontSize: fontSize.xs,
    color: Colors.secondaryText,
    marginTop: spacing.xs,
  },
  walletCard: {
    marginBottom: margin.lg,
    padding: padding.lg,
  },
  walletHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.sm,
  },
  walletTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
  },
  walletBalance: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold' as const,
    color: Colors.gold,
    marginTop: spacing.xs,
  },
  withdrawBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.accent,
    paddingHorizontal: padding.sm,
    paddingVertical: padding.xs,
    borderRadius: 8,
  },
  withdrawText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    marginLeft: spacing.xs,
  },
  walletSubtext: {
    fontSize: fontSize.xs,
    color: Colors.secondaryText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTestModal: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: padding.xl,
    alignItems: 'center',
    width: 300,
  },
  stepTestTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    marginBottom: spacing.md,
  },
  stepTestDesc: {
    color: Colors.secondaryText,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  stepTestCount: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold' as const,
    color: Colors.accent,
    marginBottom: spacing.md,
  },
  stepTestBtnRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    width: '100%',
    marginBottom: spacing.md,
  },
  stepTestActionBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: padding.lg,
    paddingVertical: padding.md,
    marginHorizontal: padding.md,
  },
  stepTestActionText: {
    color: '#fff',
    fontWeight: 'bold' as const,
  },
  stepTestCloseBtn: {
    marginTop: spacing.md,
    alignSelf: 'center',
  },
  stepTestCloseText: {
    color: Colors.accent,
    fontWeight: 'bold' as const,
    fontSize: fontSize.md,
  },
  stepTestBtn: {
    marginTop: spacing.md,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'center',
    paddingHorizontal: padding.lg,
    paddingVertical: padding.md,
  },
  stepTestBtnText: {
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: fontSize.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: padding.xl,
    alignItems: 'center',
    width: 300,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    marginBottom: spacing.md,
  },
  stepCountContainer: {
    marginBottom: spacing.md,
  },
  modalSteps: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold' as const,
    color: Colors.accent,
  },
  modalButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    width: '100%',
  },
  modalButton: {
    padding: padding.md,
    borderRadius: 8,
    backgroundColor: Colors.accent,
  },
  modalButtonSecondary: {
    backgroundColor: Colors.accent,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.accent,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: fontSize.md,
  },
  profileName: {
    fontSize: fontSize.xl,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
  },
  profileBio: {
    fontSize: fontSize.sm,
    color: Colors.secondaryText,
  },
  editButton: {
    padding: padding.md,
  },
  editButtonText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold' as const,
    color: Colors.accent,
  },
  statsTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  rewardsTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
    color: Colors.primaryText,
    marginBottom: spacing.md,
  },
  rewardsGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  stepTestCard: {
    marginBottom: margin.lg,
    padding: padding.lg,
  },
  stepTestButton: {
    marginTop: spacing.md,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'center',
    paddingHorizontal: padding.lg,
    paddingVertical: padding.md,
  },
  stepTestButtonText: {
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: fontSize.md,
  },
  activityIcon: {
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
}); 