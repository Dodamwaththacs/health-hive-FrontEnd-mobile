import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from "./Dashboard";
import Icon  from "react-native-vector-icons/FontAwesome";
import Profile from './Profile'; // Assuming Profile is also in a separate file

const Tab = createBottomTabNavigator();

function Home () {
  return(
    <Tab.Navigator>
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{
          headerShown:false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen name="Documents" component={Profile} options={{headerShown:false}} />
      <Tab.Screen name="Uploads" component={Profile} options={{headerShown:false}} />
      <Tab.Screen name="Search" component={Profile} options={{headerShown:false}} />
    </Tab.Navigator>
  );
}

export default Home;
