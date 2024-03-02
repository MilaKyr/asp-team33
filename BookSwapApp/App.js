import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomePage from './views/HomePage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, NativeBaseProvider } from "native-base";
import { LinearGradient } from 'expo-linear-gradient';
import SearchPage from './views/SearchPage';
import MyBooksPage from './views/MyBooksPage';
import SwapOfferPage from './views/SwapOfferPage';
import MySwapRequestPage from './views/MySwapRequestPage';
import UploadBookPage from './views/UploadBookPage';
import BookDetailPage from './views/BookDetailPage';
import SignUpPage from './views/SignUpPage';
import SignInPage from './views/SignInPage';
import SwapSchedulePage from './views/SwapSchedulePage';
import React from 'react';
import { AuthContext } from './util/context';
import UpdateBookPage from './views/UpdateBookPage';
import axios from 'axios';
import { API_URL } from './constants/api';

const config = {
  dependencies: {
    'linear-gradient': LinearGradient
  }
};


const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function MyBooksStack() {

  const { isSignedIn } = React.useContext(AuthContext);

  return (
    <Stack.Navigator>
      {
        isSignedIn ? (
          <>
            <Stack.Screen options={{
              headerShown: false,
            }} name="Books" component={MyBooksPage} />
            <Stack.Screen options={{
              headerTitle: 'Offers for Book'
            }} name="SwapOffer" component={SwapOfferPage} />
            <Stack.Screen options={{
              headerTitle: 'My Requests'
            }} name="SwapRequest" component={MySwapRequestPage} />
            <Stack.Screen options={{
              headerTitle: 'Upload New Book'
            }} name="UploadBook" component={UploadBookPage} />
            <Stack.Screen options={{
              headerTitle: 'Update Book'
            }} name="UpdateBook" component={UpdateBookPage} />
          </>
        ) : (
          <>
            <Stack.Screen options={{
              headerShown: false
            }} name="SignIn" component={SignInPage} />
            <Stack.Screen options={{
              headerShown: false
            }} name="SignUp" component={SignUpPage} />
          </>
        )
      }
    </Stack.Navigator>
  );
}

function SearchStack() {
  const { isSignedIn } = React.useContext(AuthContext);

  return (
    <Stack.Navigator>
      <Stack.Screen options={{
        headerShown: false
      }} name="SearchPage" component={SearchPage} />
      <Stack.Screen options={{
        headerTitle: 'Book Detail'
      }} name="BookDetail" component={BookDetailPage} />
      {isSignedIn ? (<>
        <Stack.Screen options={{
          headerShown: false
        }} name="ScheduleSwap" component={SwapSchedulePage} />
      </>) : (
        <>
          <Stack.Screen options={{
            headerShown: false
          }} name="SignUp" component={SignUpPage} />
          <Stack.Screen options={{
            headerShown: false
          }} name="SignIn" component={SignInPage} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignedOut: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignedOut: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignedOut: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const handleSignOut = async () => {
    dispatch({ type: 'SIGN_OUT' });
    await AsyncStorage.removeItem('userToken');
  }

  const authContext = {
    signIn: async (token) => {
      dispatch({ type: 'SIGN_IN', token: token });
    },
    signOut: handleSignOut,
    signUp: async (token) => {
      dispatch({ type: 'SIGN_IN', token: token });
    },
    isSignedIn: state.userToken != null
  }


  const getAndSaveDeviceAccessToken = async () => {
    try {

      try {
        const accessToken = await AsyncStorage.getItem('systemAccessToken');
        await axios.get(API_URL, {
          headers: {
            Authorization: accessToken
          }
        });
        console.log('We are still authorized')
      } catch (error) {
        if (error && error.response && error.response.status == 401) {
          console.log('failed initial request, creating system token')
          const response = await axios.post(`${API_URL}/token/generate`, {
            user: process.env.EXPO_PUBLIC_JWT_USER,
            password: process.env.EXPO_PUBLIC_JWT_USER_PASSWORD,
          })
          await AsyncStorage.setItem('systemAccessToken', response.data.accessToken);
        }
      }
    } catch (error) {
      console.log('generate token error ', error.response.data)
    }
  }

  React.useEffect(() => {
    getAndSaveDeviceAccessToken()
  }, [])


  return (
    <NativeBaseProvider config={config}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused
                  ? 'home'
                  : 'home-outline';
              } else if (route.name === 'Search') {
                iconName = focused ? 'search' : 'search-outline';
              } else if (route.name === 'MyBooks') {
                iconName = focused ? 'book' : 'book-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarInactiveTintColor: 'gray',
          })}>
            <Tab.Screen options={{
              title: 'Book Swap'
            }} name="Home" component={HomePage} />
            <Tab.Screen name="Search" component={SearchStack} />
            <Tab.Screen options={{
              title: 'My Books',
              headerTitle: 'My Books',
              headerRight: () => {
                if (state.userToken != null) {
                  return (
                    <Button variant='ghost' onPress={() => {
                      handleSignOut()
                    }}>Sign Out</Button>
                  )
                }
                return null;
              },
            }} name="MyBooks" component={MyBooksStack} />
          </Tab.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </NativeBaseProvider>
  );
}