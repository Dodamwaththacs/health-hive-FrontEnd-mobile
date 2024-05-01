import React from 'react';
import StackNavigation from './src/navigation/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Dashboard from './src/screens/Home/Dashboard';

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
    // <Dashboard/>
  );
}
