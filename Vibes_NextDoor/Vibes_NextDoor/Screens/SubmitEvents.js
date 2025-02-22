import React, { useState } from 'react';
import { FlatList, View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';

const eventTypes = [
  'Music', 'Sports', 'Tech', 'Food', 'Networking', 'Social', 'Other'
];



const SubmitEventScreen = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [eventType, setEventType] = useState('');
    const [image, setImage] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDatePicker, setDatePicker] = useState(false);
    const [showEventPicker, setShowEventPicker] = useState(false);

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

  const handleSubmit = () => {
    if (!title || !location || !eventType) {
      alert('Please fill in all fields.');
      return;
    }

    const newEvent = {
      title,
      location,
      date: date.toISOString().split('T')[0],
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: eventType,
      img: image,
    };

    onSubmit(newEvent);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        placeholder="Enter Location"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity onPress={() => setDatePicker(true)} style={styles.inputPicker}>
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
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.inputPicker}>
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
      
      <Text style={styles.label}>Event Type</Text>
      <RNPickerSelect
        onValueChange={(value) => setEventType(value)}
        items={eventTypes.map((type) => ({
          label: type,
          value: type,
        }))}
        style={pickerSelectStyles}
        placeholder={{ label: "Select event type", value: null }}
      />

      <Text style={styles.label}>Upload Image</Text>
      <TouchableOpacity style = {styles.imageUpload} onPress={pickImage}>
        <Text style={styles.uploadText}>Pick an Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Event</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        height: 'auto',
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 20,
        paddingVertical: 5,
    },
    picker: {
        height: 35,
        marginBotttom: 10,
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