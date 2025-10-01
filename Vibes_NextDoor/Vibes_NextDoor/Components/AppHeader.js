import React, { useState, useEffect } from 'react';
import { 
    View, Text, Pressable, StyleSheet, FlatList, TouchableOpacity,
    Animated, Dimensions, Easing, StatusBar, useColorScheme
} from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const AppHeader = ({ selectedLocation, setSelectedLocation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(110));
  const [contentAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const cities = [
      'Athens, GA',
  ];


  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setSelectedLocation('Permission Denied');
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
        setSelectedLocation('Location Error');
      }
  };

  const handleCitySelect = (city) => {
      setSelectedLocation(city);
      closeMenu();
  };

  const openMenu = () => {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 220, // Slide up to the top of the header
        duration: 300,
        easing: Easing.out(Easing.ease), 
          useNativeDriver: false,
      }).start(() => {
            
      });
      Animated.timing(contentAnim, {
        toValue:  160,
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
    <Animated.View 
      style={[
        styles.modalOverlay, 
        { height: slideAnim },
      ]}
    >
    <StatusBar barStyle="light-content"/>
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
              <AntDesign
                name={modalVisible ? "caret-up" : "caret-down"}
                size={16} 
                style={styles.downArrow}
              />
            </Pressable>
            </View>
            {modalVisible && (
              <Animated.View
                style={[styles.modalContainer, { height: contentAnim, opacity: contentAnim}]}
              >
                <View style={{ alignItems: 'center'}}>
                  <Text style={styles.modalTitle}>Select a City</Text>
                    <FlatList
                      data={cities}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <View>
                          <TouchableOpacity
                            style={styles.cityItem}
                            onPress={() => handleCitySelect(item)}
                          >
                            <Text style={styles.cityText}>{selectedLocation}</Text>
                            <Text style={styles.cityText}>{item}</Text>
                          </TouchableOpacity>
                          <View style={styles.selectSuspense}>
                            <Text style={{ color: 'white'}}>More cities available soon...</Text>
                          </View>
                        </View>
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
        backgroundColor: '#211A1E',
        borderBottomWidth: 1,
        
        // Shadow properties for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        // Elevation for Android
        elevation: 4,
    },
    safeArea: {
        alignItems: 'center',
        justifyContent: 'center',
        width: screenWidth,
        borderColor: '#ddd',
        paddingBottom: -25,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlignVertical: 'center',
        color: 'white',
    },
    cityTitle: {
        color: '#5BC0EB', // blue
        fontSize: 24,
        fontWeight: 'bold',
        textAlignVertical: 'center',
    },
    downArrow: {
        alignSelf: 'center',
        color: 'white',
        paddingHorizontal: 6
    },
    citySelectButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalContainer: {
        zIndex: 1,
        width: screenWidth,
        alignItems: 'center',
        height: 'auto',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white',
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
        paddingBottom: 10,
        color: 'white'
    },
    modalOverlay: {
    },
    selectSuspense: {
        paddingTop: 10,
        alignItems: 'center',
    }
});

export default AppHeader;