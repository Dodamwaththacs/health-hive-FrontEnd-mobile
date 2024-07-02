import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { EmailProvider } from "./src/EmailContext";
import StackNavigation from "./src/navigation/StackNavigation";
import * as SQLite from "expo-sqlite";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import SignOut from "./src/screens/SignOut";
import Document from "./src/screens/Home/documents/Documents";
import TempScreen from "./src/screens/TempScreen";
export const AuthContext = React.createContext();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await SecureStore.getItemAsync("userToken");
        console.log("userToken..", userToken);
        email = await SecureStore.getItemAsync("userEmail");
        console.log("email..", email);

        axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        const responce = await axios.get(
          "http://192.168.40.140:33000/api/hello"
        );
        if (responce.status === 200) {
          dispatch({ type: "RESTORE_TOKEN", token: userToken });
        } else {
          dispatch({ type: "SIGN_OUT" });
        }
      } catch (e) {
        dispatch({ type: "SIGN_OUT" });
      }
      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
    };

    const databaseHandling = async () => {
      const db = await SQLite.openDatabaseAsync("HealthHive");
      try {
        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS fileStorage (
        id INTEGER PRIMARY KEY NOT NULL,
        userEmail TEXT NOT NULL,
        fileName TEXT NOT NULL,
        folderName TEXT NOT NULL,
        description TEXT NOT NULL,
        hash TEXT NOT NULL,
        date DATE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS folderData (
      id INTEGER PRIMARY KEY NOT NULL,
      folderName TEXT NOT NULL);
      `
        );
      } catch (e) {
        console.log(e);
      }

      db.closeAsync();
    };

    bootstrapAsync();
    databaseHandling();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data, email) => {
        const token = data;
        const userEmail = email;
        console.log("email..", userEmail);
        console.log("token..", token);
        // console.log("App.js data..", data);

        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        await SecureStore.setItemAsync("userToken", token);
        await SecureStore.setItemAsync("userEmail", userEmail);

        await SecureStore.getItemAsync("userEmail");

        dispatch({ type: "SIGN_IN", token: data });
      },
      signOut: () => {
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <EmailProvider>
        <NavigationContainer>
          <StackNavigation userToken={state.userToken} />
        </NavigationContainer>
      </EmailProvider>
    </AuthContext.Provider>
    // <TempScreen />
  );
}
