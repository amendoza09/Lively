import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, RefreshControl, TouchableOpacity,
  Animated, TextInput, Easing, FlatList
} from 'react-native';
import Checkbox from 'expo-checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);

  const translateX = useRef(new Animated.Value(0)).current;
  const [slideAnim] = useState(new Animated.Value(0));
  const [contentAnim] = useState(new Animated.Value(0));
  const [searchSlideAnim] = useState(new Animated.Value(0));
  const [searchContentAnim] = useState(new Animated.Value(0));
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const extractKeywordsFromEvents = (events) => {
    const keywordSet = new Set();
  
    events.forEach(event => {
      const combinedText = [
        event.title,
        event.description,
        event.type,
        event.location,
        event.organizer
      ].join(' ').toLowerCase();
  
      // Split by spaces, remove punctuation, ignore short/common words
      const words = combinedText
        .replace(/[^\w\s]/gi, '') // remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 3 && !['the', 'with', 'from', 'this', 'that', 'have', 'your', 'will', 'event', 'more', 'info'].includes(word));
  
      words.forEach(word => keywordSet.add(word));
    });
  
    return Array.from(keywordSet).slice(0, 30); // limit to 30 keywords
  };

  const onRefresh = async () => {
    setRefreshing(true);
    closeMenu();
    closeSearch();
    setSearchQuery('');
    setSelectedFilters([]);
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
    const inRange = eventDate >= currentDate && eventDate <= sevenDays;

    return inRange;

  }).sort((a,b) => {
    const dateA = new Date (a.date);
    const dateB = new Date (b.date);

    if(dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    } else {
      return a.time.localeCompare(b.time);
    }
  });

  const tags = ['Free', 'Music', 'Food', 'Sports', 'Art', 'Networking', 'Social', 'Markets', 'Other'];

  const fetchEvents = async () => {
    const cityName = selectedLocation.split(',')[0].toLowerCase();
    try{
      const response = await fetch(`${config.api.HOST}/event-data/${cityName}`);
      const data = await response.json();
      const featured = data.filter(event => event.feature === true);

      setFeaturedEvents(featured);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error);
    }
  };

  const groupedEvents = useMemo(() => { 
    return groupByType(upcomingEvents);
  },  [upcomingEvents]);

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
    if (events.length > 0) {
      const keywords = extractKeywordsFromEvents(events);
      setKeywordSuggestions(keywords);
    }
  }, [events]);

  const openMenu = () => {
    if(setShowSearch) {
      closeSearch();
    }
    setShowTagMenu(true);
    Animated.timing(slideAnim, {
      toValue: 220, // Slide up to the top of the header
      duration: 300,
      easing: Easing.out(Easing.ease), 
      useNativeDriver: false,
    }).start();
    Animated.timing(contentAnim, {
      toValue:  220,
      duration: 300,
      easing: Easing.out(Easing.ease), 
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide back down below the header
      duration: 300,
      easing: Easing.out(Easing.ease), 
      useNativeDriver: false,
    }).start(() => {
      setShowTagMenu(false);
    });
    Animated.timing(contentAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease), 
      useNativeDriver: false,
    }).start();      
  };
  
  const openSearch = async () => {
    if(setShowTagMenu) {
      closeMenu();
    }
    setShowSearch(true);
    Animated.timing(searchSlideAnim, {
      toValue: 60, // Slide up to the top of the header
      duration: 300,
      easing: Easing.out(Easing.ease), 
      useNativeDriver: false,
    }).start();
    Animated.timing(searchContentAnim, {
      toValue:  60,
      duration: 300,
      easing: Easing.out(Easing.ease), 
      useNativeDriver: false,
    }).start();
  };

  const closeSearch = () => {
    Animated.timing(searchSlideAnim, {
      toValue: 0, // Slide back down below the header
      duration: 300,
      easing: Easing.out(Easing.ease), 
      useNativeDriver: false,
    }).start(() => {
      setShowSearch(false);
    });
    Animated.timing(searchContentAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease), 
      useNativeDriver: false,
    }).start();      
  };

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: viewMode === "Monthly" ? -screenWidth : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [viewMode]);

  const handleApplyFilters = async () => {
    await fetchEvents();
    closeMenu();

    const activeFilters = Object.keys(selectedFilters).filter(
      (key) => selectedFilters[key]
    );
  
    if (activeFilters.length === 0) {
      return;
    }
    const filtered = events.filter((event) => {
      return activeFilters.every((tag) =>
        event.type.includes(tag) || (tag === "Free" && event.isFree)
      );
    });
    setEvents(filtered);
  };

  const handleApplySearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
        fetchEvents();
        return;
    }
    const lowerCaseQuery = query.toLowerCase();
    const filtered = events.filter((event) =>
        (event.title?.toLowerCase().includes(lowerCaseQuery)) ||
        (event.location?.toLowerCase().includes(lowerCaseQuery)) ||
        (event.organizer?.toLowerCase().includes(lowerCaseQuery)) ||
        (event.type?.toLowerCase().includes(lowerCaseQuery)) || 
        (event.description?.toLowerCase().includes(lowerCaseQuery)) ||
        (event.restrictions?.toLowerCase().includes(lowerCaseQuery))
      );
    setEvents(filtered);
  };

  return(
    <View style={[styles.screen]}>
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
        
            <View style={styles.iconsContainer}>
              <View style={{ flexDirection: 'row'}}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={showTagMenu ? closeMenu : openMenu}>
                  <Text style={{ paddingHorizontal: 5, color:"#999" }}></Text>
                  <Ionicons name="filter-outline" size={20} color="#999"/>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={showSearch ? closeSearch : openSearch}>
                  <Text style={{paddingHorizontal: 5, color:"#999"}}></Text>
                  <Ionicons name="search-outline" size={20} color="#999"/>
                </TouchableOpacity>
              </View>
            </View>
        </View>
        <Animated.View style={[
              styles.modalOverlay, 
              { height: slideAnim },
            ]}>
            {showTagMenu && (
              <Animated.View
                style={[styles.modalContainer, { height: contentAnim, opacity: contentAnim}]}
              >
                <View style={styles.filterContent}>
                  {tags.map((filter) => (
                    <View 
                      key={filter} 
                      style={{ 
                        width: '48%', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        marginVertical: 8,
                      }}
                    >
                      <Checkbox
                        value={!!selectedFilters[filter]}
                        onValueChange={(newValue) =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            [filter]: newValue,
                          }))
                        }
                        color={selectedFilters[filter] ? '#007AFF' : undefined}
                      />
                      <Text style={{ marginLeft: 8 }}>{filter}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', gap: 40, paddingVertical: 10,}}>
                  <TouchableOpacity onPress={handleApplyFilters}>
                    <Text style={{ color: '#5BC0EB' }}>Apply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                      setSelectedFilters([]);
                  }}>

                    <Text style={{ color: '#EB504E' }}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
            </Animated.View>
        
            <Animated.View style={[
              styles.modalOverlay, 
              { height: searchSlideAnim },
            ]}>
              {showSearch && (
                <Animated.View
                  style={[styles.modalContainer, { height: searchContentAnim, opacity: searchContentAnim, paddingTop: 10}]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <TextInput 
                      style={styles.searchInput} 
                      placeholder="Search for a Organizer, Location, Event, etc..."
                      value={searchQuery}
                      onChangeText={handleApplySearch}
                    />
                    <TouchableOpacity onPress={() => {
                      setSearchQuery('');
                      handleApplySearch('');
                      closeSearch();
                    }}>
                      <Ionicons name={"close-outline"} size={20} color={'#EB504E'} style={{ paddingLeft: 10}} />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={events}
                    keyExtractor={(item) => item._id || item.title}
                    renderItem={({ item }) => {
                      <TouchableOpacity 
                        style={styles.searchItem}
                      >
                        <Text style={styles.searchItem}>{item.title}</Text>
                        <Text>{item.location}</Text>
                      </TouchableOpacity>
                    }}
                  />
                </Animated.View>
              )}
          </Animated.View>
        <Animated.View style={{
          flexDirection: 'row',
          width: "200%",
          transform: [{ translateX: translateX }],
          height: screenHeight - 50
        }}> 
        
          <View style={styles.page}>          
              <Weekly 
                events={groupedEvents} 
                error={error} 
                selectedLocation={selectedLocation} 
                featured={featuredEvents} 
                loading={loading}
              />
          </View>
          
            <View style={styles.monthPage}>
              <View style={styles.agendaContainer}>
                <Calendar events={events}/>
              </View>
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
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  modalContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ddd',
    width: screenWidth,
    alignItems: 'center',
  },
  filterContent:{
    justifyContent: 'space-between', 
    flexDirection: 'row', 
    paddingHorizontal: 25, 
    flexWrap: 'wrap'
  },
  searchInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 10,
    width: screenWidth - 70,
},
  container: {
    
  },
  refreshOverlay: {
    height: 70,
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
      justifyContent: "space-around",
      backgroundColor: "#ddd",
      width: '80%',
      height: 35,
      borderRadius: 20,
    },
    containerToggle:{
      flexDirection: "row",
      marginVertical: 5,
      paddingHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "transparent",
    },
    toggleButton: {
      alignItems: "center",
      justifyContent: "center",
      width: '50%',
      backgroundColor: "transparent",
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
    },
    monthPage: {
      width: screenWidth,
      marginTop: 8,
      height: screenHeight - 55,
    },
    agendaContainer: {
      flex: 1,
    }
});


export default HomeScreen;