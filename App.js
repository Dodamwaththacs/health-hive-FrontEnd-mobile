import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { EmailProvider } from "./src/EmailContext";
import StackNavigation from "./src/navigation/StackNavigation";
import * as SQLite from "expo-sqlite";
import axios from "axios";

import TempScreen from "./src/screens/TempScreen";

export default function App() {
  useEffect(() => {
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
        console.log("Tables created successfully!");
      } catch (e) {
        console.log(e);
      }

      db.closeAsync();
    };
    const tokenChecker = async () => {
      const axiosInstance = axios.create();
      if (axiosInstance.defaults.headers.common["Authorization"]) {
        console.log("Token is set");
      } else {
        console.log("Token is not set");
      }
    };
    tokenChecker();
    databaseHandling();
  }, []);
  return (
    <EmailProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </EmailProvider>
    // <TempScreen />
  );
}
