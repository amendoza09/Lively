import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const StartEventSubmissionScreen = ({ navigation }) => {
    const checkLoggedIn = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if(token) {
        navigation.replace("Submit an Event");
      } 
      return;
    };
    checkLoggedIn();
  
  const handleChoice = (mode) => {
    if(mode === 'account') {
      navigation.navigate('Login');
    } else {
      navigation.navigate('Submit an Event');
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkLoggedIn();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Do you have an account?</Text>
      <TouchableOpacity onPress={() => handleChoice('account')} style={styles.button}>
        <Text style={styles.buttonText}>Yes, I have an account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleChoice('guest')} style={styles.button}>
        <Text>Continue as Guest</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingTop: 150,
    alignItems: 'center', 
    padding: 20,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30
  },
  button: {
    backgroundColor: '#5BC0EB', // blue 
    padding: 15, 
    borderRadius: 8, 
    marginVertical: 10, 
    width: '100%', 
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16
  },
  link: {
    marginTop: 20, 
    fontSize: 14, 
    color: '#5BC0EB', // blue 
    textDecorationLine: 'underline'
  }
});

export default StartEventSubmissionScreen;