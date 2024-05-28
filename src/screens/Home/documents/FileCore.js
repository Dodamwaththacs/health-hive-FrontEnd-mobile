import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";


export const renderItem = ({ item }) => {

  const hashPrint = (hash) => {
    console.log(hash);
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.icon}>
        <TouchableOpacity onPress={() => hashPrint(item.hash)}>
          <Icon name="document-outline" size={50} color="#000" />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.fileName}>{item.fileName}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      

     
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
  },
  fileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
  },
  folderName: {
    fontSize: 14,
  },
  hash: {
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalCloseButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
});