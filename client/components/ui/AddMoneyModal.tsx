import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface AddMoneyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ visible, onClose }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState('');

  const handleAdd = () => {
    const amount = selected || parseInt(custom, 10);
    if (!amount || amount < 1) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    onClose();
    setTimeout(() => {
      Alert.alert('Success', `₹${amount} added to your wallet!`);
    }, 300);
    setSelected(null);
    setCustom('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Money</Text>
          <View style={styles.amountRow}>
            {[100, 500, 1000].map(val => (
              <TouchableOpacity
                key={val}
                style={[styles.amountBtn, selected === val && styles.amountBtnSelected]}
                onPress={() => { setSelected(val); setCustom(''); }}
              >
                <Text style={styles.amountBtnText}>₹{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.or}>or</Text>
          <TextInput
            style={styles.input}
            placeholder="Custom amount"
            placeholderTextColor={Colors.secondaryText}
            keyboardType="numeric"
            value={custom}
            onChangeText={txt => { setCustom(txt); setSelected(null); }}
            maxLength={6}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Ionicons name="add" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.addBtnText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    padding: 28,
    width: 320,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 18,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountBtn: {
    backgroundColor: Colors.backgroundGradient[1],
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginHorizontal: 6,
  },
  amountBtnSelected: {
    backgroundColor: Colors.accent,
  },
  amountBtnText: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  or: {
    color: Colors.secondaryText,
    marginVertical: 6,
  },
  input: {
    backgroundColor: Colors.backgroundGradient[1],
    color: Colors.primaryText,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    width: 180,
    textAlign: 'center',
    marginBottom: 18,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 10,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 4,
  },
  closeBtnText: {
    color: Colors.secondaryText,
    fontSize: 15,
  },
}); 