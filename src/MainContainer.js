import React from "react";
import { View,Text } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from "./screens/Dashboard";
import Icon  from "react-native-vector-icons/FontAwesome";
import Header from "./components/Header";

const Tab = createBottomTabNavigator();




    function Profile() {
      return (
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        
          <Text>Profile!</Text>
        </View>
        
      );
    }

const MainContainer = () => {
  return (<>
    <Header/>
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
    </>
  );
}

export default MainContainer;