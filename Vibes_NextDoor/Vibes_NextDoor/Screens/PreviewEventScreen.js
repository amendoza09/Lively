import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { CommonActions } from '@react-navigation/native';

import { config } from './config.env';

const PreviewEventScreen = ({ route, navigation }) => {
  const { eventData, clearForm } = route.params;
  const [loading, setLoading] = useState(false);

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.api.HOST}/pending-events/${eventData.city}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
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
      <ScrollView style={styles.container }>
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
          {eventData.imgUrl == '' && <Image source={{ uri: eventData.imgUrl }} style={{ height: 200, marginVertical: 10 }} />}

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
    flexDirection: 'row'
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
    marginTop: 10,
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