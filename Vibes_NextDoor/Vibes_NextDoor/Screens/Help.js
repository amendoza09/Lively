import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, TextInput, Alert, ScrollView, TouchableWithoutFeedback } from 'react-native';

import { config } from './config.env';

const HelpScreen = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  


  const handleSubmit = async () => {
    if(!name || !contact || !message) {
      Alert.alert('Please fill out all fields');
      return;
    };
    
    const response = await fetch(`${config.api.HOST}/help`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({ name, contact, message }),
    });

    const data = await response.json();

    if (data.success) {
      Alert.alert('Message sent succesffully');
      setName('');
      setContact('');
      setMessage('');
    } else {
      Alert.alert('Failed to send message. Please try again.');
    }
  }

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
};

const styles = StyleSheet.create({
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
    backgroundColor: '#007AFF',
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