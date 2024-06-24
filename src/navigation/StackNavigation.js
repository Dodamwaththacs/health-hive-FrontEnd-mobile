import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../screens/Splash";
import SignIn from "../screens/SignIn";
import Reset from "../screens/Reset";
import OTPScreen from "../screens/OTPScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import LoadingScreen from "../screens/LoadingScreen";
import DrawerNavigator from "./DrawerNavigator";
import Dashboard from "../screens/Home/Dashboard";
import UserProfile from "../screens/Home/UserProfile";
import DocumentViewer from "../screens/Home/DocumentViewer";
import Documents from "../screens/Home/documents/Documents";
import File from "../screens/Home/documents/File";
import LabFolder from "../screens/Home/documents/LabFolder";


const Stack = createNativeStackNavigator();

function StackNavigation({ userToken }) {
  return (
    console.log("Stack navigation userToken : ", userToken),
    (
      <Stack.Navigator initialRouteName="Splash">
        {userToken == null ? (
          <>
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Reset"
              component={Reset}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OTPScreen"
              component={OTPScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoadingScreen"
              component={LoadingScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="DrawerNavigator"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="UserProfile"
              component={UserProfile}
              options={{ title: "Your Profile" }}
            />

            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DocumentViewer"
              component={DocumentViewer}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Documents"
              component={Documents}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="File"
              component={File}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LabFolder"
              component={LabFolder}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    )
  );
}

export default StackNavigation;
