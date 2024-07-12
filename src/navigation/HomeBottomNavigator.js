import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import Dashboard from "../screens/Home/Dashboard";
import FolderNavigation from "../screens/Home/documents/FolderNavigation";
import Search from "../screens/Home/Search";
import Documents from "../screens/Home/documents/Documents";
import * as SecureStore from "expo-secure-store";

const Tab = createBottomTabNavigator();

function HomeBottomNavigator() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = await SecureStore.getItemAsync("userEmail");
        setEmail(email);
      } catch (error) {
        console.error("Error fetching user data:", error);
        signOut();
      }
    };

    fetchUserData();
  });

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#9e9e9e",
        tabBar: "#fff",
        tabBarIconStyle: {
          borderRadius: 40,
          marginBottom: -12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 13,
        },
        tabBarStyle: {
          backgroundColor: "#1E3A8A",
          height: 70,
          borderTopStartRadius: 20,
          borderTopEndRadius: 20,
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
        component={Documents}
        initialParams={{ useremail: email }}
        options={{
          headerShown: false,
          tabBarLabel: "Documents",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="copy1" color={color} size={size} />
          ),
        }}
      />

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
