import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

import HomePage from './views/HomePage';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeBaseProvider } from "native-base";
import { LinearGradient } from 'expo-linear-gradient';
import SearchPage from './views/SearchPage';
import MyBooksPage from './views/MyBooksPage';
import SwapOfferPage from './views/SwapOfferPage';
import MySwapRequestPage from './views/MySwapRequestPage';
import UploadBookPage from './views/UploadBookPage';

const config = {
  dependencies: {
    'linear-gradient': LinearGradient
  }
};


const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function MyBooksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{
        headerShown: false
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
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NativeBaseProvider config={config}>
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
          <Tab.Screen name="Search" component={SearchPage} />
          <Tab.Screen options={{
            title: 'My Books',
            headerTitle: 'My Books'
          }} name="MyBooks" component={MyBooksStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
});
