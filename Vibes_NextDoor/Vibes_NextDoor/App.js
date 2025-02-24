import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, Text, StyleSheet } from 'react-native';
import LeftArrow from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './Screens/Home';
import SearchScreen from './Screens/Search';
import SettingScreen from './Screens/Settings';
import AccountScreen from './Screens/Account';
import PrivacyScreen from './Screens/Privacy';
import HelpScreen from './Screens/Help';
import FeedbackScreen from './Screens/Feedback';
import SubmitEventScreen from './Screens/SubmitEvents';

const HomeStack = createStackNavigator();
const SettingStack = createStackNavigator();
const Tab = createBottomTabNavigator();


function HomeStackScreen() {
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Back"
        options={{
          headerShown: false,
        }}
      >
      {(props) => (
        <>
        <HomeScreen
          {...props}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        </>
        )}
      </HomeStack.Screen>

      <HomeStack.Screen
        name="Search"
        component={SearchScreen}
        initialParams={{ setSelectedCity }}
        option={({ navigation }) => ({
          headerShown: true,
          Title: 'Search Cities',
          headerLeft: () => (
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', color:'' }}
            >
              <LeftArrow name="arrow-back" size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Go Back</Text>
            </Pressable>
          ),
        })}
      />
    </HomeStack.Navigator>
  );
}

function SettingStackScreen() {
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <SettingStack.Navigator>
      <SettingStack.Screen name="Back" 
        options={{ headerShown: false }} 
        component={SettingScreen} 
      />

      <SettingStack.Screen
        selectedCity={selectedCity} 
        setSelectedCity={setSelectedCity}
        name="Submit an Event"
        component={SubmitEventScreen}
        option={({ navigation }) => ({
          headerShown: true,
          Title: 'Submit an Event',
          headerLeft: () => (
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', color:'' }}
            >
              <LeftArrow name="arrow-back" size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Go Back</Text>
            </Pressable>
          ),
        })}
        initialParams={{
          selectedCity,
          setSelectedCity,
          onSubmit: (newEvent) => {
            console.log(newEvent);
          }
        }}
      />

      <SettingStack.Screen
        name="Creator Account"
        component={AccountScreen}
        option={({ navigation }) => ({
          headerShown: true,
          Title: 'Creator Account',
          headerLeft: () => (
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', color:'' }}
            >
              <LeftArrow name="arrow-back" size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Go Back</Text>
            </Pressable>
          ),
        })}
      />

      <SettingStack.Screen
        name="Privacy"
        component={PrivacyScreen}
        option={({ navigation }) => ({
          headerShown: true,
          Title: 'Privacy',
          headerLeft: () => (
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', color:'' }}
            >
              <LeftArrow name="arrow-back" size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Go Back</Text>
            </Pressable>
          ),
        })}
      />
    
      <SettingStack.Screen
        name="Help"
        component={HelpScreen}
        option={({ navigation }) => ({
          headerShown: true,
          Title: 'Help',
          headerLeft: () => (
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', color:'' }}
            >
              <LeftArrow name="arrow-back" size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Go Back</Text>
            </Pressable>
          ),
        })}
      />
      <SettingStack.Screen
        name="Feedback & Support"
        component={FeedbackScreen}
        option={({ navigation }) => ({
          headerShown: true,
          Title: 'Feedback & Support',
          headerLeft: () => (
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', color:'' }}
            >
              <LeftArrow name="arrow-back" size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Go Back</Text>
            </Pressable>
          ),
        })}
      />
    </SettingStack.Navigator>
  );
}

function RootNavigator() {
  return (
    <NavigationContainer style={styles.bottomContainer}>
      <Tab.Navigator
        screenOptions={{
        headerShown: false,
        tabBarLabel: () => null,
        tabBarStyle: styles.tabBar,
      }}>
        <Tab.Screen 
          name="Home" 
          component={HomeStackScreen} 
          options={{
            tabBarIcon: () => (
              <Ionicons name="home-outline" size={24} color="white" style={styles.icons} />
            )
          }}  
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingStackScreen} 
          options={{
            tabBarIcon: () => (
              <Ionicons name="settings-outline" size={24} color="white" style={styles.icons}/>
            )
          }}  
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return <RootNavigator />;
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute', 
    backgroundColor: 'black', // Tab bar background color
    shadowColor: '#000', // Shadow for floating effect (iOS)
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Shadow for Android
    borderColor: 'none',
    justifyContent: 'center',
    
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  icons: {
    height: 50,
    paddingTop: 20,
  }
})