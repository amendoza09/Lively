import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsAccountScreen = ({ navigation }) => {

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if(token) {
        navigation.replace("Account View");
      }
    };
    checkLoggedIn();
  }, []);
  
  const handleChoice = (mode) => {
    if(mode === 'account') {
      navigation.navigate('Settings Login');
    } else {
        navigation.navigate('Settings Sign Up')
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Do you have an account?</Text>
      <TouchableOpacity onPress={() => handleChoice('account')} style={styles.button}>
        <Text style={styles.buttonText}>Yes, I have an account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleChoice('guest')} style={styles.button}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center', 
      padding: 20
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

export default SettingsAccountScreen;