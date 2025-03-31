import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Image, StyleSheet } from "react-native";
import { Agenda } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";

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
      const strTime = day.timeStamp;

      if(!items[strTime]) {
        const newItems = { ...items, [strTime]: []};
        setItems(newItems);
      }
    }, 500);
  };

  const eventTypeColors = {
    Music: "#FFDDC1",
    Fitness: "#C1FFD7",
    Conference: "#D1C4E9",
    Art: "#FFCDD2",
    Social: "#a6f1a6",
    Other: "#E0E0E0",
  };

  const emptyRender = () => {
    return (
      <View style={styles.emptyRender}>
        <Text>Nothing to see here</Text>
      </View>
    );
  };
  
  const renderItem = (event) => {
      const backgroundColor = eventTypeColors[event.type] || eventTypeColors.Other;
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={[styles.eventCard, { backgroundColor }]}>
              <View style={styles.info}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.infoText}>{event.location}</Text>
                <Text style={styles.infoText}>{event.time}</Text>
              </View>
          </View>
        </ScrollView>
      );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardsContainer}>
        <Agenda
          items={items}
          selected={selectedDate}
          loadItemsForMonth={loadItems}
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          renderItem={renderItem}
          renderEmptyData={emptyRender}
        />
      </View>
    </SafeAreaView>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    height: "100%",
  },
  eventCard: {
    display: "flex",
    padddingLeft: 15,
    height: 70,
    marginVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    width: 350,
  },
  info: {
    display: "flex",
    paddingLeft:15,
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
    display: "flex",
    padddingLeft: 15,
    marginVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  cardsContainer: {
    display: "flex",
    height: 300,
  }
});

export default MonthlyView;