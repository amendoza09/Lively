import React, { useState, useMemo, useRef } from  'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { format, startOfMonth, startOfWeek, endOfWeek, endOfMonth, eachDayOfInterval, addMonths, subMonths, subWeeks, addWeeks, getDay } from 'date-fns';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Calendar = ({ events }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isExpanded, setIsExpanded] = useState(true);
    const [dayPosition, setDayPosition] = useState(null);
    const [dayPositions, setDayPositions] = useState({});

    const eventTypeColors = {
      Music: '#FFDDC1', // Light Peach
      Fitness: '#C1FFD7', // Light Green
      Conference: '#D1C4E9',   // Lavender
      Art: '#FFCDD2',    // Light Pink
      Social: '#a6f1a6', // white
      Other: '#E0E0E0', // Light Gray (for unclassified types)
    };
    
    const dayAbbreviations = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const eventListHeight = useRef(new Animated.Value(0)).current;
    const dayCellRef = useRef();

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

    const handleDayPress = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const yPosition = dayPositions[formattedDate] || 0;

        setDayPosition(yPosition);
        setSelectedDate(formattedDate);
        setIsExpanded(false);

        Animated.timing(eventListHeight, {
            toValue: screenHeight-360,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    const handleReset = () => {
      Animated.timing(eventListHeight, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }).start(() => {
          setIsExpanded(true);
          setSelectedDate(null);
        });
    };

    const formattedEvents = useMemo(() => {
      return events.reduce((acc, event) => {
        const formattedDate = format(new Date(event.date), 'yyyy-MM-dd');
        if(!acc[formattedDate]) acc[formattedDate] = [];
        acc[formattedDate].push(event);
        return acc;
      }, {});
    }, [events]);
  
  const renderEventList = () => {
    if(!dayPosition) return null;

    return (
      <Animated.View style={[
        styles.eventListContainer, 
        { 
          height: eventListHeight,
          top: dayPosition + 50,
          left: 0,
          zIndex: 999,
        }
      ]}>
          {!isExpanded && selectedDate && (
            <View>
              {formattedEvents[selectedDate] ? (
                <FlatList
                  data={formattedEvents[selectedDate]}
                  contentContainerStyle={styles.cardsContainer}
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
                  <View style={styles.emptyPlaceHolder}>
                    <Text styles={styles.noEventsText}>Nothing today</Text>
                  </View>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={handleReset}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
    );
  }

  return (
      <View style={{ flex: 1 }}>
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
            );
          })}
        </View>

          <FlatList
            data={generateMonthDays(currentMonth)}
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
                  onLayout={(event) => {
                    if (!event.nativeEvent) return;
                    const { y } = event.nativeEvent.layout;
                    setDayPositions((prev) => ({ ...prev, [formattedDate]: y , }));
                  }}
                >
                  <Text style={[isSelected ? styles.selectedText : styles.dayText, isToday && styles.todayText]}>
                    {format(item, 'd')}
                  </Text>
                  {formattedEvents[formattedDate] && (<View style={styles.eventIndicator} />)}
                </TouchableOpacity>
              );
            }}
          />

        {renderEventList()}
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
    marginTop: 5,
    paddingHorizontal: 20, 
    paddingBottom: 25,
    alignItems: 'center',
  },
  navText: {
    flex: 1,
    paddingHorizontal: 20, 
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
    height: 30,
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
  },
  todayIndicator: {
    backgroundColor: 'red',
    borderRadius: 40,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsContainer: {
    width: 350,
    justifyContent: 'flex-end',
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
    flex: 1,
    borderRadius: 40,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventListContainer: {
    height: screenHeight,
    backgroundColor: 'grey',
    flex: 1,
    alignItems: 'flex-end',
  },
  emptyPlaceHolder: {
    paddingTop: 15,
    width: screenWidth,
    flex: 1,
    alignItems: 'center',
  },
  resetButton: {
    marginTop: 10,
    padding: 10,
    bottom: 0,
  }
});

export default Calendar;