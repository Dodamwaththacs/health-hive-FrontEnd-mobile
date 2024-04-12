import React from 'react';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";

import { View ,Text} from 'react-native';
import Header from '../components/Header'; // Make sure the path is correct
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Icon  from "react-native-vector-icons/FontAwesome";




const Home = () => {
  return(
  <Text>Home!</Text>
  );
};

export default Home;
