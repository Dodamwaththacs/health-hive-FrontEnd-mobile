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

const ItemComponent = ({
  item,
  fileOpen,
  filemodalVisible,
  setFileModalVisible,
  fileDownloadUri,
  setFileDownloadUri,
  showCheckboxes,
  selectedItems,
  setSelectedItems,
}) => {
  const [isSelected, setSelection] = useState(false);

  useEffect(() => {
    if (isSelected) {
      setSelectedItems((prevItems) => [...prevItems, item.id]);
    } else {
      setSelectedItems((prevItems) => prevItems.filter((id) => id !== item.id));
    }
  }, [isSelected]);

  return (
    <View style={styles.itemContainer}>
      <View style={styles.icon}>
        <TouchableOpacity onPress={() => fileOpen(item.hash)}>
          <Icon name="document-outline" size={50} color="#000" />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.fileName}>{item.fileName}</Text>
      </View>

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
});

export default ItemComponent;
