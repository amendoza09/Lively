import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingScreen = ({ navigation }) => {
    const settingOptions = [
        { id: '1', name: 'My Account', action: () => navigation.navigate("Settings Account Check") },
        { id: '2', name: 'Privacy', action: () => navigation.navigate('Privacy') },
        { id: '3', name: 'Help', action: () => navigation.navigate('Help') },
        { id: '4', name: 'Feedback & Suggestions', action: () => navigation.navigate('Feedback')},
        
    ];

    const renderOption = ({ item }) => (
        <TouchableOpacity
            style={styles.optionContainer}
            onPress={item.action}
        >
            <Text style={styles.optionText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.settingsHeader}>
                    <Text style={styles.title}>Settings</Text>
                </View>
            </SafeAreaView>
                <FlatList
                    data={settingOptions}
                    style={styles.options}
                    keyExtractor={(item) => item.id}
                    renderItem={renderOption}
                    scrollEnabled={false}
                    ItemSeperatorComponent={() => <View style={styles.separator} />}

                />
        </View>
    );
};

const styles =StyleSheet.create({
    safeArea: {
        alignItems: 'center',
        backgroundColor: '#211A1E',
        paddingBottom: -20,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    settingsHeader: {
        textAlign: 'center',
        justifyContent: 'center',
    },
    title: {
        color:'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 16,
    },
    optionContainer: {
        paddingVertical: 16,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginBottom: 1,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
    },
});

export default SettingScreen;