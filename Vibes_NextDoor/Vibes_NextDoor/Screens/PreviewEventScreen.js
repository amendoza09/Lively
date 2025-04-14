import React from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet, TouchableOpacity } from 'react-native';
import config from './config.env';

const PreviewEventScreen = ({ route, navigation }) => {
  const { eventData } = route.params;

  const handleFinalSubmit = async () => {
    try {
      const response = await fetch(`${config.api.HOST}/pending-events/${eventData.city}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alert("Event successfully saved!");
        onSubmit(eventData);
        navigation.navigate('Home');
      } else {
        alert("Failed to save event. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting event.");
    }
  };

  return (
    <ScrollView style={styles.container }>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Preview</Text>
      </View>
      <View>
        <Text>Title: {eventData.title}</Text>
        <Text>Location: {eventData.location}</Text>
        <Text>Address: {eventData.address}</Text>
        <Text>Date: {eventData.date}</Text>
        <Text>Time: {eventData.time}</Text>
        <Text>Type: {eventData.type}</Text>
        <Text>Description: {eventData.description}</Text>
        <Text>Email: {eventData.email}</Text>
        <Text>Phone: {eventData.phone}</Text>
        <Text>Restrictions: {eventData.restrictions}</Text>
        <Text>External Link: {eventData.externalLink}</Text>
        {eventData.imgUrl && <Image source={{ uri: eventData.imgUrl }} style={{ height: 200, marginVertical: 10 }} />}

        <TouchableOpacity style={styles.editButton} onPress={() => navigation.goBack()}>
              <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleFinalSubmit}>
              <Text style={styles.submitText}>Confirm & Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titleContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  editText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default PreviewEventScreen;