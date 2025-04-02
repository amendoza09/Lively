import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ScrollView, Image, RefreshControl, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AppHeader from '../Components/AppHeader';
import FeatureSection from '../Components/FeatureSection';
import MonthlyView from '../Components/monthlyView';
import Calendar from '../Components/Calendar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const API_BASE_URL = process.env.HOST || 'http://192.168.254.6:5500';
const PORT = process.env.PORT;

const HomeScreen = ({ navigation }) => {
  const [events,setEvents] = useState([]); 
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("7-Days");
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const formatDate = new Intl.DateTimeFormat("en-us", {
    weekday: "short",
    month: "short",
    day: "2-digit"
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try{
      const cityName = selectedLocation.split(',')[0].toLowerCase();
      const response = await fetch(`${API_BASE_URL}/event-data/${cityName}`);
      if(!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);

      const featured = data.filter(event => event.feature === true);
      setFeaturedEvents(featured);
                  
      setError(null);

    } catch(e) {
      console.error("Error refreshing.", e);
    } finally {
      setRefreshing(false);
    }
  })
  

  const getImgUrl = (img) => {
    if(!img) return 'https://media.istockphoto.com/id/1346125184/photo/group-of-successful-multiethnic-business-team.jpg?s=612x612&w=0&k=20&c=5FHgRQZSZed536rHji6w8o5Hco9JVMRe8bpgTa69hE8=';
    return events.imgUrl;
  };

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

    if(viewMode === "7-Days") {
      return eventDate >= currentDate && eventDate <= sevenDays;
    } else if(viewMode === "Monthly") {
      return events;
    }

    return false;
  }).sort((a,b) => {
    const dateA = new Date (a.date);
    const dateB = new Date (b.date);

    if(dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    } else {
      return a.time.localeCompare(b.time);
    }
  });


  const groupedEvents = groupByType(upcomingEvents);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const cityName = selectedLocation.split(',')[0].toLowerCase();
        const response = await fetch(`${API_BASE_URL}/event-data/${cityName}`);
        if(!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        const featured = data.filter(event => event.feature === true);
        setFeaturedEvents(featured);
        setError(null);
      } catch (error) {
        console.error('Error fetching events at home page:', error);
        setError('Unable to fetch events. Please try again later.');
      }
    };

    fetchEvents();
  }, [selectedLocation]);

  const eventTypeColors = {
    Music: '#FFDDC1', // Light Peach
    Fitness: '#C1FFD7', // Light Green
    Conference: '#D1C4E9',   // Lavender
    Art: '#FFCDD2',    // Light Pink
    Social: '#a6f1a6', // white
    Other: '#E0E0E0', // Light Gray (for unclassified types)
  };
    
  return(
    <View style={styles.screen}>
      <AppHeader 
        selectedLocation={selectedLocation} 
        setSelectedLocation={setSelectedLocation} />
      <View style={styles.viewContainer}>
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
      {viewMode === "Monthly" ? (
        <ScrollView style={styles.agendaContainer} 
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.monthlyViewContainer}>
              <Calendar events={events}/>
            </View>
          </ScrollView>
      ) : (
        <ScrollView style={styles.container} 
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {events.length === 0 && !error ? (
            <Text style={styles.emptyText}></Text>
          ) : ( 
            <View>
                <Text style={styles.titleFeature}>Featured</Text>
                <FeatureSection data={featuredEvents} />
            </View>
          )}
          <View style={styles.HomeContainer}>
              {error && <Text style={styles.errorText}>{error}</Text>}
              {events.length === 0 && !error ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nothing in {selectedLocation} yet...</Text>
                </View>
              ): (
                <View>
                  <Text style={styles.title}>Everything else</Text>
                  <FlatList
                    data={Object.entries(groupedEvents)}
                    keyExtractor={(item) => item[0]}
                    renderItem={({ item }) => {
                    const [type, events] = item;

                    return (
                      <View style={styles.cardConatiners}>
                        <Text style={styles.groupTitle}>{type}</Text>
                        <FlatList
                          data={events}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          keyExtractor={(event) => event._id.toString()}
                          renderItem={({ item: event }) => {
                            const backgroundColor = eventTypeColors[event.type] || eventTypeColors.Default;
                            return(
                              <View style={[styles.eventCard, { backgroundColor }]}>
                                <View style={styles.imageCard}>
                                  <Image 
                                    source={{ uri: getImgUrl(event.imgUrl) }} 
                                    style={styles.image} 
                                    resizeMode="cover" 
                                  />
                                </View>
                                <View> 
                                  <View style={styles.info}> 
                                    <Text style={styles.infoText}>{event.time} </Text>
                                    <Icon name="fiber-manual-record" size={5} style={[styles.infoText, styles.icon]}/>
                                    <Text style={styles.infoText}>{formatDate.format(new Date(event.date))}</Text>
                                  </View>
                                  <View style={styles.description}>
                                    <Text style={styles.eventTitle}>{event.title}</Text>
                                    <Text>{event.location}</Text>
                                  </View>
                                </View>
                              </View>
                            )
                          }}
                        />
                      </View>
                    )}}
                  />  
                </View> 
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
    screen:{
        flex: 1,
    },
    container: {
      display: "flex"
    },
    agendaContainer: {
      height: screenHeight,
    },
    HomeContainer: {
      height: '100%',
      marginBottom: 225
    },
    emptyContainer: {
        width: screenWidth,
        height: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    title: {
        paddingLeft: 10,
        fontSize: 24,
        fontWeight: 'bold',
    },
    titleFeature: {
        PaddingLeft: 5,
        margin: 5,
        marginBottom: 5,
        fontSize: 24,
        fontWeight: 'bold',
    },
    eventCard: {
        backgroundColor: 'white',
        paddingBottom: 2,
        marginBottom: 25,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageCard: {
        width: 250,
        height: 150,  
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        alignItems: 'center',
        justifyContent: 'center', 
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 7,
    },
    infoText: {
        marginTop: 5,
        marginRight: 8,
        color: '#667085'
    },
    icon: {
        marginLeft: -1,
    },
    image: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        width: '100%',
        height: '100%',
    },
    cardConatiners: {
        
    },
    description: {
        paddingLeft: 7,
        paddingBottom: 5,
    },
    groupTitle: {
        paddingLeft: 10,
    },
    viewContainer: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      backgroundColor: "rgba(0, 0 ,0 ,0)",
    },
    toggleContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: "#ddd",
      width: 350,
      height: 35,
      borderRadius: 20,
      marginTop: 8,
    },
    toggleButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "175",
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
    monthlyViewContainer: {
      width: screenWidth,
      marginTop: 10,
    }
});


export default HomeScreen;