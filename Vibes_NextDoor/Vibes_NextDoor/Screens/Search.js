import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, 
    Text, StyleSheet, 
    TextInput, FlatList 
} from 'react-native';
import { config } from './config.env';

// search feature will come soon

const API_BASE_URL = process.env.REACT_API_URL || 'https://localhost:5500';

const SearchScreen = ({ route, navigation }) => {
    const { setSelectedLocation } = route.params;
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [allCities, setAllCities] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(null);

    const stateAbrev = {
            charlotte: 'NC',
            asheville: 'NC',
            atlanta: 'GA',
            athens: 'GA',
            chicago: 'IL',
            houston: 'TX',
            'los angeles': 'CA',
            'new york city': 'NY',
            philadelphia: 'PA',
            phoenix: 'AZ',
    };
    
    const formatCity = (cityName) => {
        const lowerCityName = cityName.toLowerCase();
        const state = stateAbrev[lowerCityName];
        const capitalizedCity = lowerCityName.split(/[\s\-]/).map(word => word.charAt(0).toUpperCase()+word.slice(1)).join(' ');
        return `${capitalizedCity}, ${state}`;
    };

    useEffect(() => {
        const fetchCities = async () => {
            try { 
                setLoading(true);
                const response = await fetch(`${config.api.HOST}/event-data/City`);
                if(!response.ok) {
                    throw new Error('failed to fetch cities');
                }
                const data = await response.json();

                const formattedCity = data.map((city) => formatCity(city));
                setAllCities(formattedCity);
                setError(null);
            } catch (err) {
                console.error('Error fetching cities at search page:', err);
                setError('Unable to fetch Cities. Please try again lateer.');
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredCities([]);
        } else {
            const relevantCities = allCities.filter((city) =>
                city.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredCities(relevantCities);
        }
    };
    const handleCitySelect = (city) => {
        navigation.goBack();
        setSelectedLocation(city);
    };

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.searchInput} 
                placeholder="Search for a city..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            {loading && <Text style={styles.laodingTest}>Loading...</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {!loading && !error && filteredCities.length > 0 ? (
                <FlatList
                    data={filteredCities}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.cityItem}
                            onPress={() => handleCitySelect(item)}
                        >
                            <Text style={styles.cityText}>{item}</Text>
                        </TouchableOpacity>
                    )} 
                    />
            ) : (
                <Text style={styles.noResults}>
                    {searchQuery ? 'Nothing here yet' : ''}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 18, 
        backgroundColor: 'white' 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold',
        marginBottom: 20 
    },
    searchInput: { 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 8, 
        padding: 10, 
        marginBottom: 20 
    },
    cityItem: {
        padding: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ddd' 
    },
    cityText: { 
        fontSize: 16, 
        color: '#333' 
    },
});

export default SearchScreen;