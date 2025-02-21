import React, { useState, useEffect } from 'react';
import { 
    View, Text, Pressable, StyleSheet,
    FlatList, TouchableOpacity,
    Animated, Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const AppHeader = ({ selectedLocation, setSelectedLocation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [slideAnim] = useState(new Animated.Value(-300));
    const [contentAnim] = useState(new Animated.Value(0));
    const navigation = useNavigation();

    const cities = [
        'Charlotte, NC',
        'Atlanta, GA',
        'Athens, GA',
    ];
    
    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setSelectedCity('Permission Denied');
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude})
            if(geocode.length > 0) {
                setSelectedLocation(geocode[0].city + ', ' + geocode[0].region);
            } else {
                setSelectedLocation('Location not found');
            }
        } catch (error) {
            console.error('Error fetching location: ', error);
            setSelectedCity('Location Error');
        }
    };

    const handleCitySelect = (city) => {
        setSelectedLocation(city);
        closeMenu();
    };

    const openMenu = () => {
        setModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0, // Slide up to the top of the header
            duration: 300,
            useNativeDriver: true,
        }).start();
        Animated.timing(contentAnim, {
            toValie: 100,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };
    

    const closeMenu = () => {
        Animated.timing(slideAnim, {
            toValue: -300, // Slide back down below the header
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
        });
        Animated.timing(contentAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleSearchPress = () => {
        navigation.navigate('Search', { setSelectedLocation });
        closeMenu();
    }

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>Discover </Text>
                        <Pressable 
                            style={styles.citySelectButton}
                            onPress={modalVisible ? closeMenu : openMenu}
                        >
                            <Text style={styles.title}>{selectedLocation || 'Select a City'}</Text>
                            <ArrowIcon 
                                name={modalVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                size={24} 
                                style={styles.downArrow} 
                            />
                        </Pressable>
                    </View>
                    {modalVisible && (
                        <Animated.View style={[
                            styles.modalOverlay, 
                            { transform: [{ translateY: slideAnim }] },
                        ]}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Select a City</Text>
                                <FlatList
                                    data={cities}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.cityItem}
                                            onPress={() => handleCitySelect(item)}
                                        >
                                            <Text style={styles.cityText}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <Pressable style={styles.searchBar} onPress={handleSearchPress}>
                                    <Text style={styles.cityItem}>Search...</Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    )}
                    <Animated.View
                    style={[
                        styles.content, 
                        { transform: [{ translateY: contentAnim }] }, // Animate content position
                    ]}
                ></Animated.View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    safeArea: {
        zIndex: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        width: screenWidth,
        paddingBottom: -15,
        borderColor: '#ddd',
        borderRadius: 35,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlignVertical: 'center',
    },
    downArrow: {
        alignSelf: 'center',
    },
    citySelectButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalContainer: {
        zIndex: 0,
        width: screenWidth,
        backgroundColor: 'white',
        height: 210,
        paddingTop: 15,
        alignItems: 'center',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cityItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: '100%',
        alignItems: 'center',
    },
    cityText: {
        fontSize: 16,
    },

});

export default AppHeader;