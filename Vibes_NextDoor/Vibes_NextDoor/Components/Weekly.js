import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';

import FeatureSection from '../Components/FeatureSection';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Weekly = ({ events, error, selectedLocation, featured, loading }) => {
  const navigation = useNavigation();
  const [contentHeight, setContentHeight] = useState(0);

  const getImgUrl = (img) => {
    if (!img) return Image.resolveAssetSource(require('../assets/defaultImage.png')).uri;
    return img;
  };

  const LazyImage = ({ uri, style }) => {
    const [loaded, setLoaded] = useState(false);
  
    return (
      <View style={style}>
        {!loaded && <ActivityIndicator size="small" style={StyleSheet.absoluteFill} />}
        <Image
          source={{ uri }}
          style={[style, { opacity: loaded ? 1 : 0 }]}
          resizeMode="cover"
          onLoadEnd={() => setLoaded(true)}
        />
      </View>
    );
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
  }
  
  if(loading && !error) {
    return (
        <View style={styles.loadingContainer}>
          <LottieView 
            source={require('../assets/loadingAnimation.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
    )
  } 

  else if(Object.keys(events).length === 0 && Object.keys(featured).length === 0 && !error && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Nothing in {selectedLocation} yet...</Text>
      </View>
    )
  } else {
    return (
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 190 }}
        crollEnabled={contentHeight > screenHeight}
        onContentSizeChange={(w, h) => setContentHeight(h)}
      >
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
            <View>
              <Text style={styles.title}>Everything else</Text>
              {Object.entries(events).map(([type, events]) => (
                <View key={type}>
                  <Text style={styles.groupTitle}>{type}</Text>
                  <FlatList
                    data={events}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(event) => event._id.toString()}
                    renderItem={({ item: event }) => {
                      const backgroundColor = eventTypeColors[event.type] || eventTypeColors.Default;
                      return (
                        <TouchableOpacity 
                          onPress={() => navigation.navigate('Event Details', { event })}
                        >
                          <View style={[styles.eventCard, { backgroundColor }]}>
                            <View style={styles.imageCard}>
                              <LazyImage uri={getImgUrl(event.image)} style={styles.image} />
                            </View>
                            <View> 
                              <View style={styles.info}> 
                                <Text style={styles.infoText}>{event.time}</Text>
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
              ))}
              </View> 
          </View>
        </ScrollView>
    )
  };
}

const styles = StyleSheet.create({
  loadingContainer: {
    paddingTop: 150,
    alignItems: 'center',
    flex: 1,
  },
  HomeContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
  },
  titleFeature: {
    marginHorizontal: 5,
    marginBottom: 5,
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    width: screenWidth,
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
    width: 250,
    overflow: 'hidden',
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
