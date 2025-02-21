import React from 'react';
import { View, Text, TouchableOpacity,
    FlatList, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingScreen = ({ navigation }) => {
    const settingOptions = [
        { id: '1', name: 'Creator Account', action: () => navigation.navigate('Creator Account') },
        { id: '2', name: 'Privacy', action: () => navigation.navigate('Privacy') },
        { id: '3', name: 'Help', action: () => navigation.navigate('Help') },
        { id: '4', name: 'Feedback & Support', action: () => navigation.navigate('Feedback & Support')},
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
        <View >
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
                    ItemSeperatorComponent={() => <View style={styles.separator} />}

                />
        </View>
    );
};

const styles =StyleSheet.create({
    safeArea: {
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingBottom: -15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
    },
    settingsHeader: {
        textAlign: 'center',
        justifyContent: 'center',
    },
    title: {
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