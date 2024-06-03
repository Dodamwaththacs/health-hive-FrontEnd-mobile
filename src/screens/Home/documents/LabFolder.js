import React, { useEffect, useState } from "react";
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
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import * as SQLite from "expo-sqlite";

const LabFolder = ({ route }) => {
  const { folderName } = route.params;
  const [data, setData] = useState([]);
  const [filemodalVisible, setFileModalVisible] = useState(false);
  const [fileDownloadUri, setFileDownloadUri] = useState(null);

  useEffect(() => {
    const fetchDataFromOringin = async () => {
      try {
        const response = await axios.get(
          "http://10.10.7.114:33000/api/files/user/2"
        );
        const originData = response.data;

        const db = await SQLite.openDatabaseAsync("HealthHive");
        console.log("\n This is data insert funtion\n");
        console.log(originData.length);
        for (let i = 0; i < originData.length; i++) {
          console.log(originData[i]);
          try {
            await db.execAsync(
              `INSERT INTO fileStorage (fileName, folderName, description, hash) VALUES ('${originData[i].name}', '${folderName}', '${originData[i].filePath}', '${originData[i].fileHash}');`
            );
            try {
              await axios.delete(
                "http://10.10.7.114:33000/api/files/" + originData[i].id
              );
            } catch (error) {
              console.error("Error data delete : ", error);
              console.error("files :", originData[i].id);
            }

            try {
              await axios.delete(
                "http://10.10.7.114:33000/api/labDataUploads/" +
                  originData[i].labDataUploadId
              );
            } catch (error) {
              console.error("Error data delete : ", error);
              console.error("labDataUploads :", originData[i].labDataUploadId);
            }

            try {
              await axios.delete(
                "http://10.10.7.114:33000/api/labRequests/" +
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
        console.log("inseted data responce :", responseFinal);

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
      console.log("full loacal responce :", response);
      await db.closeAsync();
    };

    fetchDataFromOringin();
  }, []);

  const fileOpen = (hash) => {
    console.log(hash);
    setFileDownloadUri("http://10.10.7.114:33000/file/" + hash);
    setFileModalVisible(true);
  };

  const deleteTupple = async () => {
    const response = await axios.delete(
      "http://10.10.7.114:33000/api/files/10"
    );
    console.log("files :", response);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.icon}>
        <TouchableOpacity onPress={() => fileOpen(item.hash)}>
          <Icon name="document-outline" size={50} color="#000" />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.fileName}>{item.fileName}</Text>
      </View>
      <Modal animationType="slide" visible={filemodalVisible}>
        <Image
          source={{ uri: fileDownloadUri }}
          style={{ width: "50%", height: "50%" }}
        />
        <Button onPress={() => setFileModalVisible(false)} title="Done" />
      </Modal>
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
      <Button title="Delete" onPress={deleteTupple} />
      <Button title="Move file" onPress={{}} />
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
});

export default LabFolder;
