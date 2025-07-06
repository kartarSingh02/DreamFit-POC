import React, { useState } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import { useTheme } from '../../contexts/ThemeContext';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryText }]}>Register</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.primaryText }]}
        placeholder="Name"
        placeholderTextColor={colors.secondaryText}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.primaryText }]}
        placeholder="Email or Phone Number"
        placeholderTextColor={colors.secondaryText}
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.primaryText }]}
        placeholder="Password"
        placeholderTextColor={colors.secondaryText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={onRegisterSuccess}>
        <Text style={[styles.buttonText, { color: '#fff' }]}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSwitchToLogin}>
        <Text style={[styles.switchText, { color: colors.accent }]}>Already have an account? Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    fontSize: 15,
    marginTop: 8,
  },
}); 