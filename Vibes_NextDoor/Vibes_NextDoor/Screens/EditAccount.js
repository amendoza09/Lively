import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity,
  KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback
 } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditAccountScreen = ({ route, navigation }) => {
  const { accountInfo } = route.params;
  const [organizationName, setOrganizationName] = useState(accountInfo.organizationName);
  const [accountOwner, setAccountOwner] = useState(accountInfo.accountOwner);
  const [email, setEmail] = useState(accountInfo.email);
  const [phone, setPhone] = useState(accountInfo.phone);
  const [city, setCity] = useState(accountInfo.city);
  const [location, setLocation] = useState(accountInfo.location);
  const [address1, setAddress1] = useState(accountInfo.address1);
  const [address2, setAddress2] = useState(accountInfo.address2);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const availableCities = [
    'Athens, GA',
  ];

  const scrollViewRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    })      
    return() => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  
  const scrollToInput = (inputRef) => {
    setTimeout(() => {
      inputRef?.current?.measureLayout(
        scrollViewRef.current,
        (_, y) => {
          scrollViewRef.current.scrollTo({ y: y + 20, animated: true });
        }
      );
    }, 100);
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if(!token) {
      Alert.alert('Unauthorized', 'No token found');
      return;
    }

    try {
      const res = await fetch('http://192.168.1.132:10000/account-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ organizationName, accountOwner, email, phone, city, location, address1, address2 }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Account updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error || 'Failed to update account');
      }
    } catch (err) {
      Alert.alert('Network Error', err.message);
    }
  };

  return (
    <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
          style={{flexGrow: 1, backgroundColor: 'transparent'}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} keyboardDismissMode="on-drag">
        <ScrollView style={styles.container}>
          <Text style={styles.label}>Organization Name</Text>
          <TextInput 
            value={organizationName} 
            onChangeText={setOrganizationName} 
            style={styles.input} 
            returnKeyType="done"
            onFocus = {(field) => scrollToInput(field.target)} 
          />

          <Text style={styles.label}>Account Owner</Text>
          <TextInput 
            value={accountOwner} 
            onChangeText={setAccountOwner} 
            style={styles.input} 
            returnKeyType="done"
            onFocus = {(field) => scrollToInput(field.target)}   
          />

          <Text style={styles.label}>Email</Text>
          <TextInput 
            value={email} 
            onChangeText={setEmail} 
            style={styles.input} 
            returnKeyType="done" 
            onFocus = {(field) => scrollToInput(field.target)}   
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput value={phone} keyboardType="phone-pad" onChangeText={setPhone} style={styles.input} returnKeyType="done" />

          <Text style={styles.label}>City:</Text>
          <TouchableOpacity onPress={() => setShowCityPicker(true)}>
            <Text style={styles.input}>{city || "Select a city"}</Text>
          </TouchableOpacity>
          {showCityPicker && (
            <View>
              <View style={{ alignItems: 'flex-end', padding: 10 }}>
                <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                  <Text style={{ color: '#5BC0EB' }}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker 
                selectedValue={city}
                onValueChange={(city) => {
                  if(city) setCity(city);
                }}
              >
                <Picker.Item label="Select city" value=" " />
                {availableCities.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
          )}

          <Text style={styles.label}>Location</Text>
          <TextInput 
            value={location} 
            onChangeText={setLocation} 
            style={styles.input} 
            returnKeyType="done"
            onFocus = {(field) => scrollToInput(field.target)}  
          />

          <Text style={styles.label}>Address line 1</Text>
          <TextInput value={address1} onChangeText={setAddress1} style={styles.input} returnKeyType="done"
            onFocus = {(field) => scrollToInput(field.target)} 
          />

          <Text style={styles.label}>Address line 2</Text>
          <TextInput value={address2} onChangeText={setAddress2} style={styles.input} returnKeyType="done"
            onFocus = {(field) => scrollToInput(field.target)} 
          />

          <TouchableOpacity style={styles.editButton} onPress={handleSave} >
            <Text style={styles.editButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <Button title="Cancel" onPress={() => navigation.goBack()} color="#d9534f" />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 80,
    paddingBottom: 100,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  editButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0275d8',
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default EditAccountScreen;