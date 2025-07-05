import React, { useState } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState<{ name: boolean; phone: boolean }>({ name: false, phone: false });
  const [showErrors, setShowErrors] = useState(false);

  const handleSignIn = () => {
    setShowErrors(true);
    setTouched({ name: true, phone: true });
    if (name.trim() && phone.trim()) {
      onLoginSuccess();
    }
  };

  const nameError = showErrors && !name.trim();
  const phoneError = showErrors && !phone.trim();

  return (
    <LinearGradient
      colors={Colors.backgroundGradient as [string, string, string]}
      style={styles.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.5, 1]}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          {/* Replace with your logo if available */}
          <Text style={styles.logo}>DreamFit</Text>
        </View>
        <Text style={styles.welcome}>Welcome! Let's get you moving.</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Name</Text>
            <Text style={styles.asterisk}>*</Text>
          </View>
          <TextInput
            style={[styles.input, nameError && styles.inputError]}
            placeholder="Enter your name"
            value={name}
            onChangeText={text => { setName(text); setTouched(t => ({ ...t, name: true })); }}
            placeholderTextColor="#aaa"
            onBlur={() => setTouched(t => ({ ...t, name: true }))}
          />
          {nameError && <Text style={styles.errorText}>Name is required</Text>}

          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <Text style={styles.asterisk}>*</Text>
          </View>
          <TextInput
            style={[styles.input, phoneError && styles.inputError]}
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={text => { setPhone(text); setTouched(t => ({ ...t, phone: true })); }}
            keyboardType="phone-pad"
            maxLength={15}
            placeholderTextColor="#aaa"
            onBlur={() => setTouched(t => ({ ...t, phone: true }))}
          />
          {phoneError && <Text style={styles.errorText}>Phone number is required</Text>}

          <View style={styles.inputLabelRow}>
            <Text style={styles.inputLabel}>Email</Text>
            <Text style={styles.optionalLabel}>(optional)</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter your email (optional)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity
            style={[styles.button, (!(name.trim() && phone.trim())) && styles.buttonDisabled]}
            onPress={handleSignIn}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 4,
  },
  welcome: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 32,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    width: '100%',
  },
  inputLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  asterisk: {
    color: '#FF5252',
    marginLeft: 2,
    fontSize: 15,
    fontWeight: 'bold',
  },
  optionalLabel: {
    color: '#aaa',
    marginLeft: 4,
    fontSize: 13,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(18,45,45,0.85)',
    color: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF5252',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 13,
    marginBottom: 8,
    width: '100%',
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#00C2A0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#6ad7c2',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 