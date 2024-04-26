import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from './screens/Home';
import UserProfile from './screens/UserProfile'; 

const Drawer = createDrawerNavigator();

function MainContainer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home}  />
      <Drawer.Screen name="UserProfile" component={UserProfile}  />
    </Drawer.Navigator>
  );
}

export default MainContainer;
