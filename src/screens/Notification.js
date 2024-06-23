import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const Notification = ({ route }) => {
  const { userId } = route.params;
  const [files, setFiles] = useState([]);
  const navigation = useNavigation();

  const fetchFiles = () => {
    console.log("userId", userId);
    axios
      .get(`http://192.168.94.140:33000/api/shareFiles/user/${userId}`, {
        headers: {
          accept: "application/json",
        },
      })
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
        style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
      >
        <Text>Doctor ID: {item.doctorId}</Text>
        <Text>File Hash: {item.fileHash}</Text>
        <Text>Lab Report Share: {item.labReportShare}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>This is Notification!</Text>
      <FlatList
        data={files}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Notification;
