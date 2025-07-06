import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard, Alert, Modal, Platform, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '../ui/Text';
import { StepCounter } from '../StepCounter';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
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

const EditableField: React.FC<EditableFieldProps> = ({ label, value }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.infoItem}>
      <Text variant="caption" style={{ color: colors.secondaryText }}>{label}</Text>
      <Text variant="body" weight="medium" style={[styles.infoValue, { color: colors.primaryText }]}> {value}</Text>
    </View>
  );
};

export const ProfileScreen: React.FC = () => {
  console.log('ProfileScreen rendering...');
  
  const { colors, theme, toggleTheme } = useTheme();
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

  const handleEditField = (field: keyof UserProfile, value: string) => {
    setEditProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    setProfile(editProfile);
    setShowEditModal(false);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@dreamfit.com');
  };

  const faqs = [
    {
      question: 'How do I join a challenge?',
      answer: 'Go to the Challenges tab and tap on any challenge you\'d like to join. You can also browse trending challenges on the home screen.'
    },
    {
      question: 'How are steps counted?',
      answer: 'DreamFit uses your device\'s built-in step counter. Make sure to grant activity permissions for accurate step tracking.'
    },
    {
      question: 'Can I withdraw my winnings?',
      answer: 'Yes! Once you win a challenge, your earnings are automatically added to your account balance. You can withdraw them anytime from your profile.'
    },
    {
      question: 'What if I lose connection during a challenge?',
      answer: 'Don\'t worry! Your steps are stored locally and will sync when you\'re back online. Your progress is never lost.'
    }
  ];

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
                    <Text style={[styles.profileName, { color: colors.primaryText }]}>{profile.name}</Text>
                <Text style={[styles.profileBio, { color: colors.secondaryText }]}>{profile.bio}</Text>
                <Text style={[styles.profileContact, { color: colors.secondaryText }]}>{profile.location}</Text>
              </View>
            </View>

            {/* Basic Information - Modern, non-editable */}
            <Card style={styles.infoCard}>
              <Text style={[styles.infoTitle, { color: colors.primaryText }]}>Basic Information</Text>
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
              <Text style={[styles.settingsTitle, { color: colors.primaryText }]}>Settings</Text>
              
              {/* Theme Switcher */}
              <View style={styles.settingsItem}>
                <Ionicons name="color-palette-outline" size={20} color={colors.accent} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.settingsText, { color: colors.primaryText }]}>Theme</Text>
                  <Text style={[styles.settingsSubtext, { color: colors.secondaryText }]}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </Text>
                </View>
                <Switch
                  value={theme === 'light'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.secondaryText, true: colors.accent }}
                  thumbColor={theme === 'light' ? colors.accent : '#ccc'}
                />
              </View>

              <TouchableOpacity style={styles.settingsItem} onPress={() => setShowEditModal(true)}>
                <Ionicons name="person-circle-outline" size={20} color={colors.accent} style={{ marginRight: 12 }} />
                <Text style={[styles.settingsText, { color: colors.primaryText }]}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={() => setShowNotificationsModal(true)}>
                <Ionicons name="notifications-outline" size={20} color={colors.accent} style={{ marginRight: 12 }} />
                <Text style={[styles.settingsText, { color: colors.primaryText }]}>Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={() => setShowHelpModal(true)}>
                <Ionicons name="help-circle-outline" size={20} color={colors.accent} style={{ marginRight: 12 }} />
                <Text style={[styles.settingsText, { color: colors.primaryText }]}>Help & Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={() => setShowLogoutModal(true)}>
                <Ionicons name="log-out-outline" size={20} color={colors.accent} style={{ marginRight: 12 }} />
                <Text style={[styles.settingsText, { color: colors.primaryText }]}>Logout</Text>
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
                <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                  <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Edit Profile</Text>
                  <ScrollView>
                    <Text style={[styles.modalLabel, { color: colors.primaryText }]}>Name</Text>
                    <TextInput
                      style={[styles.modalInput, { 
                        color: colors.primaryText, 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.borderColor 
                      }]}
                      value={editProfile.name}
                      onChangeText={text => handleEditField('name', text)}
                    />
                    <Text style={[styles.modalLabel, { color: colors.primaryText }]}>Bio</Text>
                    <TextInput
                      style={[styles.modalInput, { 
                        color: colors.primaryText, 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.borderColor 
                      }]}
                      value={editProfile.bio}
                      onChangeText={text => handleEditField('bio', text)}
                      multiline
                    />
                    <Text style={[styles.modalLabel, { color: colors.primaryText }]}>Location</Text>
                    <TextInput
                      style={[styles.modalInput, { 
                        color: colors.primaryText, 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.borderColor 
                      }]}
                      value={editProfile.location}
                      onChangeText={text => handleEditField('location', text)}
                    />
                    <Text style={[styles.modalLabel, { color: colors.primaryText }]}>Height</Text>
                    <TextInput
                      style={[styles.modalInput, { 
                        color: colors.primaryText, 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.borderColor 
                      }]}
                      value={editProfile.height}
                      onChangeText={text => handleEditField('height', text)}
                    />
                    <Text style={[styles.modalLabel, { color: colors.primaryText }]}>Weight</Text>
                    <TextInput
                      style={[styles.modalInput, { 
                        color: colors.primaryText, 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.borderColor 
                      }]}
                      value={editProfile.weight}
                      onChangeText={text => handleEditField('weight', text)}
                    />
                    <Text style={[styles.modalLabel, { color: colors.primaryText }]}>Age</Text>
                    <TextInput
                      style={[styles.modalInput, { 
                        color: colors.primaryText, 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.borderColor 
                      }]}
                      value={editProfile.age}
                      onChangeText={text => handleEditField('age', text)}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.modalLabel, { color: colors.primaryText }]}>Gender</Text>
                    <TextInput
                      style={[styles.modalInput, { 
                        color: colors.primaryText, 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.borderColor 
                      }]}
                      value={editProfile.gender}
                      onChangeText={text => handleEditField('gender', text)}
                    />
                  </ScrollView>
                  <View style={styles.modalButtonRow}>
                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.secondaryText }]} onPress={() => setShowEditModal(false)}>
                      <Text style={[styles.modalButtonText, { color: '#fff' }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accent }]} onPress={handleSaveProfile}>
                      <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save</Text>
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
                <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                  <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Notification Preferences</Text>
                  <View style={styles.notifItem}>
                    <View style={styles.notifRow}>
                      <View style={styles.notifTextCol}>
                        <Text style={[styles.notifLabel, { color: colors.primaryText }]}>Challenge Reminders</Text>
                        <Text style={[styles.notifDescription, { color: colors.secondaryText }]}>Get notified about upcoming challenges and deadlines</Text>
                </View>
                      <Switch
                        value={notifPrefs.challengeReminders}
                        onValueChange={() => handleToggleNotif('challengeReminders')}
                        trackColor={{ false: colors.secondaryText, true: colors.accent }}
                        thumbColor={notifPrefs.challengeReminders ? colors.accent : '#ccc'}
                      />
                </View>
                </View>
                  <View style={styles.notifItem}>
                    <View style={styles.notifRow}>
                      <View style={styles.notifTextCol}>
                        <Text style={[styles.notifLabel, { color: colors.primaryText }]}>Pool Start Alerts</Text>
                        <Text style={[styles.notifDescription, { color: colors.secondaryText }]}>Receive alerts when walking pools begin</Text>
                </View>
                      <Switch
                        value={notifPrefs.poolStartAlerts}
                        onValueChange={() => handleToggleNotif('poolStartAlerts')}
                        trackColor={{ false: colors.secondaryText, true: colors.accent }}
                        thumbColor={notifPrefs.poolStartAlerts ? colors.accent : '#ccc'}
                      />
              </View>
              </View>
                  <View style={styles.notifItem}>
                    <View style={styles.notifRow}>
                      <View style={styles.notifTextCol}>
                        <Text style={[styles.notifLabel, { color: colors.primaryText }]}>Rewards & Achievements</Text>
                        <Text style={[styles.notifDescription, { color: colors.secondaryText }]}>Celebrate your wins with achievement notifications</Text>
                      </View>
                      <Switch
                        value={notifPrefs.rewards}
                        onValueChange={() => handleToggleNotif('rewards')}
                        trackColor={{ false: colors.secondaryText, true: colors.accent }}
                        thumbColor={notifPrefs.rewards ? colors.accent : '#ccc'}
                    />
                  </View>
                  </View>
                  <View style={styles.helpButtonRow}>
                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accent }]} onPress={() => setShowNotificationsModal(false)}>
                      <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save</Text>
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
                <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                  <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Help & Support</Text>
                  <ScrollView style={{ maxHeight: 300 }}>
                    {faqs.map((faq, idx) => (
                      <View key={idx} style={styles.faqItem}>
                        <Text style={[styles.faqQuestion, { color: colors.primaryText }]}>{faq.question}</Text>
                        <Text style={[styles.faqAnswer, { color: colors.secondaryText }]}>{faq.answer}</Text>
                </View>
              ))}
                  </ScrollView>
                  <View style={styles.helpButtonRow}>
                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accent }, styles.helpButton]} onPress={handleContactSupport}>
                      <Text style={[styles.modalButtonText, { color: '#fff' }]}>Contact Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.secondaryText }]} onPress={() => setShowHelpModal(false)}>
                      <Text style={[styles.modalButtonText, { color: '#fff' }]}>Close</Text>
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
                <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                  <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Confirm Logout</Text>
                  <Text style={[styles.modalDescription, { color: colors.secondaryText }]}>
                    Are you sure you want to logout?
              </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.secondaryText }, { flex: 1, marginRight: 8 }]} onPress={() => setShowLogoutModal(false)}>
                      <Text style={[styles.modalButtonText, { color: '#fff' }]}>Cancel</Text>
              </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.accent }, { flex: 1, marginLeft: 8 }]} onPress={handleLogout}>
                      <Text style={[styles.modalButtonText, { color: '#fff' }]}>Logout</Text>
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
        animationType="slide"
        onRequestClose={() => setStepTestVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.primaryText }]}>Step Counter Test</Text>
            <View style={styles.stepCountContainer}>
              <StepCounter />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonSecondary]} onPress={() => setStepTestVisible(false)}>
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Challenge Join Modal */}
      <ChallengeJoinModal
        visible={modalVisible}
        time={challenge.time}
        description={challenge.description}
        totalUsers={challenge.totalUsers}
        entryFee={challenge.entryFee}
        image={challenge.image}
        onClose={() => setModalVisible(false)}
        onRegister={() => {
          setModalVisible(false);
          Alert.alert('Joined!', 'You have successfully joined the challenge.');
        }}
      />
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
    borderBottomWidth: 1,
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
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    minHeight: 60,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
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
  },
  editableText: {
    fontSize: fontSize.md,
    fontWeight: '500' as const,
  },
  textInput: {
    fontSize: fontSize.md,
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
  },
  statLabel: {
    fontSize: fontSize.xs,
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
  },
  rewardLabel: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  activityCard: {
    marginBottom: margin.lg,
    padding: padding.lg,
  },
  activityTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
    marginBottom: spacing.md,
  },
  activityItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  activityText: {
    fontSize: fontSize.sm,
    fontWeight: '500' as const,
  },
  activityTime: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalButtonRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center' as const,
    marginHorizontal: 4,
  },
  modalButtonText: {
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
    backgroundColor: '#10B981', // Green color
  },
  modalButtonPrimary: {
    backgroundColor: '#10B981', // Green color
  },
  profileName: {
    fontSize: fontSize.xl,
    fontWeight: 'bold' as const,
  },
  profileBio: {
    fontSize: fontSize.sm,
  },
  editButton: {
    padding: padding.md,
  },
  editButtonText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold' as const,
  },
  statsTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  rewardsTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold' as const,
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
    backgroundColor: '#10B981', // Green color
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
    marginTop: 2,
  },
  settingsCard: {
    padding: 16,
    borderRadius: 12,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginBottom: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  settingsText: {
    fontSize: 15,
  },
  settingsSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  profileContact: {
    fontSize: 13,
    marginTop: 2,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 15,
  },
  faqAnswer: {
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
  notifLabel: { fontWeight: 'bold', fontSize: 15 },
  notifDescription: { fontSize: 13, marginTop: 2 },
}); 