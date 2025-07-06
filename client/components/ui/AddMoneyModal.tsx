import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface AddMoneyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
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
        <View style={[styles.modal, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.title, { color: colors.primaryText }]}>Add Money</Text>
          <View style={styles.amountRow}>
            {[100, 500, 1000].map(val => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.amountBtn, 
                  { backgroundColor: colors.backgroundGradient[1] },
                  selected === val && { backgroundColor: colors.accent }
                ]}
                onPress={() => { setSelected(val); setCustom(''); }}
              >
                <Text style={[styles.amountBtnText, { color: colors.primaryText }]}>₹{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.or, { color: colors.secondaryText }]}>or</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.backgroundGradient[1],
                color: colors.primaryText
              }
            ]}
            placeholder="Custom amount"
            placeholderTextColor={colors.secondaryText}
            keyboardType="numeric"
            value={custom}
            onChangeText={txt => { setCustom(txt); setSelected(null); }}
            maxLength={6}
          />
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.accent }]} onPress={handleAdd}>
            <Ionicons name="add" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={[styles.addBtnText, { color: '#fff' }]}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeBtnText, { color: colors.secondaryText }]}>Cancel</Text>
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
    borderRadius: 18,
    padding: 28,
    width: 320,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountBtn: {
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginHorizontal: 6,
  },
  amountBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  or: {
    marginVertical: 6,
  },
  input: {
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
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 10,
  },
  addBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 4,
  },
  closeBtnText: {
    fontSize: 15,
  },
}); 