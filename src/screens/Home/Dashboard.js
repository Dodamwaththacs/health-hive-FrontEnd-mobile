import React, { useState, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { useEmail } from "../../EmailContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect hook
import Icon from "react-native-vector-icons/Ionicons";
import * as SQLite from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
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
        "Drink enough water daily for good health; aim for at least 8 cups. Your
        body will thank you!"
      </Text>
    </View>
  );
};

const fetchDataByEmail = async (email) => {
  try {
    const response = await axios.get(
      `http://192.168.205.43:33000/api/users/email/${email}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
};

const ChartsCard = ({ userId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [notes, setNotes] = useState("");
  const [userData, setUserData] = useState([]);

  const handleAddButtonPress = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!weight || !height) {
      Alert.alert("Error", "Please enter both weight and height.");
      return;
    }

    Alert.alert(
      "Confirm Submission",
      "Are you sure you want to add this data?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const data = { weight, height, notes, user: userId, date: new Date() };
            try {
              await axios.post('http://192.168.205.43:33000/api/healthData', data);
              setModalVisible(false);
              fetchUserData();  // Fetch updated user data after submission
            } catch (error) {
              console.error("Error saving health data:", error);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://192.168.205.43:33000/api/healthData/userId/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData([]); // Set an empty array to ensure chart renders without data
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const calculateBMI = (weight, height) => {
    if (!weight || !height) {
      return 0; // Return 0 if weight or height is not provided
    }
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  };

  const chartData = userData.map(data => {
    if (data.weight && data.height) {
      return calculateBMI(data.weight, data.height);
    }
    return 0; // Default to 0 if weight or height is missing
  });

  const defaultData = {
    labels: userData.length > 0 ? userData.map(data => new Date(data.date).toLocaleString('default', { month: 'short' })) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      data: chartData.length > 0 ? chartData : [0, 0, 0, 0, 0, 0]
    }],
  };

  return (
    <View>
      <Text style={styles.textHeader}>Your BMI</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
        <Icon name="add-circle-outline" size={30} color="#000" />
      </TouchableOpacity>
      <LineChart
        data={defaultData}
        width={Dimensions.get("window").width}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" BMI"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#ffd600",
          backgroundGradientFrom: "#ff6d00",
          backgroundGradientTo: "#ffab00",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        fromZero={true} // Ensure Y-axis starts from 0
        style={{ margin: 10, borderRadius: 16 }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add Your Health Data</Text>
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
          />
          <View style={styles.buttonContainer}>
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Cancel" onPress={handleCancel} color="#FF6347" />
          </View>
        </View>
      </Modal>
    </View>
  );
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
      <Icon name="document-outline" size={50} color="#000" />
      <View>
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

  useFocusEffect(
    React.useCallback(() => {
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

      return () => {
        // Any cleanup operation goes here if needed
      };
    }, []) // Empty dependency array ensures this runs once when the screen comes into focus
  );

  useEffect(() => {
    // const fetchDocuments = async () => {
    //   console.log("Fetch document ");
    //   const db = await SQLite.openDatabaseAsync("HealthHive");
    //   const response = await db.getAllAsync(
    //     `SELECT * FROM fileStorage WHERE userEmail = "adam@email.com"  ORDER BY id DESC LIMIT 5 ;`
    //   );

    //   console.log("Documents fetched in use effect :", response);
    //   setDocuments(response);
    //   db.closeAsync();
    // };
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

    color: "black",
  },
  uploadDate: {
    fontSize: 14,
    color: "gray",
  },
  listContainer: {
    paddingBottom: 20,
  },

 
    addButton: {
      position: 'absolute',
      right: 10,
      top: 10,
      zIndex: 1,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontSize: 20,
    },
    input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 10,
      width: "100%",
      padding: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },

  
});

export default Dashboard;
