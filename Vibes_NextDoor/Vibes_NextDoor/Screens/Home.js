import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ScrollView, Image, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { config } from './config.env';
import AppHeader from '../Components/AppHeader';

import Weekly from '../Components/Weekly';
import Calendar from '../Components/Calendar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomeScreen = () => {
  const [events,setEvents] = useState([]); 
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [viewMode, setViewMode] = useState("7-Days");
  const translateX = useRef(new Animated.Value(0)).current;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const interpolateTranslateX = translateX.interpolate({
    inputRange: [0, screenWidth],
    outputRange: [0, -screenWidth],
    extrapolate: 'clamp',
  })

  const onRefresh = async () => {
    setRefreshing(true);
    try{
      fetchEvents();
    } catch(e) {
      console.error("Error refreshing.", e);
    } finally {
      setRefreshing(false);
    }
  }
  
  const groupByType = (events) => {
    return events.reduce((groups, event) => {
      const { type } = event;
      if(!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(event);
      return groups;
    }, {});
  };

  const sevenDays = new Date(currentDate);
  sevenDays.setDate(currentDate.getDate()+7);
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);

    return eventDate >= currentDate && eventDate <= sevenDays;

  }).sort((a,b) => {
    const dateA = new Date (a.date);
    const dateB = new Date (b.date);

    if(dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    } else {
      return a.time.localeCompare(b.time);
    }
  });

  const fetchEvents = async () => {
    try {
      const cityName = selectedLocation.split(',')[0].toLowerCase();
      const response = await fetch(`${config.api.HOST}/event-data/${cityName}`);
      if(!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      const featured = data.filter(event => event.feature === true);
      setFeaturedEvents(featured);
      setEvents(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching events at home page:', error);
      setError('Unable to fetch events. Please try again later.');
    }
  };

  const groupedEvents = groupByType(upcomingEvents);

  useEffect(() => {
    try{
      fetchEvents();
    } catch(e) {
      console.error(e);
    } 
  }, [selectedLocation]);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: viewMode === "Monthly" ? -screenWidth : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [viewMode]);

  return(
    <View style={styles.screen}>
          <AppHeader 
            selectedLocation={selectedLocation} 
            setSelectedLocation={setSelectedLocation} />
          <View style={styles.containerToggle}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity style={[styles.toggleButton, viewMode === "7-Days" && styles.activeButtonWeekly]}
              onPress={() => setViewMode("7-Days")}
              >
                <Text style={styles.toggleText}>Weekly View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleButton, viewMode === "Monthly" && styles.activeButtonMonthly]}
              onPress={() => setViewMode("Monthly")}>
                <Text style={styles.toggleText}>Monthly View</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Animated.View style={{
              flexDirection: 'row',
              width: "200%",
              transform: [{ translateX: translateX }],
            }}>
              <View style={styles.page}>
                <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1}]} 
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                  showsVerticalScrollIndicator={false}
                >
                  <Weekly events={groupedEvents} error={error} selectedLocation={selectedLocation} featured={featuredEvents} />
                </ScrollView>  
              </View>
              <View style={styles.monthPage}>
                <ScrollView style={styles.agendaContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    <Calendar events={events}/>
                </ScrollView>
              </View>
            </Animated.View>
          </View>
    </View>
  )
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
    screen:{
      
    },
    container: {
      paddingBottom: 385,
    },
    viewContainer: {
      alignItems: "center",
      width: "100%",
      backgroundColor: "rgba(0, 0 ,0 ,0)",
    },
    toggleContainer: {
      flexDirection: "row",
      alginItems: 'center',
      justifyContent: "space-around",
      backgroundColor: "#ddd",
      width: 350,
      height: 35,
      borderRadius: 20,
      marginTop: 6,
    },
    containerToggle:{
      height: 50,
      alignItems: 'center',
    },
    toggleButton: {
      alignItems: "center",
      justifyContent: "center",
      width: 175,
    },
    activeButtonWeekly: {
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    },
    activeButtonMonthly: {
      backgroundColor: "white",
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },
    page: {
      width: screenWidth,
      flex: 1,
      flexGrow: 1,
      height: 'auto',
    },
    monthPage: {
      width: screenWidth,
      height: screenHeight,
    },
    agendaContainer: {
      flex: 1,
    }
});


export default HomeScreen;