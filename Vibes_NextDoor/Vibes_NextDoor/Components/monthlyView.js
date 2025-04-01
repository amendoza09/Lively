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
    const formattedItems = eventData.reduce((acc, event) => {
      const formattedDate = formatDate(event.date);
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push({
        title: event.title,
        time: event.time,
        location: event.location,
        imgUrl: event.imgUrl,
        type: event.type,
      });
      return acc;
    }, {});
    setItems(formattedItems);
  }, [eventData]);

  const markedDates = eventData.reduce((acc, event) => {
    const formattedDate = formatDate(event.date);
    acc[formattedDate] = {
      marked: true,
      dotColor: "red",
      selected: formattedDate === selectedDate,
    };
    return acc;
  }, {});

  const loadItems = (day) => {
    setTimeout(() => {

      const newItems = {...items};
      for (let i = -15; i < 15; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = new Date(time).toISOString().split("T")[0]; // Format YYYY-MM-DD
  
        if (!newItems[strTime]) {
          newItems[strTime] = [
            {
              title: "",
              time: "",
              location: "No events today",
              type: "Other",
            },
          ];
        }
      }
      setItems(newItems);
    }, 1000);
  };

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
        <TouchableOpacity style={styles.container}>
          <Card style={[styles.eventCard, { backgroundColor, shadowColor: "transparent" }]}>
            <Card.Content>
              <View style={styles.info}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.infoText}>{event.location}</Text>
                <Text style={styles.infoText}>{event.time}</Text>
              </View>
              </Card.Content>
          </Card>
        </TouchableOpacity>
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
      <View>
        <Agenda
          items={items}
          selected={selectedDate}
          loadItemsForMonth={loadItems}
          markedDates={markedDates}
          renderItem={renderItem}
        />
      </View>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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