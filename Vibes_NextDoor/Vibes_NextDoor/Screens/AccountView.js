import React, { useCallback, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, Alert, Button, TouchableOpacity, 
  RefreshControl, Dimensions
 } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AccountViewScreen = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigation = useNavigation();

  

  const onRefresh = async () => {
    setRefreshing(true);
    try{
      await fetchAccountInfo();
    } catch(e) {
      console.error("Error refreshing.", e);
    } finally {
      setRefreshing(false);
    }
  }
  
  const fetchAccountInfo = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Settings' }],
        })
        return;
      }

      try {
        const res = await fetch('http://192.168.1.132:10000/account-info', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setAccountInfo(data);
        } else {
          Alert.alert('Error', data.error || 'Failed to load account info');
        }
      } catch (err) {
        Alert.alert('Network Error', err.message);
      } finally {
        setLoading(false);
      }
  };

  useFocusEffect( 
    useCallback(() => {
      setLoading(true);
      fetchAccountInfo();
    }, [])
  );

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Settings' }],
    })
  }

  if (loading) return (
    <View>
      {refreshing && (
            <View style={styles.refreshOverlay}>
              <LottieView 
                source={require('../assets/loadingAnimation.json')}
                autoPlay
                loop
                style={{ width: 150, height: 150 }}
              />
            </View>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      {refreshing && (
            <View style={styles.refreshOverlay}>
              <LottieView 
                source={require('../assets/loadingAnimation.json')}
                autoPlay
                loop
                style={{ width: 150, height: 150 }}
              />
            </View>
      )}
      <ScrollView
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['transparent']} tintColor="transparent" />}
              showsVerticalScrollIndicator={false}
      >
      {accountInfo && (
        <>
          <Text style={styles.item}>Organization: {accountInfo.organizationName}</Text>
          <Text style={styles.item}>Owner: {accountInfo.accountOwner}</Text>
          <Text style={styles.item}>Email: {accountInfo.email}</Text>
          <Text style={styles.item}>Phone: {accountInfo.phone}</Text>
          <Text style={styles.item}>City: {accountInfo.city}</Text>
          <Text style={styles.item}>Location: {accountInfo.location}</Text>
          <Text style={styles.item}>Address line 1: {accountInfo.address1}</Text>
          {accountInfo.address2 && (
            <Text style={styles.item}>Address line 2: {accountInfo.address2}</Text>
          )}
          
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("Edit Account", { accountInfo })} >
            <Text style={styles.editButtonText}>Edit Info</Text>
          </TouchableOpacity>
        </>
      )}
      <Button title="Sign Out" onPress={handleSignOut} color="#d9534f" />
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    height: screenHeight
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20 },
  item: { 
    fontSize: 16, 
    marginBottom: 10 
  },
  editButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#5BC0EB',
    borderRadius: 5,
    marginBottom: 20
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  refreshOverlay: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  
});

export default AccountViewScreen;