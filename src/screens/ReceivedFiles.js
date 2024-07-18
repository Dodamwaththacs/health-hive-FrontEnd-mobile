import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { text } from "@fortawesome/fontawesome-svg-core";

const ReceivedFiles = ({ route }) => {
  const { userId } = route.params;
  const [files, setFiles] = useState([]);

  const navigation = useNavigation();

  const fetchFiles = () => {
    console.log("userId", userId);
    axios

      .get(
        `http://13.202.67.81:10000/usermgtapi/api/shareFiles/user/${userId}`,
        {
          headers: {
            accept: "application/json",
          },
        }
      )

      .then((response) => {
        setFiles(response.data);
        console.log("notification", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchFiles();
    }, [userId])
  );

  const handleFilePress = (hash) => {
    console.log("fileHash", hash);
    navigation.navigate("DocumentViewer", { documentUri: hash });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleFilePress(item.fileHash)}>
      <View
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View>
          <Icon name="document-outline" size={40} color="#000" />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text>From : {item.patientName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 , backgroundColor:"#FFF" }}>
      <Text style={styles.text}>Here you can find document someone shares to you</Text>
      <FlatList
        data={files}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  editButton: {
    backgroundColor: "#14213d",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  text:{
fontSize:18,
color:"#003366",
justifyContent:"center",
  },
});

export default ReceivedFiles;
