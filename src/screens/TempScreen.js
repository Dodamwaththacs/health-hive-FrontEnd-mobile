import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import * as SQLite from "expo-sqlite";
import { useEmail } from "../EmailContext";

const TempScreen = () => {
  const email = "adam@email.com";

  const databasedata = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    console.log("Fetching documents...");
    console.log(email);

    const response = await db.getAllAsync(
      `SELECT * FROM fileStorage WHERE userEmail = '${email}' AND folderName = "newfolder" ;`
    );
    console.log(response);
    db.closeAsync();
  };
  return (
    <View style={styles.TempScreen}>
      <Text>TempScreen!</Text>
      <Button title="Database" onPress={databasedata} />
    </View>
  );
};

const styles = StyleSheet.create({
  TempScreen: {
    textAlign: "center",
  },
});

export default TempScreen;
