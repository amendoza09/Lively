import React, { useState, useMemo } from  'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { format, startOfMonth, startOfWeek, endOfWeek, endOfMonth, eachDayOfInterval, addMonths, subMonths, subWeeks, addWeeks, getDay } from 'date-fns';

const Calendar = ({ events }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isExpanded, setIsExpanded] = useState(true);

    const eventTypeColors = {
      Music: '#FFDDC1', // Light Peach
      Fitness: '#C1FFD7', // Light Green
      Conference: '#D1C4E9',   // Lavender
      Art: '#FFCDD2',    // Light Pink
      Social: '#a6f1a6', // white
      Other: '#E0E0E0', // Light Gray (for unclassified types)
    };
    
    const dayAbbreviations = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const getEmptyDays = (date) => {
      const firstDay = startOfMonth(date);
      return getDay(firstDay);
    }

    const generateMonthDays = (date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        const days = eachDayOfInterval({ start, end });
        const emptyDays = getEmptyDays(date);
        const emptyCells = Array(emptyDays).fill(null);
        const fullMonthDays = [...emptyCells, ...days];
        const remainingCells = fullMonthDays.length % 7;

        if(remainingCells != 0) {
          const paddingCells = Array(7 - remainingCells).fill(null);
          return [...fullMonthDays, ...paddingCells];
        }
        return fullMonthDays;
    };

    const generateWeekDays = (date) => {
      const startOfSelectedWeek = startOfWeek(date, { weekStartsOn: 0 });
      const endOfSelectedWeek = endOfWeek(date, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: startOfSelectedWeek, end: endOfSelectedWeek });
    };

    const currentDate = format(new Date(), 'yyyy-MM-dd');

    const handleDayPress = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        setSelectedDate(formattedDate);
        setIsExpanded(false);
    };

    const handleReset = () => {
      setIsExpanded(true);
      setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    }

    const formattedEvents = useMemo(() => {
      return events.reduce((acc, event) => {
        const formattedDate = format(new Date(event.date), 'yyyy-MM-dd');
        if(!acc[formattedDate]) acc[formattedDate] = [];
        acc[formattedDate].push(event);
        return acc;
      }, {});
    }, [events]);

    return (
      <View style={{ flex: 1, padding: 10 }}>
        <View style={styles.agendaHeader}>
          <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <Text style={styles.navText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>{format(currentMonth, 'MMMM')}</Text>
          <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <Text style={styles.navText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dayHeader}>
          {dayAbbreviations.map((day, index) => {
            return (
              <View key={index} style={styles.dayHeaderCell}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            )
          })}
        </View>
        <FlatList
            data={isExpanded ? generateMonthDays(currentMonth) : generateWeekDays(new Date(selectedDate))}
            keyExtractor={(item, index) => item ? item.toString() : index.toString()}
            numColumns={7}
            renderItem={({ item }) => {
              if(!item) {
                return <View style={styles.dayCell} />
              }
              const formattedDate = format(item, 'yyyy-MM-dd');
              const isSelected = selectedDate === formattedDate;
              const isToday = formattedDate === currentDate;
        
              return (
                <TouchableOpacity
                style={[styles.dayCell, isSelected && styles.selectedDay, isToday && styles.todayIndicator]}
                onPress={() => handleDayPress(item)}
                >
                  <Text style={[isSelected ? styles.selectedText : styles.dayText, isToday && styles.todayText]}>
                    {format(item, 'd')}
                  </Text>
                  {formattedEvents[formattedDate] && <View style={styles.eventIndicator} />}
                </TouchableOpacity>
              );
            }}
      />
      {!isExpanded && selectedDate && (
        <View style={styles.eventListContainer}>
          {formattedEvents[selectedDate] ? (
            <FlatList
              data={formattedEvents[selectedDate]}
              keyExtractor={(event) => event._id.toString()}
              renderItem={({ item: event }) => {
                const backgroundColor = eventTypeColors[event.type] || eventTypeColors.Default;
                return (
                    <View style={[styles.eventCard, { backgroundColor }]}>
                        <View>
                            <View style={styles.description}>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <Text>{event.location}</Text>
                            </View>
                            <View style={styles.info}> 
                                <Text style={styles.infoText}>{event.time}</Text>
                            </View>
                        </View>
                    </View>
                );
              }}
            />
          ) : (
            <Text styles={styles.noEventsText}>Nothing today</Text>
          )}
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  agendaHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingVertical: 10,
    alignItems: 'center',
  },
  navText: {
    flex: 1,
    paddingHorizontal: 10, 
    alignItems: 'center',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 10,
  },
  todayText: {
    fontWeight: 'bold',
    color: 'white',
  },
  dayCell: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayText: {
    color: 'black',
  },
  eventIndicator: {
    width: 6,
    heigth: 6,
    backgroundColor: 'blue',
    borderRadius: 3,
    marginTop: 4,
  },
  todayIndicator: {
    backgroundColor: 'red',
    borderRadius: 30,
    width: 30,
    height: 30,
    justifyContent: 'center',
  },
  eventCard: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginVertical: 10,
  },
  eventTitle: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  eventItem: {
    paddingVertical: 5
  },
  eventTitle: {
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    padding: 10,
    background: 'blue',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
  selectedDay: {
    backgroundColor: 'black',
    borderRadius: 30,
    width: 30,
    height: 30,
    justifyContent: 'center',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventListContainer: {
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  noEventsText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'gray',
  },
  resetButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center'
  }
});

export default Calendar;