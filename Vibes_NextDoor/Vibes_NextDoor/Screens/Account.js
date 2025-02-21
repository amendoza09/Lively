import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const API_BASE_URL = process.env.REACT_API_URL;

const AccountScreen = ({ email }) => {
    const [accountStatus, setAccountStatus] = useState("Loading");

    useEffect(() => {
        const fetchAccountStatus = async () =>{
            try {
                const response = await fetch(`${API_BASE_URL}/Creator_Account/${email}`);
                const data = await response.json();
            } catch(error) {
                consol.error("Error fetching account status:", error);
                Alert.alert("Error", "Failed to load account status.");
            }
        };
        fetchAccountStatus();
    }, [email]);

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