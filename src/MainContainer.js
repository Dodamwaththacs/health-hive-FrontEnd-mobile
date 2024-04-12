import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from './screens/Home'; // Import Home from the new file
import Profile from './screens/Profile'; // Assuming Profile is also in a separate file

const Drawer = createDrawerNavigator();

function MainContainer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home}  />
      <Drawer.Screen name="Profile" component={Profile}  />
    </Drawer.Navigator>
  );
}

export default MainContainer;
