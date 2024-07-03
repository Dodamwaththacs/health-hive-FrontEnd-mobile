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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>File Name</Text>
          <TextInput
            style={{ borderWidth: 1, width: "80%" }}
            value={fileName}
            onChangeText={(text) => setFileName(text)}
          />
          <Text>Description</Text>
          <TextInput
            style={{ borderWidth: 1, width: "80%" }}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <Button
            title="Save"
            onPress={() => {
              handleRename();
            }}
          />
          <Button
            title="Cancel"
            onPress={() => {
              setRenameModalVisible(false);
            }}
          />
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
  },
  description: {
    fontSize: 14,
  },
  editIcon: {
    marginLeft: "auto",
  },
  checkboxContainer: {
    marginLeft: 10,
  },
});

export default ItemComponent;
