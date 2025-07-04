import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '../ui/Text';
import { StepCounter } from '../StepCounter';
import { Card } from '../ui/Card';
import Colors from '../../constants/Colors';
import { ChallengeJoinModal } from '../modals/ChallengeJoinModal';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../layout/ScreenContainer';

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
  const [testSteps, setTestSteps] = useState(0);
  const [stepPermissionChecked, setStepPermissionChecked] = useState(false);

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
    setTestSteps(0);
    setStepTestVisible(true);
  };
  const handleCloseTest = () => setStepTestVisible(false);
  const handleSimulateStep = () => setTestSteps(s => s + 1);
  const handleResetTest = () => setTestSteps(0);
  const handleStopTest = () => {
    setStepTestVisible(false);
    Alert.alert('Woho!', `You walked ${testSteps} steps!`);
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
                    <Text variant="h2" weight="bold" style={styles.name}>{profile.name}</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.bio} numberOfLines={2}>{profile.bio}</Text>
              </View>
              <TouchableOpacity style={styles.settingsBtn} onPress={() => Alert.alert('Settings')}>
                <Ionicons name="settings" size={24} color={Colors.accent} />
              </TouchableOpacity>
            </View>

            {/* Stats Summary */}
            <Card style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}><Ionicons name="walk" size={20} color={Colors.accent} /><Text style={styles.statValue}>{stats.steps}</Text><Text style={styles.statLabel}>Steps</Text></View>
                <View style={styles.statItem}><Ionicons name="flame" size={20} color={Colors.accent} /><Text style={styles.statValue}>{stats.calories}</Text><Text style={styles.statLabel}>Calories</Text></View>
                <View style={styles.statItem}><Ionicons name="map" size={20} color={Colors.accent} /><Text style={styles.statValue}>{stats.distance} km</Text><Text style={styles.statLabel}>Distance</Text></View>
                <View style={styles.statItem}><Ionicons name="flame" size={20} color={Colors.accent} /><Text style={styles.statValue}>{stats.streak}d</Text><Text style={styles.statLabel}>Streak</Text></View>
              </View>
              <TouchableOpacity style={styles.stepTestBtn} onPress={handleStartTest}>
                <Ionicons name="walk" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.stepTestBtnText}>Test Step Counter</Text>
              </TouchableOpacity>
            </Card>

            {/* Step Counter Test Modal */}
            <Modal
              visible={stepTestVisible}
              animationType="slide"
              transparent
              onRequestClose={handleCloseTest}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.stepTestModal}>
                  <Text style={styles.stepTestTitle}>Step Counter Test</Text>
                  <Text style={styles.stepTestDesc}>Walk around and see if the app counts your steps accurately.</Text>
                  <Text style={styles.stepTestCount}>{testSteps} steps</Text>
                  <View style={styles.stepTestBtnRow}>
                    <TouchableOpacity style={styles.stepTestActionBtn} onPress={handleSimulateStep}>
                      <Text style={styles.stepTestActionText}>Simulate Step</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stepTestActionBtn} onPress={handleResetTest}>
                      <Text style={styles.stepTestActionText}>Reset</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.stepTestCloseBtn} onPress={handleStopTest}>
                    <Text style={styles.stepTestCloseText}>Stop</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Rewards & Achievements */}
            <Card style={styles.rewardsCard}>
              <View style={styles.rewardsRow}>
                <View style={styles.rewardItem}><Text style={styles.rewardIcon}>💎</Text><Text style={styles.rewardValue}>{rewards.points}</Text><Text style={styles.rewardLabel}>Points</Text></View>
                <View style={styles.rewardItem}><Text style={styles.rewardIcon}>👑</Text><Text style={styles.rewardValue}>{rewards.crowns}</Text><Text style={styles.rewardLabel}>Crowns</Text></View>
                <View style={styles.rewardItem}><Text style={styles.rewardIcon}>💍</Text><Text style={styles.rewardValue}>{rewards.rings}</Text><Text style={styles.rewardLabel}>Rings</Text></View>
                <View style={styles.rewardItem}><Text style={styles.rewardIcon}>🏅</Text><Text style={styles.rewardValue}>{rewards.badges}</Text><Text style={styles.rewardLabel}>Badges</Text></View>
              </View>
            </Card>

            {/* Recent Activity */}
            <Card style={styles.activityCard}>
              <Text style={styles.activityTitle}>Recent Activity</Text>
              {activity.map((a, idx) => (
                <View key={idx} style={styles.activityItem}>
                  <Ionicons name={a.type === 'challenge' ? 'trophy' : a.type === 'badge' ? 'ribbon' : 'star'} size={18} color={Colors.accent} style={{ marginRight: 8 }} />
                  <Text style={styles.activityText}>{a.text}</Text>
                  <Text style={styles.activityTime}>{a.time}</Text>
                </View>
              ))}
            </Card>

            {/* Editable Info */}
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
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    color: Colors.primaryText,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoHeader: {
    marginBottom: 16,
  },
  infoTitle: {
    color: Colors.primaryText,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    gap: 4,
  },
  editableText: {
    color: Colors.primaryText,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  textInput: {
    color: Colors.primaryText,
    backgroundColor: Colors.backgroundGradient[1],
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.accent,
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsBtn: {
    padding: 8,
  },
  statsCard: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  rewardsCard: {
    marginBottom: 20,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rewardItem: {
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  rewardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  rewardLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  activityCard: {
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityText: {
    flex: 1,
  },
  activityTime: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  walletCard: {
    marginBottom: 20,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 18,
    fontWeight: 'bold',
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
    padding: 28,
    alignItems: 'center',
    width: 300,
  },
  stepTestTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 8,
  },
  stepTestDesc: {
    color: Colors.secondaryText,
    fontSize: 14,
    marginBottom: 18,
    textAlign: 'center',
  },
  stepTestCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 18,
  },
  stepTestBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
  },
  stepTestActionBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
  },
  stepTestActionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepTestCloseBtn: {
    marginTop: 8,
    alignSelf: 'center',
  },
  stepTestCloseText: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepTestBtn: {
    marginTop: 16,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  stepTestBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 