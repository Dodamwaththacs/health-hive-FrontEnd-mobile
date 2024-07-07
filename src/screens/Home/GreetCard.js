import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const GreetCard = () => {
  const [tips, setTips] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.178.140:33000/api/dailyTips?limit=5"
        );
        setTips(response.data);
      } catch (error) {
        console.error("Error fetching tips:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        currentIndexRef.current = (currentIndexRef.current + 1) % tips.length;
        setCurrentIndex(currentIndexRef.current);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [tips, fadeAnim]);

  if (tips.length === 0) {
    return null;
  }

  const currentTip = tips[currentIndex];
  const nextIndex = (currentIndex + 1) % tips.length;
  const nextTip = tips[nextIndex];
  const typeColor = getTypeColor(currentTip.type);
  const nextTypeColor = getTypeColor(nextTip?.type);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            backgroundColor: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [nextTypeColor + "20", typeColor + "20"],
            }),
          },
        ]}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            name={getIconName(currentTip.type)}
            size={24}
            color={typeColor}
            style={styles.icon}
          />
          <Text style={[styles.heading, { color: typeColor }]}>
            {currentTip.type}
          </Text>
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <ScrollView style={styles.scrollView}>
          <Text style={[styles.text, { color: typeColor }]}>
            {currentTip.tip}
          </Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const getIconName = (type) => {
  switch (type) {
    case "Health Tips":
      return "lightbulb";
    case "Health Warnings":
      return "warning";
    case "Health News":
      return "article";
    default:
      return "info";
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case "Health Tips":
      return "#4CAF50";
    case "Health Warnings":
      return "#F44336";
    case "Health News":
      return "#2196F3";
    default:
      return "#757575";
  }
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    height: 90,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default GreetCard;
