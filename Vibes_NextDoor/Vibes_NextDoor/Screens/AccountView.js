import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountViewScreen = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
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

    fetchAccountInfo();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account Information</Text>
      {accountInfo && (
        <>
          <Text style={styles.item}>Organization: {accountInfo.organizationName}</Text>
          <Text style={styles.item}>Owner: {accountInfo.accountOwner}</Text>
          <Text style={styles.item}>Email: {accountInfo.email}</Text>
          <Text style={styles.item}>Phone: {accountInfo.phone}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  item: { fontSize: 16, marginBottom: 10 },
});

export default AccountViewScreen;