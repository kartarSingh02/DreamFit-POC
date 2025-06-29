import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import Colors from '../../constants/Colors';
import { ChallengeJoinModal } from '../modals/ChallengeJoinModal';

const challenges = [
  {
    id: 1,
    name: 'Morning Marathon',
    entry: 30,
    prize: 300,
    image: require('../../assets/images/partial-react-logo.png'),
    time: '6:00 AM - 8:00 AM',
    description: 'Start your day with a marathon! Join and compete with others to win big.',
    totalUsers: 1000,
  },
  {
    id: 2,
    name: 'Evening Sprint',
    entry: 50,
    prize: 500,
    image: require('../../assets/images/adaptive-icon.png'),
    time: '6:00 PM - 7:00 PM',
    description: 'A quick sprint to end your day. Join and win exciting prizes!',
    totalUsers: 800,
  },
  {
    id: 3,
    name: 'Weekend Warrior',
    entry: 100,
    prize: 1000,
    image: require('../../assets/images/react-logo.png'),
    time: 'Sunday 7:00 AM',
    description: 'Weekend challenge for the warriors! Show your stamina and win.',
    totalUsers: 1200,
  },
];

export const TrendingChallengesPreview: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [walkPermission, setWalkPermission] = useState(true);

  const handleJoin = (challenge: any) => {
    setSelectedChallenge(challenge);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setSelectedChallenge(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Trending Challenges</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
        {challenges.map((c) => (
          <GlassCard key={c.id} style={styles.challengeCard}>
            <Image source={c.image} style={styles.image} />
            <Text style={styles.challengeName}>{c.name}</Text>
            <Text style={styles.detail}>Entry: ₹{c.entry} | Prize: ₹{c.prize}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleJoin(c)}>
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
          </GlassCard>
        ))}
      </ScrollView>
      {selectedChallenge && (
        <ChallengeJoinModal
          visible={modalVisible}
          onClose={handleClose}
          time={selectedChallenge.time}
          description={selectedChallenge.description}
          totalUsers={selectedChallenge.totalUsers}
          entryFee={selectedChallenge.entry}
          image={selectedChallenge.image}
          walkPermission={walkPermission}
          onToggleWalkPermission={setWalkPermission}
          onRegister={() => { setModalVisible(false); }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginLeft: 4,
    marginRight: 8,
  },
  heading: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 18,
  },
  seeAll: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollRow: {
    paddingLeft: 4,
    paddingRight: 8,
  },
  challengeCard: {
    width: 160,
    marginRight: 14,
    alignItems: 'center',
    padding: 0,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 12,
    marginBottom: 8,
  },
  challengeName: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    textAlign: 'center',
  },
  detail: {
    color: Colors.accent,
    fontSize: 13,
    marginBottom: 6,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  buttonText: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 