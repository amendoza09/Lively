import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback
  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const API_BASE_URL = process.env.HOST || 'http://192.168.1.17:5500';

const SubmitEventScreen = ({ route }) => {
  const { onSubmit, selectedCity, setSelectedCity } = route.params || {};
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(''); 
  const [address, setAddress] = useState(''); 
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [eventType, setEventType] = useState('');
  const [image, setImage] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setDatePicker] = useState(false);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [description, setDescription] = useState('');
  const scrollViewRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const eventTypes = [
    'Music', 'Sports', 'Tech', 'Food', 'Networking', 'Social', 'Other'
  ];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener("ketboardDidHide", () => {
      setKeyboardHeight(0);
    })

    return() => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const scrollToInput = (inputRef) => {
    setTimeout(() => {
      inputRef?.current?.measuerLayout(
        scrollViewRef.current,
        (_, y) => {
          scrollViewRef.current.scrollTo({ y: y - 20, animated: true });
        }
      );
    }, 100);
  };

  const handleSubmit = async () => {
    try {
      const cityName = selectedLocation.split(',')[0].toLowerCase();

      if (!title || !location || !eventType) {
        alert('Please fill in all fields.');
        return;
      }

      const newEvent = {
        title,
        location,
        city: selectedLocation,
        address,
        date: date.toISOString().split('T')[0],
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: eventType,
        imgUrl: image,
        description,
      };

      const response = await fetch(`${API_BASE_URL}/event-data/${cityName}/new-event`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        console.log("Event saved!");
      } else {
        console.error("Failed to save event");
      }
      onSubmit(newEvent);
      
    } catch (error) {
        console.error('Error submitting event:', error);
        setError('Unable to submit event. Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 100}
      style={{flexGrow: 1}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <Text style={styles.label}>Event Title</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter event title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Location</Text>
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
          <Text style={styles.label}>Date</Text>
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

          <Text style={styles.label}>Time</Text>
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

          <Text style={styles.eventLabel}>Event Type</Text>
          <TouchableOpacity onPress={() => setShowEventPicker(true)}>
            <Text style={styles.input}>{eventType || "Selected event type"}</Text>
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

          <Text style={styles.label}>Upload Image</Text>
          <TouchableOpacity style = {styles.imageUpload} onPress={pickImage}>
            <Text style={styles.uploadText}>Pick an Image</Text>
          </TouchableOpacity>
          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity onPress={() => setImage(null)} style={styles.removeImageButton}>
                <Text style={styles.removeImageText}>Remove Image</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Event</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

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
    paddingVertical: 12,
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