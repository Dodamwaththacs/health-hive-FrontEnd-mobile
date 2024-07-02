import React, { useState, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { useEmail } from "../../EmailContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect hook
import Icon from "react-native-vector-icons/Ionicons";
import * as SQLite from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
// import GreetCard from "./GreetCard";
import GreetCard from "./GreetCard";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import ChartsCard from "./ChartsCard";
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
        source={
          user.profilePictureUrl
            ? { uri: user.profilePictureUrl }
            : require("../../assets/profilePic.jpeg")
        }
        style={styles.photo}
      />
      <View style={styles.details}>
        <Text style={styles.greeting}>Hello, </Text>
        <Text style={styles.name}>{user.fullName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const fetchDataByEmail = async (email) => {
  try {
    const response = await axios.get(
      `http://192.168.4.140:33000/api/users/email/${email}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
};

const formatDate = (dateString) => {
  const parsedDate = Date.parse(dateString);
  if (isNaN(parsedDate)) {
    return "Invalid date";
  }
  const date = new Date(parsedDate);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return date.toLocaleString(undefined, options);
};

const openDocument = (item, navigation) => {
  navigation.navigate("DocumentViewer", { documentUri: item.hash });
};

const ListCard = ({ documents, user, navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => openDocument(item, navigation)}
    >
      <Icon name="document-outline" size={50} color="#000" marginLeft={10} />
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.fileName}</Text>
        <Text style={styles.titledescription}>{item.description}</Text>
        <Text style={styles.uploadDate}>
          Uploaded on: {formatDate(item.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <UserProfileCard
            user={user}
            onPress={() =>
              navigation.navigate("UserProfile", { userData: user })
            }
          />

          <GreetCard />

          {user && <ChartsCard userId={user.id} />}
          <Text style={styles.textHeader}>Recent Uploads</Text>
        </>
      }
      data={documents}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const Dashboard = ({ navigation }) => {
  const [documents, setDocuments] = useState([]);
  const [user, setUser] = useState(null);

  console.log("user:", user);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const email = await SecureStore.getItemAsync("userEmail");
        const userData = await fetchDataByEmail(email);
        setUser(userData);
      };
      const fetchDocuments = async () => {
        console.log("Use focus effect ");
        const email = await SecureStore.getItemAsync("userEmail");

        const db = await SQLite.openDatabaseAsync("HealthHive");
        const response = await db.getAllAsync(
          `SELECT * FROM fileStorage WHERE userEmail = "${email}"  ORDER BY id DESC LIMIT 5 ;`
        );

        console.log("Documents fetched in use focus effect :", response);
        setDocuments(response);
        db.closeAsync();
      };

      fetchDocuments();
      fetchUserData();

      return () => {
        // Any cleanup operation goes here if needed
      };
    }, []) // Empty dependency array ensures this runs once when the screen comes into focus
  );

  useEffect(() => {
    const fetchData = async () => {
      const email = await SecureStore.getItemAsync("userEmail");

      const userData = await fetchDataByEmail(email);
      setUser(userData);
    };
    fetchData();
    // fetchDocuments();
  }, []);

  return (
    <View style={styles.container}>
      <ListCard documents={documents} user={user} navigation={navigation} />
    </View>
  );
};

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

  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10,
  },
  text: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#bbdefb",
    flexDirection: "row",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  itemContainer: {
    marginRight: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginLeft: 0,
  },
  titledescription: {
    fontSize: 16,
    color: "black",
    marginLeft: 0,
  },
  uploadDate: {
    fontSize: 14,
    color: "black",
    marginLeft: 0,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default Dashboard;
