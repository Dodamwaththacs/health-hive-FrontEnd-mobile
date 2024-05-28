import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { EmailProvider } from "./src/EmailContext";
import StackNavigation from "./src/navigation/StackNavigation";
import FolderNavigation from "./src/screens/Home/documents/FolderNavigation";
import * as SQLite from "expo-sqlite";

// import PDFView from './src/screens/Home/PDFView';
// import FileDownload from './src/screens/Home/fileDownload';
// import DocumentIPFS from './src/screens/Home/DocumentIPFS';
// import Documents from './src/screens/Home/documents/Documents';

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
      );`
      );
      db.closeAsync();
    };
    databaseHandling();
  }, []);
  return (
    <EmailProvider>
      <NavigationContainer>
        {/* <StackNav5igation /> */}
        <FolderNavigation />
      </NavigationContainer>
    </EmailProvider>
    // <DocumentIPFS />
    // <FileDownloader />
    // <Documents />
    // <PDFView />
    // <FileDownload />
  );
}
