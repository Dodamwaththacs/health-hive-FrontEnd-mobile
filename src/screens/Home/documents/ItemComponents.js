import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Button,
  TextInput,
} from "react-native";
import Checkbox from "expo-checkbox";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as SQLite from "expo-sqlite";

const ItemComponent = ({
  item,
  filemodalVisible,
  setFileModalVisible,
  fileDownloadUri,
  setFileDownloadUri,
  showCheckboxes,
  selectedItems,
  setSelectedItems,
  setDropDown,
  dropDown,
}) => {
  const [isSelected, setSelection] = useState(false);
  const [id, setId] = useState(0);
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [renameModalVisible, setRenameModalVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (isSelected) {
      setSelectedItems((prevItems) => [...prevItems, item.id]);
    } else {
      setSelectedItems((prevItems) => prevItems.filter((id) => id !== item.id));
    }
  }, [isSelected]);

  const openDocument = (hash) => {
    navigation.navigate("DocumentViewer", { documentUri: hash });
  };

  const handleRenamePress = async (id, fileName, description) => {
    setId(id);
    setFileName(fileName);
    setDescription(description);
    setDropDown(false);
    setRenameModalVisible(true);
  };

  const handleRename = async () => {
    console.log("handleRename..");
    const db = await SQLite.openDatabaseAsync("HealthHive");
    const response1 = await db.execAsync(
      `UPDATE fileStorage SET fileName = "${fileName}", description = "${description}" WHERE id = ${id};`
    );
    console.log("response1..", response1);
    db.closeAsync();
    setRenameModalVisible(false);
    alert("File renamed successfully");
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.icon}>
        <TouchableOpacity onPress={() => openDocument(item.hash)}>
          <Icon name="document-outline" size={40} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.fileName}>{item.fileName}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      {dropDown && (
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() =>
            handleRenamePress(item.id, item.fileName, item.description)
          }
        >
          <FontAwesome5 name="edit" size={20} color="blue" />
        </TouchableOpacity>
      )}
      {showCheckboxes && (
        <View style={styles.checkboxContainer}>
          <Checkbox value={isSelected} onValueChange={setSelection} />
        </View>
      )}
      <Modal animationType="slide" visible={filemodalVisible}>
        <Image
          source={{ uri: fileDownloadUri }}
          style={{ width: "50%", height: "50%" }}
        />
        <Button onPress={() => setFileModalVisible(false)} title="Done" />
      </Modal>
      <Modal animationType="slide" visible={renameModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Rename File</Text>
          <TextInput
            style={styles.modalInput}
            value={fileName}
            onChangeText={(text) => setFileName(text)}
          />
          <Text style={styles.modalLabel}>Description</Text>
          <TextInput
            style={styles.modalInput}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Save" onPress={handleRename} />
            <Button
              title="Cancel"
              onPress={() => setRenameModalVisible(false)}
              color="#ff5c5c"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  fileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  editIcon: {
    marginLeft: "auto",
  },
  checkboxContainer: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
});

export default ItemComponent;
