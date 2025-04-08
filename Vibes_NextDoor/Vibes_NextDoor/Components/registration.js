import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpcaity, StyleSheet, Alert } from "react-native";
import { config } from '../Screens/config.env';

const Registration = () => {
    const [organizationName, setOrganizationName] = useState('');
    const [accountOwner, setAccountOwner] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        if (!organizationName || !accountOwner || !email | !password) {
            Alert.alert("Error", "all fields are required.");
            return;
        }

        try {
            const response = await fetch(`${config.api.HOST}/event-data/`, {
                method: "POST",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    organizationName,
                    accountOwner,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if(response.ok) {
                Alert.alert("Success", "Your request has been submitted for approval.");
                setOrganizationName('');
                setAccountOwner('');
                setEmail('');
                setPassword('');
            } else {
                Alert.alert("Error", data.message || "Something went wrong.");
            }
        } catch(error) {
            consol.error("Error submitting request:", error);
            Alert.alert("Error", "Could not submit your request. Please try again later.");
        }
    };

    return (
        <View style={StyleSheet.container}>
            <Text style={styles.title}>Request an Account</Text>
            <TextInput
                style={styles.input}
                placeholder="organization Name"
                value={organizationName}
                onChangeText={setOrganizationName}
            />
            <TextInput
                style={styles.input}
                placeholder="Account Owner"
                value={accountOwner}
                onChangeText={setAccountOwner}
            />
            <TextInput 
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Request</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title:{
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor:"#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor:"#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  bottomText: {
    color:"#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Registration;