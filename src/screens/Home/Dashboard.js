import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const UserProfileCard = ({ user }) => {
  return (
    <View>
      <View style={styles.card}>
        <Image
          source={require("../../assets/profilePic.jpg")}
          style={styles.photo}
        />
        <View style={styles.details}>
          <Text style={styles.greeting}>Hello, </Text>
          <Text style={styles.name}>{user.name}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.greetHead}>Daily tips...</Text>
      </View>
    </View>
  );
};

const GreetCard = () => {
  return (
    <View style={styles.card1}>
      <Text style={styles.text}> "Drink enough water daily for good health—aim for at least 8 cups. Your body will thank you!"</Text>
    </View>
  );
};

function Dashboard() {
  const user = { name: "chamika" }; // Define user object

  return (
    <View>
      <View>
        <UserProfileCard user={user} />
        <GreetCard />
        <Text>This is Dashboard!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },

  card1: {
    flexDirection: "row",
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  details: {
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  greeting: {
    fontSize: 14,
    color: "#888",
  },
  greetHead: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
  },
  text: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
});

export default Dashboard;
