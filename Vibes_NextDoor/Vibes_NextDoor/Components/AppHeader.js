import React, { useState, useEffect } from 'react';
import { 
    View, Text, Pressable, StyleSheet,
    FlatList, TouchableOpacity,
    Animated, Dimensions, Easing
} from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const AppHeader = ({ selectedLocation, setSelectedLocation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [slideAnim] = useState(new Animated.Value(110));
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
            toValue: 275, // Slide up to the top of the header
            duration: 300,
            easing: Easing.out(Easing.ease), 
            useNativeDriver: false,
        }).start(() => {
            
        });
        Animated.timing(contentAnim, {
            toValue:  165,
            duration: 300,
            easing: Easing.out(Easing.ease), 
            useNativeDriver: false,
        }).start();
        
    };
    

    const closeMenu = () => {
        
        Animated.timing(slideAnim, {
            toValue: 110, // Slide back down below the header
            duration: 300,
            easing: Easing.out(Easing.ease), 
            useNativeDriver: false,
        }).start(() => {
            setModalVisible(false);
        });
        Animated.timing(contentAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease), 
            useNativeDriver: false,
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
      <Animated.View style={[
        styles.modalOverlay, 
        { height: slideAnim },
      ]}>
        <View style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>Discover </Text>
                  <Pressable 
                    style={styles.citySelectButton}
                    onPress={modalVisible ? closeMenu : openMenu}
                  >
                    <Text style={styles.cityTitle}>{selectedLocation || 'Select a City'}</Text>
                      <ArrowIcon 
                        name={modalVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={24} 
                        style={styles.downArrow} 
                      />
                  </Pressable>
              </View>
              {modalVisible && (
                      <Animated.View
                      style={[styles.modalContainer, { height: contentAnim, opacity: contentAnim}]}
                      >
                        <View>
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
                                {/* search feature will come soon
                                <Pressable style={styles.searchBar} onPress={handleSearchPress}>
                                    <Text style={styles.cityItem}>Search...</Text>
                                </Pressable>
                                */}
                            </View>
                      </Animated.View>
                    )}
            </View>
          </SafeAreaView>
        </View>
      </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    safeArea: {
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: screenWidth,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingBottom: -25
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlignVertical: 'center',
    },
    cityTitle: {
        color: '#2196f3',
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
        zIndex: 1,
        width: screenWidth,
        backgroundColor: 'white',
        alignItems: 'center',
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
    modalOverlay: {
        heght: 300,
    },

});

export default AppHeader;