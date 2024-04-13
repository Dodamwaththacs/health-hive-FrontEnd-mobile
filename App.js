import React from 'react';
import { Text } from 'react-native';
import StackNav from './src/navigation/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>);
}
