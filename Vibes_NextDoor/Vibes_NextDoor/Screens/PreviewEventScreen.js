import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Button, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { CommonActions } from '@react-navigation/native';
import { storage } from '../Components/firebase';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


import { config } from './config.env';

const PreviewEventScreen = ({ route, navigation }) => {
  const { eventData, clearForm } = route.params;
  const [loading, setLoading] = useState(false);
  
  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      let imageUrl = '';

      imageUrl = await uploadImageToFirebase(eventData.image);
      
      const payload = {
        city: eventData.city,
        title: eventData.title,
        location: eventData.location,
        address: eventData.address,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        type: eventData.type,
        description: eventData.description,
        isFree: eventData.isFree,
        feature: false,
        status: 'pending',
        email: eventData.email,
        phone: eventData.phone,
        restrictions: eventData.restrictions,
        createdAt: new Date().toISOString(),
        link: eventData.externalLink || '',
      };
      
      const response = await fetch(`${config.api.HOST}/pending-events/${eventData.city}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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

  const uploadImageToFirebase = async (imageUri) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
  
    const fileName = `lively/${Date.now()}.jpg`;
    const imageRef = ref(storage, fileName);
  
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);
  
    return downloadURL;
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
            <Text style={styles.infoTitle}>Start Date:</Text><Text>{eventData.startDate}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>End Date:</Text><Text>{eventData.endDate}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Start Time:</Text><Text>{eventData.startTime}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>End Time:</Text><Text>{eventData.endTime}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Type:</Text><Text>{eventData.type}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoTitle}>Event is Free:</Text><Text>{eventData.isFree}</Text>
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
          {eventData.image && 
            <Image source={{ uri: eventData.image }} style={{ height: 200, marginVertical: 10 }} />
          }
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