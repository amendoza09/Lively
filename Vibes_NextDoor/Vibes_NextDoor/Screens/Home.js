import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


import AppHeader from '../Components/AppHeader';
import FeatureSection from '../Components/FeatureSection';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [events,setEvents] = useState([]); 
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(''); 

    const formatDate = new Intl.DateTimeFormat("en-us", {
        weekday: "short",
        month: "short",
        day: "2-digit"
    });

    const getImgUri = (img => {
        return img && img.trim() ? img : 'https://media.istockphoto.com/id/1346125184/photo/group-of-successful-multiethnic-business-team.jpg?s=612x612&w=0&k=20&c=5FHgRQZSZed536rHji6w8o5Hco9JVMRe8bpgTa69hE8='
    })

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

    const groupedEvents = groupByType(events);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const cityName = selectedLocation.split(',')[0].toLowerCase();
                const response = await fetch(`http://192.168.1.132:5500/event-data/${cityName}`);
                if(!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data);

                const featured = data.filter(event => event.feature === true);
                setFeaturedEvents(featured);
                
                setError(null);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Unable to fetch events. Please try again later.');
            }
        };

        fetchEvents();
    }, [selectedLocation]);

    const eventTypeColors = {
        music: '#FFDDC1', // Light Peach
        fitness: '#C1FFD7', // Light Green
        conference: '#D1C4E9',   // Lavender
        art: '#FFCDD2',    // Light Pink
        other: '#E0E0E0', // Light Gray (for unclassified types)
    };
    
    return(
        <View style={styles.screen}>
            <AppHeader 
                selectedLocation={selectedLocation} 
                setSelectedLocation={setSelectedLocation} />
            <ScrollView contentContainerStyle={styles.container} >
                {error && <Text style={styles.errorText}>{error}</Text>}
                    {events.length === 0 && !error ? (
                        <Text style={styles.emptyText}></Text>
                        ): ( 
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
                                                                    source={{ uri: getImgUri(event.img) }} 
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
                                    )
                                }}
                            />  
                        </View> 
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        
    },
    container: {
      flexGrow: 1,
    },
    HomeContainer: {
      height: '100%',
      paddingBottom: 180,
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
        marginTop: 5,
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
    }
});


export default HomeScreen;