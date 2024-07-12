import React, { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Home from "./HomeBottomNavigator";
import Scan from "../screens/Scan";
import QR_Code from "../screens/QR_Code";
import ReceivedFiles from "../screens/ReceivedFiles";
import Setting from "../screens/Setting";
import Notes from "../screens/Notes";
import SignOut from "../screens/SignOut";
import axios from "axios";
import { useEmail } from "../EmailContext";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../../App";
import Logo from "../assets/logo.png";

import { useNavigation } from "@react-navigation/native";


const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you would like to log out? You'll need to log in again",
      [
        {
          text: "NO",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "YES",
          onPress: () => {
            // Perform logout actions here
            
            props.navigation.navigate("SignOut");
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <View style={styles.header}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.title}>Health Hive</Text>
      </View>
      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          label="Log Out"
          icon={({ size }) => (
            <Ionicons name="log-out-outline" color={"#1E3A8A"} size={size} />
          )}
          onPress={handleLogout}
          labelStyle={styles.drawerItemLabel}
        />
      </View>
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  const [user, setUser] = useState(null);
  const { email } = useEmail();
  const navigation = useNavigation();
  const { signOut } = React.useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = await SecureStore.getItemAsync("userEmail");
        const response = await axios.get(
          `http://13.202.67.81:10000/usermgtapi/api/users/email/${email}`
        );
        setUser(response.data);
        await SecureStore.setItemAsync("userId", response.data.id.toString());
      } catch (error) {
        console.error("Error fetching user data drawer :", error);
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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1E3A8A",
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
                height: 50,
                margin: 20,
                marginRight: 20,
                marginBottom: 30,
              }}
              source={Logo}
            />
          </TouchableOpacity>
        ),
        drawerStyle: {
          backgroundColor: "#fff",
        },
        drawerLabelStyle: {
          fontSize: 16,
          marginLeft: -16,
        },
        drawerActiveBackgroundColor: "#1E3A8A", //  blue background for active item
        drawerActiveTintColor: "#fff", // white text color for active item
        drawerInactiveTintColor: "grey",

        drawerItemStyle: {
          marginVertical: 5,
          borderRadius: 20,
        },
      }}
    >
      <Drawer.Screen
        name="Health Hive"
        component={Home}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Scan"
        component={Scan}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="scan-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="My QR"
        component={QR_Code}
        initialParams={{ userId: user.id }}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="qr-code-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Received Files"
        component={ReceivedFiles}
        initialParams={{ userId: user.id }}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Your Notes"
        component={Notes}
        initialParams={{ userId: user.id }}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" color={color} size={size} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="Setting"
        component={Setting}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="SignOut"
        component={SignOut}
        options={{
          drawerItemStyle: { display: "none" }, // This hides it from the drawer list
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#E4E9F2",
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  drawerItemsContainer: {
    flex: 1,
    paddingTop: 8,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#E4E9F2",
    borderTopWidth: 2,
    paddingTop: 15,
  },
  drawer: {
    backgroundColor: "#FFFFFF",
    width: 240,
  },
  drawerItemLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: -16,
    color: "#1E3A8A",
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
});

export default DrawerNavigator;
