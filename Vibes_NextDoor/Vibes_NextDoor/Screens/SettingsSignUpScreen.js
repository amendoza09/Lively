import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native';

import { config } from './config.env';

const SettingsSignUpScreen = ({ navigation }) => {
  const [accountOwner, setAccountOwner] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!password || !email || !organizationName || !accountOwner) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const response = await fetch(`${config.api.HOST}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ accountOwner, organizationName, email, phone, password }),
      });

      const data = await response.json();

      if(response.ok) {
        Alert.alert('Success', 'Account created!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message || 'Signup failed');
      }
    } catch(e) {
      Alert.alert('Network Error', err.message);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Host name"
        returnKeyType="done"
        style={styles.input}
        value={accountOwner}
        onChangeText={setAccountOwner}
      />

      <TextInput
        placeholder="Organization name"
        returnKeyType="done"
        style={styles.input}
        value={organizationName}
        onChangeText={setOrganizationName}
      />

      <TextInput
        placeholder="Email"
        returnKeyType="done"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Phone number (optional)"
        returnKeyType="done"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="number-pad"
      />

      <TextInput
        placeholder="Password"
        returnKeyType="done"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Settings Login")}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    backgroundColor: '#fff',
    marginBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    height: 50, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8,
    paddingHorizontal: 15, 
    marginBottom: 20
  },
  button: {
    backgroundColor: '#5BC0EB', // blue 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16
  },
  link: {
    marginTop: 20, 
    textAlign: 'center', 
    color: '#5BC0EB', 
    textDecorationLine: 'underline'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
},
});

export default SettingsSignUpScreen;