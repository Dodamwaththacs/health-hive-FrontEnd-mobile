import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image } from "react-native";
import Home from "./HomeBottomNavigator";
import Scan from "../screens/Scan";
import QR_Code from "../screens/QR_Code";
import Notification from "../screens/Notification";
import Setting from "../screens/Setting";
import Help from "../screens/Help";
import About from "../screens/About";
import Logo from "../assets/logo.png";
import SignOut from "../screens/SignOut";
import axios from "axios";
import { useEmail } from "../EmailContext";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../../App";

const Drawer = createDrawerNavigator();

function DrawerNaviagtor() {
  const [user, setUser] = useState(null);
  const { email } = useEmail();
  const navigation = useNavigation();
  const { signOut } = React.useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = await SecureStore.getItemAsync("userEmail");

        const response = await axios.get(
          `http://192.168.69.140:33000/api/users/email/${email}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        signOut();
      }
    };

    fetchUserData();
  }, [email]);

  if (!user) {
    return null; // or some loading component
  }

  return (
    <Drawer.Navigator
      initialRouteName="Health Hive"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0056B3",
          borderBottomEndRadius: 20,
          borderBottomStartRadius: 20,
          elevation: 20,
          shadowColor: "black",
          height: 100,
          shadowOffset: {
            width: 2,
            height: 2,
          },
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontSize: 20,
          left: -90,
        },
        headerTitleAlign: "center",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DrawerNavigator")}
          >
            <Image
              style={{
                width: 50,
                height: 52,
                margin: 20,
                marginRight: 20,
                marginBottom: 30,
              }}
              source={Logo}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen name="Health Hive" component={Home} />
      <Drawer.Screen name="Scan" component={Scan} />
      <Drawer.Screen
        name="My QR"
        component={QR_Code}
        initialParams={{ userId: user.id }}
      />
      <Drawer.Screen
        name="Notification"
        component={Notification}
        initialParams={{ userId: user.id }}
      />
      <Drawer.Screen name="Setting" component={Setting} />
      <Drawer.Screen name="Help" component={Help} />
      <Drawer.Screen name="About" component={About} />
      <Drawer.Screen name="SignOut" component={SignOut} />
    </Drawer.Navigator>
  );
}

export default DrawerNaviagtor;
