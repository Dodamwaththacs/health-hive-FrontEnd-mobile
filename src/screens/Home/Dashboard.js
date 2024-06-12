import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from 'axios';
import { useEmail } from "../../EmailContext";
import Icon from 'react-native-vector-icons/Ionicons';
import * as SQLite from "expo-sqlite";

const UserProfileCard = ({ user, onPress }) => {
  if (!user) {
    return (
      <View style={styles.card}>
        <Text>Loading user data...</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={require("../../assets/profilePic.jpg")}
        style={styles.photo}
      />
      <View style={styles.details}>
        <Text style={styles.greeting}>Hello, </Text>
        <Text style={styles.name}>{user.fullName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const GreetCard = () => {
  return (
    <View style={styles.card1}>
      <Text style={styles.text}>
        "Drink enough water daily for good health; aim for at least 8 cups. Your body will thank you!"
      </Text>
    </View>
  );
};

const fetchDataByEmail = async (email) => {
  try {
    const response = await axios.get(`http://192.168.151.43:33000/api/users/email/${email}`);
    console.log('Data fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
};

const ChartsCard = () => {
  return (
    <View>
      <Text style={styles.textHeader}>Your weight...</Text>
      <LineChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [{ data: [70, 73, 79, 76, 70, 65] }],
        }}
        width={Dimensions.get("window").width}
        height={220}
        yAxisLabel="kg"
        yAxisInterval={5}
        chartConfig={{
          backgroundColor: "#ffd600",
          backgroundGradientFrom: "#ff6d00",
          backgroundGradientTo: "#ffab00",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          margin: 10,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const formatDate = (dateString) => {
  const parsedDate = Date.parse(dateString);
  if (isNaN(parsedDate)) {
    return "Invalid date";
  }
  const date = new Date(parsedDate);
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
  return date.toLocaleString(undefined, options);
};

const ListCard = ({ documents, user, navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => openDocument(item, navigation)}>
      <Icon name="document-outline" size={50} color="#000" />
      <View>
        <Text style={styles.title}>{item.fileName}</Text>
        <Text style={styles.titledescription}>{item.description}</Text>
        <Text style={styles.uploadDate}>Uploaded on: {formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <UserProfileCard user={user} onPress={() => navigation.navigate('UserProfile', { userData: user })} />
          <GreetCard />
          <ChartsCard />
          <Text style={styles.textHeader}>Recent Uploads</Text>
        </>
      }
      data={documents}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const openDocument = (item, navigation) => {
  navigation.navigate('DocumentView', { item });
};

const Dashboard = ({ navigation }) => {
  const [documents, setDocuments] = useState([]);
  const [user, setUser] = useState(null);
  const { email } = useEmail();

  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        const userData = await fetchDataByEmail(email);
        setUser(userData);
      }

      const db = await SQLite.openDatabaseAsync("HealthHive");
      const response = await db.getAllAsync(
        `SELECT * FROM fileStorage ORDER BY id DESC LIMIT 5;`
      );
      setDocuments(response);
      db.closeAsync();
    };

    fetchData();
  }, [email]);

  return (
    <View style={styles.container}>
      <ListCard documents={documents} user={user} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
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
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    color: "#888",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontStyle: "italic",
  },
  textHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  uploadDate: {
    fontSize: 14,
    color: "#888",
  },
});

export default Dashboard;
