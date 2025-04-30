import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { config } from './config.env';

const { width: screenWidth } = Dimensions.get('window');

const AccountScreen = ({ navigation }) => {

    useEffect(() => {
        const checkLoggedIn = async () => {
          const token = await AsyncStorage.getItem('userToken');
          if(token) {
            handleChoice("logged in")
          }
        };
        checkLoggedIn();
      }, []);
    }

    const handleChoice = (mode) => {
      if(mode === 'logged in') {
      navigation.navigate('Login');
      } else {
      navigation.navigate('SignUp');
    }

    return (
        <View style={styles.emptyContainer} >
            <Text>Creator Accounts are coming soon...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    emptyContainer: {
        width: screenWidth,
        height: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
});

export default AccountScreen;