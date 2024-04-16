import React from 'react';
import StackNavigation from './src/navigation/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Documents from './src/screens/Home/Documents';


export default function App() {
  return (
    // <NavigationContainer>
    //   <StackNavigation />
    // </NavigationContainer>
    <Documents />
  );
}
