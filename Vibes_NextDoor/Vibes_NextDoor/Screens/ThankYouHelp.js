import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const ThankYouHelpScreen = ({ navigation }) => {

  const done = () => navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          state: {
            routes: [{ name: 'Settings' }],
          },
        },
      ],
    })
  );

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/checkAnimation.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
      <Text style={styles.title}>Thank you!</Text>
      <Text style={styles.subtitle}>
        Your submission will be reviewed. We will contact you regarding your issue as soon as possible.
      </Text>
      <TouchableOpacity style={styles.button} onPress={(done)}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 120
    },
    lottie: {
      width: 250,
      height: 250,
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#555',
      textAlign: 'center',
      marginBottom: 30,
    },
    button: {
      backgroundColor: '#000',
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

export default ThankYouHelpScreen;