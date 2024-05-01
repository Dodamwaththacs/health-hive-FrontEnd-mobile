import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from './screens/Home'; 

const Drawer = createDrawerNavigator();

function MainContainer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home}  />
      <Drawer.Screen name="User" component={User}  />
    </Drawer.Navigator>
  );
}

export default MainContainer;
