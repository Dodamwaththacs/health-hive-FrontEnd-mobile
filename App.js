import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/Splash';
import SignIn from './src/screens/SignIn';
import Reset from './src/screens/Reset';
import OTPScreen from './src/screens/OTPScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import Dashboard from './src/screens/Dashboard';
import MainContainer from './src/MainContainer';


const Stack = createNativeStackNavigator();

function App() {
  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="Reset" component={Reset} options={{ headerShown: false }} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{ headerShown: false }} />  
        {/* <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} /> */}
        <Stack.Screen name="MainContainer" component={MainContainer} options={{ headerShown: false }} />
      </Stack.Navigator>

    </NavigationContainer>

   
  //  <MainContainer/>
  );
}

export default App;
