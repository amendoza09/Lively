import React, { useState, useContext, createContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, Text, StyleSheet } from 'react-native';
import LeftArrow from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SplashScreen from './Screens/SplashScreen';
import HomeScreen from './Screens/Home';
import SearchScreen from './Screens/Search';
import EventDetailScreen from './Screens/EventDetails';
import SettingScreen from './Screens/Settings';
import AccountScreen from './Screens/Account';
import PrivacyScreen from './Screens/Privacy';
import HelpScreen from './Screens/Help';
import FeedbackScreen from './Screens/Feedback';
import SubmitEventScreen from './Screens/SubmitEvents';
import PreviewEventScreen from './Screens/PreviewEventScreen';
import ThankYouScreen from './Screens/ThankYouScreen';
import ThankYouHelpScreen from './Screens/ThankYouHelp';
import ThankYouFeedbackScreen from './Screens/ThankYouFeedback';
import StartEventSubmissionScreen from './Screens/AccountCheck';
import SettingAccountScreen from './Screens/SettingsAccountCheck';
import SignUpScreen from './Screens/Signup';
import LoginScreen from './Screens/Login';
import SettingsLoginScreen from './Screens/SettingsLogin';
import SettingsSignUpScreen from './Screens/SettingsSignUpScreen';
import AccountViewScreen from './Screens/AccountView';

const HomeStack = createStackNavigator();
const submitStack = createStackNavigator();
const SettingStack = createStackNavigator();
const Tab = createBottomTabNavigator();


const CityContext = createContext();
export const useCity = () => { return useContext(CityContext)};

const CityProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState('');
    return (
        <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
            {children}
        </CityContext.Provider>
    );
};

function HomeStackScreen() {
  const { selectedCity, setSelectedCity } = useCity();

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
        name="Event Details"
        component={EventDetailScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerStyle: {
            height: 108,
          },
          Title: 'Event Details',
          headerLeft: () => (
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', color:'' }}
            >
              <LeftArrow name="arrow-back" size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Back</Text>
            </Pressable>
          ),
        })}
      />
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

function SubmitScreenStack() {
  return(
    <submitStack.Navigator>
      <submitStack.Screen 
        name="Account Check"
        component={StartEventSubmissionScreen}
        options={({ navigation}) => ({ 
          headerShown: false,
        })}
      />
      <submitStack.Screen 
        name="Sign Up"
        component={SignUpScreen}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
      <submitStack.Screen 
        name="Login"
        component={LoginScreen}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
      <submitStack.Screen
        name="Submit an Event"
        component={SubmitEventScreen}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
      
      <submitStack.Screen
        name="Preview Submission"
        component={PreviewEventScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Preview Submission',
          headerStyle: {
            height: 108,
          },
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
      <submitStack.Screen
        name="Thank You"
        component={ThankYouScreen}
        options={() => ({
          headerShown: false
        })}
      />
    </submitStack.Navigator>
  )
}

function SettingStackScreen() {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen 
        name="Settings"
        options={{ 
          headerShown: false,
        }} 
        component={SettingScreen} 
      />

      <SettingStack.Screen
        name="View Account"
        component={AccountScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerStyle: {
            height: 108,
          },
          Title: 'View Account',
          headerLeft: () => (
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', color:'' }}
            >
              <LeftArrow name="arrow-back" size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Back</Text>
            </Pressable>
          ),
        })}
      />
      <submitStack.Screen 
        name="Settings Account Check"
        component={SettingAccountScreen}
        options={({ navigation}) => ({ 
          headerShown: true,
        })}
      />
      <submitStack.Screen 
        name="Settings Sign Up"
        component={SettingsSignUpScreen}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
      <submitStack.Screen 
        name="Settings Login"
        component={SettingsLoginScreen}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
      <submitStack.Screen 
        name="Account View"
        component={AccountViewScreen}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
      <SettingStack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={({ navigation }) => ({
          headerShown: true,
          Title: 'Privacy',
          headerStyle: {
            height: 108,
          },
          headerLeft: () => (
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', color:'' }}
            >
              <LeftArrow name="arrow-back" size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Back</Text>
            </Pressable>
          ),
        })}
      />
    
      <SettingStack.Screen
        name="Help"
        component={HelpScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerStyle: {
            height: 108,
          },
          Title: 'Help',
          headerLeft: () => (
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', color:'' }}
            >
              <LeftArrow name="arrow-back" size={24} color="#007AFF" />
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Back</Text>
            </Pressable>
          ),
        })}
      />
      <SettingStack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerStyle: {
            height: 108,
          },
          Title: 'Feedback',
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
        name="Thank You Help"
        component={ThankYouHelpScreen}
        options={() => ({
          headerShown: false
        })}
      />
      <SettingStack.Screen
        name="Thank You Feedback"
        component={ThankYouFeedbackScreen}
        options={() => ({
          headerShown: false,
        })}
      />
    </SettingStack.Navigator>
  );
}

function RootNavigator() {
  return (
    <CityProvider>
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
            name="Account Check" 
            component={SubmitScreenStack} 
            options={{
              tabBarIcon: () => (
                <Ionicons name="add-circle-outline" size={24} color="white" style={styles.icons}/>
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
    </CityProvider>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  
  if(isLoading) {
    return <SplashScreen />;
  }
  return <RootNavigator />;
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute', 
    backgroundColor: '#211A1E', // Tab bar background color
    borderColor: 'none',
    justifyContent: 'center',
    
  },
  bottomContainer: {
    height: 40,
  },
  icons: {
    height: 50,
    paddingTop: 20,
  }
})