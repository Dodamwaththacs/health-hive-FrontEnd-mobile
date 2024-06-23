import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const GreetCard = () => {
  const [tip, setTip] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      console.log("GreetCard mounted");
      const response = await axios.get(
        "http://192.168.94.140:33000/api/dailyTips"
      );
      console.log("response", response.data);
      console.log("response.data[0].tip", response.data[0].tip);
      setTip(response.data[0].tip);
    };
    fetchData();
  });

  return (
    <View style={styles.card1}>
      <Text style={styles.text}>{tip}</Text>
    </View>
  );
};

styles = StyleSheet.create({
  card1: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,

    shadowRadius: 2,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontStyle: "italic",
  },
});

export default GreetCard;
