import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { EmailProvider } from "./src/EmailContext";
import StackNavigation from "./src/navigation/StackNavigation";
import FolderNavigation from "./src/screens/Home/documents/FolderNavigation";
import * as SQLite from "expo-sqlite";

export default function App() {
  useEffect(() => {
    const databaseHandling = async () => {
      const db = await SQLite.openDatabaseAsync("HealthHive");
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS fileStorage (
        id INTEGER PRIMARY KEY NOT NULL,
        fileName TEXT NOT NULL,
        folderName TEXT NOT NULL,
        description TEXT NOT NULL,
        hash TEXT NOT NULL,
        date DATE DEFAULT CURRENT_DATE
      );
      CREATE TABLE IF NOT EXISTS folderData (
      id INTEGER PRIMARY KEY NOT NULL,
      folderName TEXT NOT NULL);
      `
      );
      db.closeAsync();
    };
    databaseHandling();
  }, []);
  return (
    <EmailProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </EmailProvider>
  );
}
