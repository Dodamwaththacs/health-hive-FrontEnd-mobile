import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { EmailProvider } from './src/EmailContext';
import StackNavigation from './src/navigation/StackNavigation';

export default function App() {
  return (
    <EmailProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </EmailProvider>
  );
}
