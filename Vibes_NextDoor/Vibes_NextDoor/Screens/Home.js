import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, RefreshControl, TouchableOpacity, Animated } from 'react-native';

import { config } from './config.env';
import AppHeader from '../Components/AppHeader';
import Weekly from '../Components/Weekly';
import Calendar from '../Components/Calendar';
import LottieView from 'lottie-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomeScreen = () => {
  const [events,setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [viewMode, setViewMode] = useState("7-Days");
  const translateX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const onRefresh = async () => {
    setRefreshing(true);
    try{
      await fetchEvents();
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
    const cityName = selectedLocation.split(',')[0].toLowerCase();
    const response = await fetch(`${config.api.HOST}/event-data/${cityName}`);

    const data = await response.json();
    const featured = data.filter(event => event.feature === true);
    setFeaturedEvents(featured);
    setEvents(data);
  };

  const groupedEvents = groupByType(upcomingEvents);

  useEffect(() => {
    const loadEvents = async () => {
      try{
        setLoading(true);
        await fetchEvents();
      } catch(e) {
        setError('Unable to fetch events. Please try again later.');
      } finally {
        setError(null);
        setLoading(false);
      }
    };
    loadEvents();
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
        setSelectedLocation={setSelectedLocation}
      />
      {refreshing && (
        <View style={styles.refreshOverlay}>
          <LottieView 
            source={require('../assets/loadingAnimation.json')}
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
        </View>
      )}
      <Animated.View
        style={{
          opacity: scrollY.interpolate({
            inputRange: [0, 20],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          }),
          position: 'absolute',
          top: 10,
          alignSelf: 'center',
          zIndex: 10,
        }}
      >
      </Animated.View>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['transparent']} tintColor="transparent" />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerToggle}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity style={[styles.toggleButton, viewMode === "7-Days" && styles.activeButtonWeekly]}
              onPress={() => setViewMode("7-Days")}
            >
              <Text style={styles.toggleText}>Weekly View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleButton, viewMode === "Monthly" && styles.activeButtonMonthly]}
              onPress={() => setViewMode("Monthly")}
            >
              <Text style={styles.toggleText}>Monthly View</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Animated.View style={{
          flexDirection: 'row',
          width: "200%",
          transform: [{ translateX: translateX }],
        }}>      
          <View style={styles.page}>          
            <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1}]} >
              <Weekly 
                events={groupedEvents} 
                error={error} 
                selectedLocation={selectedLocation} 
                featured={featuredEvents} 
                loading={loading} 
              />
            </ScrollView>
          </View>
          <View style={styles.monthPage}>
            <ScrollView style={styles.agendaContainer}>
              <Calendar events={events}/>
            </ScrollView>
          </View>
        </Animated.View>
      </ScrollView>
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
  container: {
  },
  refreshOverlay: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
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
    },
    containerToggle:{
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
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
    },
    monthPage: {
      width: screenWidth,
      marginTop: 8,
    },
    agendaContainer: {
      flex: 1,
    }
});


export default HomeScreen;