import React from "react";
import { View, Text, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from 'axios';
import { useEmail } from "../../EmailContext";



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
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null; // Return null in case of error
  }
}
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

const ListCard = ({ documents, user, navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.uploadDate}>Uploaded on: {item.uploadDate}</Text>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <UserProfileCard user={user} onPress={() => navigation.navigate('UserProfile', {userData:user })} />
          <GreetCard />
          <ChartsCard />
          <Text style={styles.textHeader}>Document List</Text>
        </>
      }
      data={documents}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const Dashboard = ({ navigation }) => {
  const [user, setUser] = React.useState(null);
  const { email } = useEmail();

  React.useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchDataByEmail(email);
      if (userData) {
        setUser(userData);
      }
    };

    getUserData();
  }, []);

  const documents = [
    { id: 1, name: "Document 1", uploadDate: "2024-04-14" },
    { id: 2, name: "Document 2", uploadDate: "2024-04-13" },
    { id: 3, name: "Document 3", uploadDate: "2024-04-12" },
    { id: 4, name: "Document 4", uploadDate: "2024-04-11" },
    { id: 5, name: "Document 5", uploadDate: "2024-04-10" },
    { id: 6, name: "Document 6", uploadDate: "2024-04-09" },
  
  ];

  const recentDocuments = documents.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)).slice(0, 5);

  return (
    <View style={{ flex: 1 }}>
      <ListCard documents={recentDocuments} user={user} navigation={navigation} />
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
    shadowOffset: { width: 0, height: 2 } ,
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
    backgroundColor: "#ADD8E6",
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color:'black',
  },
  uploadDate: {
    fontSize: 14,
    color:'gray',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default Dashboard;