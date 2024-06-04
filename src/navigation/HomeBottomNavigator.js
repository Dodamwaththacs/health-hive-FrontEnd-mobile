import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import Dashboard from "../screens/Home/Dashboard";
import FolderNavigation from "../screens/Home/documents/FolderNavigation";
import Uploads from "../screens/Home/Uploads";
import Search from "../screens/Home/Search";

const Tab = createBottomTabNavigator();

function HomeBottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBar: "#fff",
        tabBarIconStyle: {
          borderRadius: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 8,
        },
        tabBarStyle: {
          backgroundColor: "#1921E4",
          height: 70,
          margin: 5,
          borderRadius: 10,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Documents"
        component={FolderNavigation}
        options={{
          headerShown: false,
          tabBarLabel: "Documents",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="copy1" color={color} size={size} />
          ),
        }}
      />

      {/* <Tab.Screen 
        name="Uploads" 
        component={Uploads} 
        options={{
          headerShown:false,
          tabBarLabel: 'Uploads',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="upload" color={color} size={size} />
          ),
        }}  
      /> */}

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeBottomNavigator;
