import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from 'react-native-paper';
import { Agenda } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MonthlyView = ({ eventData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState({});

  useEffect(() => {
    // Get the selected week's Monday–Sunday range
    const { start, end } = getWeekRange(selectedDate);

    // Create an empty template for the week's dates
    const weekItems = {};
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const formattedDate = d.toISOString().split("T")[0];
      weekItems[formattedDate] = []; // Default empty array
    }

    // Add events to the correct dates
    eventData.forEach((event) => {
      const formattedDate = formatDate(event.date);
      if (formattedDate in weekItems) {
        weekItems[formattedDate].push({
          title: event.title,
          time: event.time,
          location: event.location,
          imgUrl: event.imgUrl,
          type: event.type,
        });
      }
    });
    setItems(weekItems);
  }, [eventData, selectedDate]);

  const getWeekRange = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)

    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek)); // Ensure start is Monday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Sunday

    return { start: startOfWeek, end: endOfWeek };
  };

  const markedDates = eventData.reduce((acc, event) => {
    const formattedDate = formatDate(event.date);
    acc[formattedDate] = {
      marked: true,
      dotColor: "red",
      selected: formattedDate === selectedDate,
    };
    return acc;
  }, {});

  

  const eventTypeColors = {
    Music: "#FFDDC1",
    Fitness: "#C1FFD7",
    Conference: "#D1C4E9",
    Art: "#FFCDD2",
    Social: "#a6f1a6",
    Other: "#E0E0E0",
  };

  const renderItem = (event) => {
      const backgroundColor = eventTypeColors[event.type] || eventTypeColors.Other;
      return (
        <ScrollView>
            <Card style={[styles.eventCard, { backgroundColor, shadowColor: "transparent"}]}>
              <Card.Content>
                <View style={styles.info}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.infoText}>{event.location}</Text>
                  <Text style={styles.infoText}>{event.time}</Text>
                </View>
                </Card.Content>
            </Card>
        </ScrollView>
      );
  };
  
  const emptyRender = () => {
    return (
      <View style={styles.emptyRender}>
        <Text style={{ fontSize: 16, color: "gray" }}>Nothing to see here</Text>
      </View>
    );
  };

  return (
        <Agenda
          items={items}
          selected={selectedDate}
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          renderItem={renderItem}
        />
  );
};

// Define styles
const styles = StyleSheet.create({
  eventCard: {
    display: "flex",
    padddingLeft: 15,
    height: 65,
    marginVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    width: 350,
  },
  info: {
    display: "flex",
    paddingVertical: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyRender: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MonthlyView;