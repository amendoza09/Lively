import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, Alert, Keyboard, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';

import { config } from './config.env';

const FeedbackScreen = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if(!message) {
      Alert.alert('Please fill out message field');
      return;
    };
    
    const response = await fetch(`${config.api.HOST}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({ name, contact, message }),
    });

    const data = await response.json();

    if (data.success) {
      Alert.alert('Thank you for your feedback!');
      setName('');
      setContact('');
      setMessage('');
    } else {
      Alert.alert('Failed to send feedback. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Have feedback?</Text>
        <Text style={styles.subtitle}> We appreciate any feedback and suggestions to make Lively better!</Text>
      
        <TextInput
          placeholder="Your Name (Optional)"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email or Phone (Optional)"
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
          <Text style={styles.buttonText}>Send Feedback</Text>
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

export default FeedbackScreen;