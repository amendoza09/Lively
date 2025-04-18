import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Button, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { CommonActions } from '@react-navigation/native';

import { config } from './config.env';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PreviewEventScreen = ({ route, navigation }) => {
  const { eventData, clearForm } = route.params;
  const [loading, setLoading] = useState(false);

  const formData = new FormData();

  formData.append('city', eventData.city);
  formData.append('title', eventData.title);
  formData.append('location', eventData.location);
  formData.append('address', eventData.address);
  formData.append('date', eventData.date);
  formData.append('time', eventData.time);
  formData.append('type', eventData.type);
  formData.append('description', eventData.description);
  formData.append('feature', false); // or whatever you want
  formData.append('status', 'pending'); // or default
  formData.append('email', eventData.email);
  formData.append('phone', eventData.phone);
  formData.append('restrictions', eventData.restrictions);
  formData.append('createdAt', new Date().toISOString());
  formData.append('link', eventData.externalLink || '');

  if (eventData.image) {
    const filename = eventData.image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename ?? '');
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('image', {
      uri: eventData.image,
      name: filename,
      type,
    });
  }

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.1.17:1000/pending-events/${eventData.city}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData,
      });

      if (response.ok) {
        clearForm();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Thank You"}],
          })
        )}
    } catch (error) {
      console.error(error);
      alert("Error submitting event.");
    } finally{
      setLoading(false);
    }
  };

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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Preview</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Title: </Text><Text>{eventData.title}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Location:</Text><Text>{eventData.location}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Address:</Text><Text>{eventData.address}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Date:</Text><Text>{eventData.date}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Time:</Text><Text>{eventData.time}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Type:</Text><Text>{eventData.type}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Description:</Text><Text>{eventData.description}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Email:</Text><Text>{eventData.email}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Phone:</Text><Text>{eventData.phone}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Restrictions:</Text><Text>{eventData.restrictions}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>External Link:</Text><Text>{eventData.externalLink}</Text>
          </View>
          {eventData.image && <Image source={{ uri: eventData.image }} style={{ height: 200, marginVertical: 10 }} />}

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
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingBottom: 200,
  },
  titleContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContainer:{
    flexDirection:'column',
    gap: 8,
  },
  infoLine: {
    flexDirection: 'row',
    width: 250,
  },
  infoTitle: {
    color: '#707070',
    width: 100,
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
  },
  editText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submissionOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
})

export default PreviewEventScreen;