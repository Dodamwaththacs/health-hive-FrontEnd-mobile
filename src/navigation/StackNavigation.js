import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import SignIn from '../screens/SignIn';
import Reset from '../screens/Reset';
import OTPScreen from '../screens/OTPScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import LoadingScreen from '../screens/LoadingScreen';
import DrawerNavigator from './DrawerNavigator';
import Dashboard from '../screens/Home/Dashboard';
import UserProfile from '../screens/Home/UserProfile';




const Stack = createNativeStackNavigator();

function StackNavigation() {
  return (
    
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="Reset" component={Reset} options={{ headerShown: false }} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} options={{ headerShown:false}}/>
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown:false}}/>
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{ headerShown:false}}/>
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown:false}}/>
        <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: 'Your Profie' }} />
        <Stack.Screen name='DrawerNavigator' component={DrawerNavigator} options={{ headerShown: false }} />

      </Stack.Navigator>
    
  );
}

export default StackNavigation;
