import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';

const screenWidth = Dimensions.get("window").width;

const FeatureSection = ({ data }) => {
    const flatListRef = useRef();
    const [activeIndex, setActiveIndex] = useState(0);

    const getItemLayout = (data, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index: index,
    });

    const getImgUri = (img => {
        return img && img.trim() ? img : 'https://media.istockphoto.com/id/1346125184/photo/group-of-successful-multiethnic-business-team.jpg?s=612x612&w=0&k=20&c=5FHgRQZSZed536rHji6w8o5Hco9JVMRe8bpgTa69hE8='
    })

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = scrollPosition / screenWidth;

        setActiveIndex(index);
    };

    const renderDots = () => {
        return data.map((dot, index) => {
            if(activeIndex === index) {
                return(
                    <View style={styles.activeDot}></View>
                );
            } else {
                return(
                    <View key={index} style={styles.dot}></View>
                );
            }
        });
    };

    const formatDate = new Intl.DateTimeFormat("en-us", {
        weekday: "short",
        month: "short",
        day: "2-digit"
    });

    return (
        <View style={styles.featureContainer}>
            <FlatList 
                ref={flatListRef}
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout}
                data={data}
                renderItem={({ item }) => (
                    <View style={styles.eventCard}>
                        <Image 
                            source={{ uri: getImgUri(item.img) }} 
                            style={styles.image} 
                            resizeMode="cover" 
                        />
                        <BlurView 
                            style={styles.featureInfo}
                            intensity={50} tint="dark"
                        >  
                            <View style={styles.info}> 
                                <Text style={styles.infoText}>{item.time} </Text>
                                <Icon name="fiber-manual-record" size={5} style={[styles.infoText, styles.icon]}/>
                                <Text style={styles.infoText}>{formatDate.format(new Date(item.date))}</Text>
                            </View>
                            <View style={styles.description}>
                                <Text style={styles.eventTitle}>{item.title}</Text>
                                <Text style={styles.infoText}>{item.location}</Text>
                            </View>
                        </BlurView>
                    </View>
                )}
                keyExtractor={(item)=>item._id.toString()}
                horizontal={true} 
                pagingEnabled={true}
                onScroll={handleScroll}
            />
            <View style={styles.dotContainer}>
                {renderDots()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create ({
    featureContainer: {
        width: screenWidth,
        backgroundColor: 'transparent',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        padding: 16,
    },
    eventCard: {
        width: screenWidth,
        height: 200,
        marginBottom: 10,
    },
    image: {
        width: screenWidth,
        height: 200,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#C4C4C4'
    },
    activeDot:{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black',
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 10,
    },
    featureInfo: {
        position: 'absolute',
        bottom: 0, 
        left: 0,
        right: 0,  
        padding: 10,
        justifyContent: 'center',
        
    },
    info: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    infoText: {
        marginRight: 8,
        color: 'white',
    },
});

export default FeatureSection;