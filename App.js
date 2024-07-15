import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { EmailProvider } from "./src/EmailContext";
import StackNavigation from "./src/navigation/StackNavigation";
import * as SQLite from "expo-sqlite";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
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
        email = await SecureStore.getItemAsync("userEmail");

        if (userToken) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${userToken}`;
          const response = await axios.get(
            "http://13.202.67.81:10000/usermgtapi/api/hello"
          );
          if (response.status === 200) {
            dispatch({ type: "RESTORE_TOKEN", token: userToken });
          } else {
            await SecureStore.deleteItemAsync("userToken");
            await SecureStore.deleteItemAsync("userEmail");
            dispatch({ type: "SIGN_OUT" });
          }
        } else {
          dispatch({ type: "SIGN_OUT" });
        }
      } catch (e) {
        console.log("error..", e);
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userEmail");
        dispatch({ type: "SIGN_OUT" });
      }
    };

    const databaseHandling = async () => {
      const db = await SQLite.openDatabaseAsync("HealthHive");
      try {
        await db.execAsync(
          `
          CREATE TABLE IF NOT EXISTS folderData (
          id INTEGER PRIMARY KEY NOT NULL,
          folderName TEXT NOT NULL,
          userEmail TEXT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(folderName, userEmail)
          );

          CREATE TABLE IF NOT EXISTS fileStorage (
          id INTEGER PRIMARY KEY NOT NULL,
          userEmail TEXT NOT NULL,
          fileName TEXT NOT NULL,
          folderName TEXT NOT NULL,
          description TEXT NOT NULL,
          hash TEXT NOT NULL,
          date DATE DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (folderName, userEmail) REFERENCES folderData(folderName, userEmail)
          );
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
        await SecureStore.setItemAsync("userToken", token);
        await SecureStore.setItemAsync("userEmail", userEmail);

        await SecureStore.getItemAsync("userEmail");

        dispatch({ type: "SIGN_IN", token: data });
      },
      signOut: async () => {
        console.log("signOut");
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userEmail");
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async (data) => {
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
  );
}
