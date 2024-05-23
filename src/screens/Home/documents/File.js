import React from "react";
import { View, Text,StyleSheet,Button } from "react-native";
import * as FileSystem from "expo-file-system";

const FileScreen = ({ route }) => {
  const { folderId } = route.params;

  const baseDir = `${FileSystem.documentDirectory}AppStorage/`;

  const dir = (dir) => {
    console.log(dir);
    console.log(baseDir);
  }
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.head} > {folderId}</Text>
        <Button onPress={() => dir(folderId)} title="Dir" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    head: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 0,
    },
    });


export default FileScreen;
