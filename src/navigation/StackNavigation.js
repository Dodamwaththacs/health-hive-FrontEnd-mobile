import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import SignIn from '../screens/SignIn';
import Reset from '../screens/Reset';



const Stack = createNativeStackNavigator();

function StackNavigation() {
  return (
    
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="Reset" component={Reset} options={{ headerShown: false }} />
        
      </Stack.Navigator>
    
  );
}

export default StackNavigation;
