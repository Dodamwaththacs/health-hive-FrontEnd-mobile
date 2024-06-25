import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const GreetCard = () => {
  const [tip, setTip] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      console.log("GreetCard mounted");
      const response = await axios.get(
        "http://10.10.18.247:33000/api/dailyTips"
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
    flexDirection: "row",
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 } ,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontStyle: "italic",
  },
});

export default GreetCard;
