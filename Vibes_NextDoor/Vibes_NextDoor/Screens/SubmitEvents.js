import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback
  } from 'react-native';
import { config } from './config.env';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import LottieView from 'lottie-react-native';

const SubmitEventScreen = ({ route, navigation  }) => {
  const { onSubmit } = route.params || {};

  const [selectedCity, setSelectedCity] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState(''); 
  const [address, setAddress] = useState(''); 
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [eventType, setEventType] = useState('');
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageType, setImageType] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setDatePicker] = useState(false);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const scrollViewRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const eventTypes = [
    'Art', 'Music', 'Sports', 'Tech', 'Food', 'Networking', 'Social', 'Market', 'Other'
  ];
  const availableCities = [
    'Athens, GA',
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(status !== 'granted') {
      alert('Sorry, we need camera roll permisions tto make this work!');
      return;
    }
    let selectImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    })

    if (!selectImage.canceled) {
      const imageUri = selectImage.assets[0].uri;
      const ext = imageUri.split('.').pop().toLowerCase();
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImage(`data:image/${ext};base64,${base64}`);
      setImageType(ext);
    }
  };

  const clearForm = () => {
    setTitle('');
    setSelectedCity('');
    setLocation('');
    setAddress('');
    setDate(new Date());
    setTime(new Date());
    setEventType('');
    setDescription('');
    setImage('');
    setEmail(''),
    setPhone('')
    setRestrictions('');
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    })

    return() => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const scrollToInput = (inputRef) => {
    setTimeout(() => {
      inputRef?.current?.measureLayout(
        scrollViewRef.current,
        (_, y) => {
          scrollViewRef.current.scrollTo({ y: y - 20, animated: true });
        }
      );
    }, 100);
  };

  const handleSubmit = async () => {
    if (!title || !location || !eventType) {
        alert('Please fill in all required fields.');
        return;
    }
    const cityName = selectedCity.split(',')[0].toLowerCase();

    const newEvent = {
      city: cityName,
      title,
      location,
      address: address || '',
      date: date.toISOString().split('T')[0],
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: eventType,
      description,
      featured: false,
      image: image,
      email,
      phone,
      restrictions,
      externalLink,
    };

    navigation.navigate("Preview Submission", { eventData: newEvent, clearForm });
    
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 100}
      style={{flexGrow: 1}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <Text style={styles.label}>Event Title {title === '' && <Text style={{color: 'red'}}>*</Text>}</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter event title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.eventLabel}>City {selectedCity === '' && <Text style={{color: 'red'}}>*</Text>}</Text>
          <TouchableOpacity onPress={() => setShowCityPicker(true)}>
            <Text style={styles.input}>{selectedCity || "Select city"}</Text>
          </TouchableOpacity>
          {showCityPicker && (
            <Picker 
              selectedValue={selectedCity}
              onValueChange={(selectedCity) => {
                setShowCityPicker(false);
                if(selectedCity) setSelectedCity(selectedCity);
              }}
            >
              <Picker.Item label="Select city" value=" " />
              {availableCities.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          )}

          <Text style={styles.label}>Location {location === '' && <Text style={{color: 'red'}}>*</Text>}</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter address (optional)"
            value={address}
            onChangeText={setAddress}
            onFocus = {(event) => scrollToInput(event.target)}
          />
          <View style={styles.timeContainer}>
            <View>
              <Text style={styles.label}>Date {date === null && <Text style={{color: 'red'}}>*</Text>}</Text>
              <TouchableOpacity onPress={() => setDatePicker(true)} style={styles.picker}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectDate) =>{
                    setDatePicker(false);
                    if (selectDate) setDate(selectDate);
                  }}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.label}>Time {time === '' && <Text style={{color: 'red'}}>*</Text>}</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.picker}>
                <DateTimePicker 
                    value={time}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime) setTime(selectedTime);
                    }}
                  />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.eventLabel}>Event Type {eventType === '' && <Text style={{color: 'red'}}>*</Text>}</Text>
          <TouchableOpacity onPress={() => setShowEventPicker(true)}>
            <Text style={styles.input}>{eventType || "Select event type"}</Text>
          </TouchableOpacity>
          {showEventPicker && (
            <Picker 
              selectedValue={eventType}
              onValueChange={(selectedEventType) => {
                setShowEventPicker(false);
                if(selectedEventType) setEventType(selectedEventType);
              }}
            >
              <Picker.Item label="Select event type" value=" " />
              {eventTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          )}

          <Text style={styles.eventLabel}>Description</Text>
          <TextInput 
            style={[ styles.input, {height: 100} ]}
            placeholder="Enter description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            onFocus = {(event) => scrollToInput(event.target)}
          />

          <Text style={styles.eventLabel}>Email</Text>
          <TextInput 
            style={[ styles.input ]}
            placeholder="Enter email (in case we need to contact you)"
            value={email}
            onChangeText={setEmail}
            multiline
            onFocus = {(event) => scrollToInput(event.target)}
          />

          <Text style={styles.eventLabel}>Phone number</Text>
          <TextInput 
            style={[ styles.input ]}
            placeholder="Enter phone number (optional)"
            value={phone}
            onChangeText={setPhone}
            multiline
            onFocus = {(event) => scrollToInput(event.target)}
          />

          <Text style={styles.eventLabel}>Restrictions</Text>
          <TextInput 
            style={[ styles.input ]}
            placeholder="Age restrictions, attire, limited seating, etc."
            value={restrictions}
            onChangeText={setRestrictions}
            multiline
            onFocus = {(event) => scrollToInput(event.target)}
          />

          <Text style={styles.eventLabel}>External Link</Text>
          <TextInput 
            style={[ styles.input ]}
            placeholder="Tickets, RSVP, etc.."
            value={externalLink}
            onChangeText={setExternalLink}
            multiline
            onFocus = {(event) => scrollToInput(event.target)}
          />

          <Text style={styles.label}>Upload Image</Text>
          <TouchableOpacity style = {styles.imageUpload} onPress={pickImage}>
            <Text style={styles.uploadText}>Pick an Image</Text>
          </TouchableOpacity>
          {image && (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: image }}
                style={styles.image}
              />
              <TouchableOpacity onPress={() => setImage(null)} style={styles.removeImageButton}>
                <Text style={styles.removeImageText}>Remove Image</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit()}>
            <Text style={styles.submitText}>Submit Event</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingBottom: 200,
  },
  label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    eventLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      marginTop: 5,
    },
    imageUpload: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    uploadText: {
        fontSize: 16,
        color: '#333',
    },
    image: {
        width: 200,
        height: 150,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'center',
    },
    timeContainer: {
      flexDirection: 'row',
      gap: 25,
      marginBottom: 15,
    },
    imageContainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    removeImageButton: {
      backgroundColor: 'red',
      marginTop: 15,
      borderRadius: 5,
    },
    removeImageText: {
      color: 'white',
      margin: 15,
      fontSize: 14,
      fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    submitText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    modalItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    modalText: {
      fontSize: 16,
      textAlign: 'center',
    },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
};

export default SubmitEventScreen;