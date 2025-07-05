import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard, Alert, Modal, Platform, Switch } from 'react-native';
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
import * as Linking from 'expo-linking';

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
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text variant="caption" style={{ color: '#fff' }}>{label}</Text>
    <Text variant="body" weight="medium" style={[styles.infoValue, { color: Colors.primaryText }]}> {value}</Text>
  </View>
);

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfile>(profile);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({
    challengeReminders: true,
    poolStartAlerts: true,
    rewards: true,
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleEditField = (field: keyof UserProfile, value: string) => {
    setEditProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    setProfile(editProfile);
    setShowEditModal(false);
  };

  const faqs = [
    {
      question: 'How do I join a challenge or pool?',
      answer: 'Go to the Challenges tab, select a challenge or pool, and tap Join. You may need enough wallet balance to enter.'
    },
    {
      question: 'How do I withdraw my winnings?',
      answer: 'Go to your Wallet, tap Withdraw, and follow the instructions to transfer money to your account.'
    },
    {
      question: 'How is step tracking handled?',
      answer: 'Step tracking is automatic when you join a challenge or pool. Make sure you have granted activity permissions.'
    },
    {
      question: 'How do I contact support?',
      answer: 'Tap the Contact Support button below to email us.'
    },
  ];

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@dreamfit.com?subject=DreamFit App Support');
  };

  const handleToggleNotif = (key: keyof typeof notifPrefs) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    // TODO: Add real logout logic (clear user data, navigate to sign-in)
    setShowLogoutModal(false);
    Alert.alert('Logged out', 'You have been logged out.');
    // navigation.navigate('SignIn');
  };

  return (
    <ScreenContainer>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.profileContainer}>
            {/* Header: Avatar, Name, Bio, Contact */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                <Image source={{ uri: profile.imageUri }} style={styles.profileImage} />
              </TouchableOpacity>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileBio}>{profile.bio}</Text>
                <Text style={styles.profileContact}>{profile.location}</Text>
              </View>
            </View>

            {/* Basic Information - Modern, non-editable */}
            <Card style={styles.infoCard}>
              <Text style={styles.infoTitle}>Basic Information</Text>
              <View style={styles.infoGrid}>
                <EditableField label="Location" value={profile.location} />
                <EditableField label="Height" value={profile.height} />
                <EditableField label="Weight" value={profile.weight} />
                <EditableField label="Age" value={profile.age} />
                <EditableField label="Gender" value={profile.gender} />
              </View>
            </Card>

            {/* Settings Section */}
            <Card style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>Settings</Text>
              <TouchableOpacity style={styles.settingsItem} onPress={() => setShowEditModal(true)}>
                <Ionicons name="person-circle-outline" size={20} color={Colors.accent} style={{ marginRight: 12 }} />
                <Text style={styles.settingsText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={() => setShowNotificationsModal(true)}>
                <Ionicons name="notifications-outline" size={20} color={Colors.accent} style={{ marginRight: 12 }} />
                <Text style={styles.settingsText}>Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={() => setShowHelpModal(true)}>
                <Ionicons name="help-circle-outline" size={20} color={Colors.accent} style={{ marginRight: 12 }} />
                <Text style={styles.settingsText}>Help & Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={() => setShowLogoutModal(true)}>
                <Ionicons name="log-out-outline" size={20} color={Colors.accent} style={{ marginRight: 12 }} />
                <Text style={styles.settingsText}>Logout</Text>
              </TouchableOpacity>
            </Card>

            {/* Edit Profile Modal */}
            <Modal
              visible={showEditModal}
              transparent
              animationType="slide"
              onRequestClose={() => setShowEditModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Edit Profile</Text>
                  <ScrollView>
                    <Text style={styles.modalLabel}>Name</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editProfile.name}
                      onChangeText={text => handleEditField('name', text)}
                    />
                    <Text style={styles.modalLabel}>Bio</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editProfile.bio}
                      onChangeText={text => handleEditField('bio', text)}
                      multiline
                    />
                    <Text style={styles.modalLabel}>Location</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editProfile.location}
                      onChangeText={text => handleEditField('location', text)}
                    />
                    <Text style={styles.modalLabel}>Height</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editProfile.height}
                      onChangeText={text => handleEditField('height', text)}
                    />
                    <Text style={styles.modalLabel}>Weight</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editProfile.weight}
                      onChangeText={text => handleEditField('weight', text)}
                    />
                    <Text style={styles.modalLabel}>Age</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editProfile.age}
                      onChangeText={text => handleEditField('age', text)}
                      keyboardType="numeric"
                    />
                    <Text style={styles.modalLabel}>Gender</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editProfile.gender}
                      onChangeText={text => handleEditField('gender', text)}
                    />
                  </ScrollView>
                  <View style={styles.modalButtonRow}>
                    <TouchableOpacity style={[styles.modalButton, styles.modalCancel]} onPress={() => setShowEditModal(false)}>
                      <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, styles.modalSave]} onPress={handleSaveProfile}>
                      <Text style={styles.modalButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Notifications Modal */}
            <Modal
              visible={showNotificationsModal}
              transparent
              animationType="slide"
              onRequestClose={() => setShowNotificationsModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Notification Preferences</Text>
                  <View style={styles.notifItem}>
                    <View style={styles.notifRow}>
                      <View style={styles.notifTextCol}>
                        <Text style={styles.notifLabel}>Challenge Reminders</Text>
                        <Text style={styles.notifDescription}>Get notified about upcoming challenges and deadlines</Text>
                      </View>
                      <Switch
                        value={notifPrefs.challengeReminders}
                        onValueChange={() => handleToggleNotif('challengeReminders')}
                        trackColor={{ false: Colors.secondaryText, true: Colors.accent }}
                        thumbColor={notifPrefs.challengeReminders ? Colors.accent : '#ccc'}
                      />
                    </View>
                  </View>
                  <View style={styles.notifItem}>
                    <View style={styles.notifRow}>
                      <View style={styles.notifTextCol}>
                        <Text style={styles.notifLabel}>Pool Start Alerts</Text>
                        <Text style={styles.notifDescription}>Receive alerts when walking pools begin</Text>
                      </View>
                      <Switch
                        value={notifPrefs.poolStartAlerts}
                        onValueChange={() => handleToggleNotif('poolStartAlerts')}
                        trackColor={{ false: Colors.secondaryText, true: Colors.accent }}
                        thumbColor={notifPrefs.poolStartAlerts ? Colors.accent : '#ccc'}
                      />
                    </View>
                  </View>
                  <View style={styles.notifItem}>
                    <View style={styles.notifRow}>
                      <View style={styles.notifTextCol}>
                        <Text style={styles.notifLabel}>Rewards & Achievements</Text>
                        <Text style={styles.notifDescription}>Celebrate your wins with achievement notifications</Text>
                      </View>
                      <Switch
                        value={notifPrefs.rewards}
                        onValueChange={() => handleToggleNotif('rewards')}
                        trackColor={{ false: Colors.secondaryText, true: Colors.accent }}
                        thumbColor={notifPrefs.rewards ? Colors.accent : '#ccc'}
                      />
                    </View>
                  </View>
                  <View style={styles.helpButtonRow}>
                    <TouchableOpacity style={[styles.modalButton, styles.modalSave]} onPress={() => setShowNotificationsModal(false)}>
                      <Text style={styles.modalButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Help & Support Modal */}
            <Modal
              visible={showHelpModal}
              transparent
              animationType="slide"
              onRequestClose={() => setShowHelpModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Help & Support</Text>
                  <ScrollView style={{ maxHeight: 300 }}>
                    {faqs.map((faq, idx) => (
                      <View key={idx} style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>{faq.question}</Text>
                        <Text style={styles.faqAnswer}>{faq.answer}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  <View style={styles.helpButtonRow}>
                    <TouchableOpacity style={[styles.modalButton, styles.modalSave, styles.helpButton]} onPress={handleContactSupport}>
                      <Text style={styles.modalButtonText}>Contact Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, styles.modalCancel]} onPress={() => setShowHelpModal(false)}>
                      <Text style={styles.modalButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Logout Confirmation Modal */}
            <Modal
              visible={showLogoutModal}
              transparent
              animationType="fade"
              onRequestClose={() => setShowLogoutModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Confirm Logout</Text>
                  <Text style={{ color: Colors.secondaryText, fontSize: 15, textAlign: 'center', marginVertical: 16 }}>
                    Are you sure you want to logout?
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <TouchableOpacity style={[styles.modalButton, styles.modalCancel, { flex: 1, marginRight: 8 }]} onPress={() => setShowLogoutModal(false)}>
                      <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, styles.modalSave, { flex: 1, marginLeft: 8 }]} onPress={handleLogout}>
                      <Text style={styles.modalButtonText}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Step Counter Test</Text>
            <Text style={{ fontSize: fontSize.sm, color: Colors.secondaryText, marginBottom: spacing.lg, textAlign: 'center' }}>
              {Platform.OS === 'web' 
                ? 'Testing on PC/Web - Step counting is simulated. On a real device, it will detect actual steps.'
                : 'Start walking to test your step counter. The counter will automatically detect your steps.'
              }
            </Text>
            
            <View style={styles.stepCountContainer}>
              <Text style={{ fontSize: fontSize.xxxl, fontWeight: 'bold', color: Colors.accent }}>{stepCount}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 12,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#1a2d2d',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginBottom: 4,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancel: {
    backgroundColor: Colors.secondaryText,
  },
  modalSave: {
    backgroundColor: Colors.accent,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  stepCountContainer: {
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    width: '100%',
  },
  modalButtonSecondary: {
    backgroundColor: Colors.accent,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.accent,
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
  infoValue: {
    fontSize: 15,
    color: Colors.primaryText,
    marginTop: 2,
  },
  settingsCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  settingsText: {
    fontSize: 15,
    color: Colors.primaryText,
  },
  profileContact: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
    fontSize: 15,
  },
  faqAnswer: {
    color: Colors.secondaryText,
    fontSize: 14,
    marginBottom: 2,
  },
  helpButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  helpButton: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  notifTextCol: { flex: 1 },
  notifRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  notifItem: { marginBottom: 12 },
  notifLabel: { fontWeight: 'bold', color: Colors.primaryText, fontSize: 15 },
  notifDescription: { color: Colors.secondaryText, fontSize: 13, marginTop: 2 },
}); 