import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { config } from './config.env';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!password || !email) {
      Alert.alert( 'Error', 'Missing required fields' );
      return;
    }
    try {
      const response = await fetch(`${config.api.HOST}/accounts/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if(response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Submit an Event"}],
            })
        )
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch(e) {
      Alert.alert('Network Error', err.message);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Login</Text>

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
        placeholder="Password"
        returnKeyType="done"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Dont have an account? Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 150,
    backgroundColor: '#fff',
    marginBottom: 60,
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

export default LoginScreen;