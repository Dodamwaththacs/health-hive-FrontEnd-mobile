import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Button,
} from "react-native";
import Checkbox from "expo-checkbox";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const ItemComponent = ({
  item,
  filemodalVisible,
  setFileModalVisible,
  fileDownloadUri,
  setFileDownloadUri,
  showCheckboxes,
  selectedItems,
  setSelectedItems,
}) => {
  const [isSelected, setSelection] = useState(false);
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

  return (
    <View style={styles.itemContainer}>
      <View style={styles.icon}>
        <TouchableOpacity onPress={() => openDocument(item.hash)}>
          <Icon name="document-outline" size={50} color="#000" />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.fileName}>{item.fileName}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRenamePress(dir)}>
        <FontAwesome5 name="edit" size={20} color="blue" />
      </TouchableOpacity>

      {showCheckboxes && (
        <View>
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
});

export default ItemComponent;
