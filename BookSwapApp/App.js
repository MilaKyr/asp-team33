import Header from './views/Header';
import HomePage from './views/HomePage';
import Footer from './views/Footer';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeBaseProvider, Box } from "native-base";




const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
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
            } else if (route.name === 'Upload') {
              iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarInactiveTintColor: 'gray',
        })}>
          <Tab.Screen options={{
            title: 'Book Swap'
          }} name="Home" component={HomePage} />
          <Tab.Screen name="Search" component={HomePage} />
          <Tab.Screen name="Upload" component={HomePage} />
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
