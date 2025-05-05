import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, TextInput, Alert, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import { config } from './config.env';

const HelpScreen = ({ navigation  }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const clearForm = () => {
    setName('');
    setContact('');
    setMessage('');
  }

  const handleSubmit = async () => {
    if(!name || !contact || !message) {
      Alert.alert('Please fill out all fields');
      return;
    };
    setLoading(true);
    
    const response = await fetch(`${config.api.HOST}/help`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({ name, contact, message }),
    });

    const data = await response.json();
    try {
      if (data.success) {
        clearForm();
        navigation.dispatch(
            CommonActions.reset({
            index: 0,
            routes: [{ name: "Thank You Help"}],
          })
        )   
      }
    } catch(e) {
      console.error(error);
      alert("Error submitting form.");
    } finally {
      setLoading(false);
    }
  }

  if(loading){
    return (
      <View style={styles.submissionOverlay}>
        <LottieView 
          source={require('../assets/loadingAnimation.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    )
  } else {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Need Help?</Text>
          <Text style={styles.subtitle}>Fill out the form and we'll get back to you.</Text>

          <TextInput
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email or Phone"
            value={contact}
            onChangeText={setContact}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Your Message"
            value={message}
            onChangeText={setMessage}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
};

const styles = StyleSheet.create({
  submissionOverlay: {
    paddingTop: 150,
    alignItems: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    alignSelf: 'center',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#5BC0EB', // blue
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HelpScreen;