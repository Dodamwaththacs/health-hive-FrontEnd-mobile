import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import Checkbox from "expo-checkbox";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import * as SQLite from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
import ItemComponent from "./ItemComponents";

const LabFolder = ({ route }) => {
  const { folderName } = route.params;
  const [data, setData] = useState([]);
  const [folderData, setFolderData] = useState([]);
  const [filemodalVisible, setFileModalVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [fileDownloadUri, setFileDownloadUri] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [email, setEmail] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchDataFromOrigin = async () => {
        const email = await SecureStore.getItemAsync("userEmail");
        setEmail(email);

        try {
          const response = await axios.get(
            "http://192.168.40.140:33000/api/files/user/2"
          );
          const originData = response.data;

          const db = await SQLite.openDatabaseAsync("HealthHive");

          for (let i = 0; i < originData.length; i++) {
            console.log(originData[i]);
            try {
              await db.execAsync(
                `INSERT INTO fileStorage (userEmail, fileName, folderName, description, hash) VALUES ('${email}','${originData[i].name}', '${folderName}', '${originData[i].filePath}', '${originData[i].fileHash}');`
              );
              try {
                await axios.delete(
                  "http://192.168.40.140:33000/api/files/" + originData[i].id
                );
              } catch (error) {
                console.error("Error data delete : ", error);
                console.error("files :", originData[i].id);
              }

              try {
                await axios.delete(
                  "http://192.168.40.140:33000/api/labDataUploads/" +
                    originData[i].labDataUploadId
                );
              } catch (error) {
                console.error("Error data delete : ", error);
                console.error(
                  "labDataUploads :",
                  originData[i].labDataUploadId
                );
              }

              try {
                await axios.delete(
                  "http://192.168.40.140:33000/api/labRequests/" +
                    originData[i].labRequestId
                );
              } catch (error) {
                console.error("Error data delete : ", error);
                console.error("labRequests :", originData[i].labRequestId);
              }
            } catch (error) {
              console.error("Error data insert : ", error);
            }
          }

          const responseFinal = await db.getAllAsync(
            `SELECT * FROM fileStorage WHERE folderName = "${folderName}"  ;`
          );
          console.log("inserted data response :", responseFinal);

          console.log("Origin data fetched :", response.data);
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          fetchDataFromLocal();
        }
      };

      const fetchDataFromLocal = async () => {
        const db = await SQLite.openDatabaseAsync("HealthHive");
        const response = await db.getAllAsync(
          `SELECT * FROM fileStorage WHERE folderName = "${folderName}"  ;`
        );
        setData(response);
        await db.closeAsync();
      };

      fetchDataFromOrigin();

      return () => {};
    }, [folderName, folderModalVisible])
  );

  const handleMove = async () => {
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const response = await db.getAllAsync(
      `SELECT  folderName
      FROM folderData
      WHERE folderName <> 'LabReports'
      ORDER BY folderName ASC;`
    );
    await db.closeAsync();
    setFolderData(response);
    console.log("folder data :", response);
    setFolderModalVisible(true);

    console.log("inseted data responce :", response);
    setShowCheckboxes(false);
  };

  const alterTable = async (moveFolderName) => {
    console.log("moveFolderName :", moveFolderName);
    const db = await SQLite.openDatabaseAsync("HealthHive");
    try {
      for (let i = 0; i < selectedItems.length; i++) {
        await db.runAsync(
          `UPDATE fileStorage SET folderName = "${moveFolderName}" WHERE id = ${selectedItems[i]} ;`
        );
      }
      alert("Files moved successfully!");
    } catch (error) {
      console.error("Error data update : ", error);
    } finally {
      await db.closeAsync();
      setSelectedItems([]);
      setFolderModalVisible(false);
    }
  };

  const renderItem = ({ item }) => (
    <ItemComponent
      item={item}
      filemodalVisible={filemodalVisible}
      setFileModalVisible={setFileModalVisible}
      fileDownloadUri={fileDownloadUri}
      setFileDownloadUri={setFileDownloadUri}
      showCheckboxes={showCheckboxes}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
    />
  );

  const renderFolderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => alterTable(item.folderName)}
      >
        <Text style={styles.title}>{item.folderName}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.head}>{folderName}</Text>
      <Text style={styles.head2}>
        Here you can find all the documents related to the lab.
      </Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {!showCheckboxes && data.length > 0 && (
        <Button
          title="Move file"
          onPress={() => setShowCheckboxes(!showCheckboxes)}
        />
      )}
      {selectedItems.length > 0 && showCheckboxes && (
        <Button title="done" onPress={handleMove} />
      )}

      <Modal animationType="slide" visible={folderModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.moveFolderHeader}>
              <Text>Select folder you want to move</Text>
              <TouchableOpacity>
                <Icon
                  name="close"
                  size={30}
                  color={"blue"}
                  onPress={() =>
                    setFolderModalVisible(false) && setSelectedItems(null)
                  }
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={folderData}
              renderItem={renderFolderItem}
              keyExtractor={(item) => item.folderName}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
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
  head: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  head2: {
    fontSize: 18,
    marginBottom: 10,
  },

  moveFolderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // other styles...
  },
  item: {
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 4, // Add some elevation for a subtle shadow effect
  },
  touchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "30%", // Adjust the height as per your requirement
  },
});

export default LabFolder;
