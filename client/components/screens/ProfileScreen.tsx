import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '../ui/Text';
import { StepCounter } from '../StepCounter';
import { GlassCard } from '../ui/GlassCard';
import Colors from '../../constants/Colors';
import { ChallengeJoinModal } from '../modals/ChallengeJoinModal';

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

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          {/* Profile Image - Clickable */}
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <Image
                source={{ uri: profile.imageUri }}
                style={styles.profileImage}
              />
              <View style={styles.imageOverlay}>
                <Text variant="caption" color="primary" weight="medium">
                  Tap to change
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Name - Centered without label */}
          <View style={styles.nameContainer}>
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
                <Text variant="h2" weight="bold" style={styles.name}>
                  {profile.name}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Bio - Centered */}
          <View style={styles.bioContainer}>
            {editingField === 'bio' ? (
              <TextInput
                value={profile.bio}
                onChangeText={(value) => setProfile(prev => ({ ...prev, bio: value }))}
                onBlur={() => setEditingField(null)}
                style={styles.bioInput}
                multiline
                numberOfLines={3}
                autoFocus
                selectTextOnFocus
              />
            ) : (
              <TouchableOpacity onPress={() => handleFieldPress('bio')} activeOpacity={0.7}>
                <Text variant="body" color="secondary" style={styles.bio}>
                  {profile.bio}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Join Challenge Button */}
          <TouchableOpacity style={{ backgroundColor: Colors.accent, borderRadius: 8, padding: 12, marginVertical: 16, alignItems: 'center' }} onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Join Profile Challenge</Text>
          </TouchableOpacity>

          <ChallengeJoinModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            time={challenge.time}
            description={challenge.description}
            totalUsers={challenge.totalUsers}
            entryFee={challenge.entryFee}
            image={challenge.image}
            onRegister={() => setModalVisible(false)}
          />

          {/* Basic Information Card */}
          <GlassCard style={{ marginBottom: 20 }}>
            <View style={styles.infoHeader}>
              <Text variant="h3" weight="semibold" style={[styles.infoTitle, { color: '#fff' }]}>
                Basic Information
              </Text>
            </View>
            <View style={styles.infoGrid}>
              <EditableField
                label="Location"
                value={profile.location}
                onSave={(value) => updateProfile('location', value)}
                isEditing={editingField === 'location'}
                onPress={() => handleFieldPress('location')}
              />
              <EditableField
                label="Height"
                value={profile.height}
                onSave={(value) => updateProfile('height', value)}
                isEditing={editingField === 'height'}
                onPress={() => handleFieldPress('height')}
              />
              <EditableField
                label="Weight"
                value={profile.weight}
                onSave={(value) => updateProfile('weight', value)}
                isEditing={editingField === 'weight'}
                onPress={() => handleFieldPress('weight')}
              />
              <EditableField
                label="Age"
                value={profile.age}
                onSave={(value) => updateProfile('age', value)}
                isEditing={editingField === 'age'}
                onPress={() => handleFieldPress('age')}
              />
              <EditableField
                label="Gender"
                value={profile.gender}
                onSave={(value) => updateProfile('gender', value)}
                isEditing={editingField === 'gender'}
                onPress={() => handleFieldPress('gender')}
              />
            </View>
          </GlassCard>

          {/* Step Counter Card */}
          <GlassCard style={{ marginBottom: 20 }}>
            <StepCounter />
          </GlassCard>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
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
}); 