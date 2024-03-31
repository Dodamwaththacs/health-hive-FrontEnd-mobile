import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/Splash';
import SignIn from './src/screens/SignIn';
import Reset from './src/screens/Reset';
import Otp from './src/screens/otp';

const Stack = createNativeStackNavigator();

function App() {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Splash">
    //     <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
    //     <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
    //     <Stack.Screen name="Reset" component={Reset} options={{ headerShown: false }} />
        
    //   </Stack.Navigator>
    // </NavigationContainer>
    <Otp />
    
  );
}

export default App;
