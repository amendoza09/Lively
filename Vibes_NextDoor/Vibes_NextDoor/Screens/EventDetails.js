import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Linking, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ExternalIcon from 'react-native-vector-icons/Feather';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const EventDetailScreen = ({ route }) => {
  const { event } = route.params;

  const getImgUrl = (img) => {
      if (!img) return Image.resolveAssetSource(require('../assets/defaultImage.png')).uri;
      return `data:image/${img.contentType};base64,${img}`;
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

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.imgContainer}>
        <LazyImage uri={getImgUrl(event.image?.data)} style={styles.img} />
      </View>
      <ScrollView style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{event.title}</Text>
        </View> 
        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>{event.time}</Text>
          <Icon name="fiber-manual-record" size={5} style={[styles.timeText, styles.icon]}/>
          <Text style={styles.timeText}>{formatDate.format(new Date(event.date))}</Text>
          <Icon name="fiber-manual-record" size={5} style={[styles.timeText, styles.icon]}/>
          <Text style={styles.type}>{event.type}</Text>
        </View>
        
        <View style={styles.locationInfo}>
          {event.location && (
            <Text style={styles.locationText}>{event.location}</Text>
          )}
          {event.location && event.address && (
            <Icon name="fiber-manual-record" size={5} style={[styles.timeText, styles.icon]}/>
          )}
          {event.address && (
            <Text style={styles.locationAddy}>{event.address}</Text>
          )}
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>{event.description}</Text>
        </View>
        {event.restrictions && (
          <View style={styles.ageRestrictonContainer}>
            <Text style={styles.ageRestrictionText}>Event is {event.restrictions}</Text>
          </View>
        )}
        {event.link && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(event.link)}
            >
              <Text style={styles.linkButtonText}>Tickets</Text>
              <ExternalIcon name="external-link" size={16} color="#fff" style={styles.externalIcon} />
            </TouchableOpacity>
          </View>
        )}
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer:{
    width: screenWidth,
  },
  imgContainer: {
    width: screenWidth,
    height:250,
  },
  infoContainer: {
    paddingHorizontal: 10,
    height: '100%'
  },
  img: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 16,
    color: '#667085',
  },
  timeInfo: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  timeText: {
    color: '#667085',
    fontSize: 16,
  },
  icon: {
    fontSize: 8,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 8,
    marginVertical: 5,
  },
  locationText: {
    color: '#667085',
    fontSize: 16,
  },
  description: {
    marginVertical: 5,
  },
  locationAddy: {
    fontSize: 16,
    color: '#667085',
  },
  descriptionText: {
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: '#007AFF',
    height: 45,
    marginHorizontal: 45,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkButtonText: {
    color: "#fff",
    paddingHorizontal: 5,
    fontSize: 16
  },
  ageRestrictonContainer: {
  },
});

export default EventDetailScreen;