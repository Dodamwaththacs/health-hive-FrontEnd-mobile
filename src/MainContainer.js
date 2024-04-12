import React from "react";
import { View,Text } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from "./screens/Dashboard";
import Icon  from "react-native-vector-icons/FontAwesome";
import Header from "./components/Header";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

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


function Profile() {
      return (
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        
          <Text>Profile!</Text>
        </View>
        
      );
    }

function MainContainer() {
  return (
    
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home}  />
    </Drawer.Navigator>
    
  );
}

export default MainContainer;