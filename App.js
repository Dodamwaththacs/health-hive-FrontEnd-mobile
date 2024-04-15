import React from 'react';
import StackNavigation from './src/navigation/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Scanner from './src/screens/ScanTemp';



export default function App() {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
    //<Scanner />
  );
}
