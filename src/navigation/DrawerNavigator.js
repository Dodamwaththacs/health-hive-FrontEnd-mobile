import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image } from 'react-native';
import Home from './HomeBottomNavigator';
import Scan from '../screens/Scan';
import QR_Code from '../screens/QR_Code';
import Notification from '../screens/Notification';
import Setting from "../screens/Setting";
import Help from "../screens/Help";
import About from "../screens/About";
import Logo from "../assets/logo.png";


const Drawer = createDrawerNavigator();

function DrawerNaviagtor() {
  return (
    <Drawer.Navigator initialRouteName="Home"
      screenOptions={{
        headerStyle: { 
          backgroundColor: '#1921E4',
          borderRadius: 20,
          elevation: 20,
          shadowColor: 'black',
          height: 100,
          shadowOffset: {
            width: 2,
            height: 2,
          }
        },
        headerTintColor: '#fff',
        headerRight: () => (
          <Image
            style={{ 
              width: 50, 
              height: 50, 
              margin:15 ,
            }}
            source={Logo}
          />
        ),

      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Scan" component={Scan}  />
      <Drawer.Screen name="QR Code" component={QR_Code}  />
      <Drawer.Screen name="Notification" component={Notification}  />
      <Drawer.Screen name="Setting" component={Setting}  />
      <Drawer.Screen name="Help" component={Help}  />
      <Drawer.Screen name="About Us" component={About}  />
    </Drawer.Navigator>
  );
}

export default DrawerNaviagtor;