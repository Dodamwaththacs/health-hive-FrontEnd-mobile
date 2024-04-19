import React from 'react';
import StackNavigation from './src/navigation/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Uploads from './src/screens/Home/Uploads';

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
    // <Uploads />
  );
}
