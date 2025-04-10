import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';

import FeatureSection from '../Components/FeatureSection';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Weekly = ({ events, error, selectedLocation, featured }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const getImgUrl = (img) => {
    if(!img) return 'https://media.istockphoto.com/id/1346125184/photo/group-of-successful-multiethnic-business-team.jpg?s=612x612&w=0&k=20&c=5FHgRQZSZed536rHji6w8o5Hco9JVMRe8bpgTa69hE8=';
    return img;
  };

  const formatDate = new Intl.DateTimeFormat("en-us", {
    weekday: "short",
    month: "short",
    day: "2-digit"
  });

  const eventTypeColors = {
    Music: '#FFDDC1', // Light Peach
    Fitness: '#C1FFD7', // Light Green
    Conference: '#D1C4E9',   // Lavender
    Art: '#FFCDD2',    // Light Pink
    Social: '#a6f1a6', // white
    Other: '#E0E0E0', // Light Gray (for unclassified types)
  };
  
  const loadingAnimation = () => {
    return (
      <View style={styles.loadingContainer}>
        <LottieView 
          source={require('../assets/loadingAnimation.json')}
          autoplay
          loop
        />
      </View>
    )
  };

  return (
    <>
      {loading && events.length === 0 || error ? (
        loadingAnimation()
      ) : (
        <>
          {error && <Text>{error}</Text>}
          {featured.length === 0 && !error ? (
            <Text></Text>
            ) : ( 
              <View>
                <Text style={styles.titleFeature}>Featured</Text>
                <FeatureSection data={featured} />
              </View>
            )
          }
          <View style={styles.HomeContainer}>
            {error && <Text>{error}</Text>}
            {events.length === 0 && !error ? (
              <View style={styles.emptyContainer}>
                <Text>Nothing in {selectedLocation} yet...</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.title}>Everything else</Text>
                <FlatList
                  data={Object.entries(events)}
                  keyExtractor={(item) => item[0]}
                  renderItem={({ item }) => {
                    const [type, events] = item;
                    return (
                      <View>
                        <Text style={styles.groupTitle}>{type}</Text>
                        <FlatList
                          data={events}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          keyExtractor={(event) => event._id.toString()}
                          renderItem={({ item: event }) => {
                            const backgroundColor = eventTypeColors[event.type] || eventTypeColors.Default;
                            return(
                              <TouchableOpacity 
                                onPress={() => navigation.navigate('Event Details', { event })}
                              >
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
                              </TouchableOpacity>
                            )
                          }}
                        />
                      </View>
                    );
                  }}
                />
              </View> 
            )}
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  HomeContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    height: 'auto'
  },
  titleFeature: {
    margin: 5,
    marginBottom: 5,
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    width: screenWidth,
    height: screenHeight,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    paddingLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  groupTitle: {
    paddingLeft: 10,
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
  imageCard: {
    width: 250,
    height: 150,  
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  image: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '100%',
    height: '100%',
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
  description: {
    paddingLeft: 7,
    paddingBottom: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Weekly;
