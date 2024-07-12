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
import About from "../screens/About";
import Help from "../screens/Help";
import HowItWorks from "../screens/HowItWorks";
import FAQ from "../screens/FAQ";
import ContactUs from "../screens/ContactUs";
import ManageFiles from "../screens/ManageFiles";
import SelectFiles from "../screens/SelectFiles";
import SelectTests from "../screens/SelectTests";
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
              options={{
                title: "Your Profile",
                headerStyle: { backgroundColor: "#1E3A8A" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
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
            <Stack.Screen
              name="About"
              component={About}
              options={{
                title: "About Us",
                headerStyle: { backgroundColor: "#1E3A8A" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
            <Stack.Screen
              name="Help"
              component={Help}
              options={{
                title: "Help & Support",
                headerStyle: { backgroundColor: "#1E3A8A" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
            <Stack.Screen
              name="HowItWorks"
              component={HowItWorks}
              options={{
                title: "How It Works",
                headerStyle: { backgroundColor: "#1E3A8A" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
            <Stack.Screen
              name="FAQ"
              component={FAQ}
              options={{
                title: "FAQ",
                headerStyle: { backgroundColor: "#1E3A8A" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
            <Stack.Screen
              name="ContactUs"
              component={ContactUs}
              options={{
                title: "Contact Us",
                headerStyle: { backgroundColor: "#1E3A8A" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
            <Stack.Screen
              name="ManageFiles"
              component={ManageFiles}
              options={{
                title: "Manage Files",
                headerStyle: { backgroundColor: "#1E3A8A" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
            <Stack.Screen
              name="SelectFiles"
              component={SelectFiles}
              options={{
                title: "Select Files",
                headerStyle: { backgroundColor: "#1E3A8A" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
             <Stack.Screen
              name="SelectTests"
              component={SelectTests}
              options={{
                title: "Select Tests",
                headerStyle: { backgroundColor: "#1E3A8A" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    )
  );
}

export default StackNavigation;
