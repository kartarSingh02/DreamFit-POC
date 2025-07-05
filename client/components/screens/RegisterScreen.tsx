import React, { useState } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email or Phone Number"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={onRegisterSuccess}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSwitchToLogin}>
        <Text style={styles.switchText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A2222',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#122D2D',
    color: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00C2A0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    color: '#00C2A0',
    fontSize: 15,
    marginTop: 8,
  },
}); 