import React from "react";
import { View, Text, StyleSheet, Image, Dimensions, FlatList, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

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
        <Text style={styles.textHeader}>Daily tips...</Text>
      </View>
    </View>
  );
};

const GreetCard = () => {
  return (
    <View style={styles.card1}>
      <Text style={styles.text}>
        "Drink enough water daily for good health aim for at least 8 cups. Your
        body will thank you!"
      </Text>
    </View>
  );
};

const ChartsCard = () => {
  return (
    <View>
      <Text style={styles.textHeader}>Your weight...</Text>
      <LineChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [70, 73, 79, 76, 70, 65], // Example weights for each month
            },
          ],
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisLabel={"kg"} // Change the y-axis label to 'kg'
        yAxisInterval={5} // Set the interval based on your preference
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 0, // No need for decimal places for weight
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


const ListCard = () => {

  // Dummy data for documents
  const documents = [
    { id: 1, name: 'Document 1', uploadDate: '2024-04-14' },
    { id: 2, name: 'Document 2', uploadDate: '2024-04-13' },
    { id: 3, name: 'Document 3', uploadDate: '2024-04-12' },
    { id: 4, name: 'Document 4', uploadDate: '2024-04-11' },
    { id: 5, name: 'Document 5', uploadDate: '2024-04-10' },
  ];

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.leftContainer}>
        <Text style={styles.title}>{item.name}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.uploadDate}>Uploaded on: {item.uploadDate}</Text>
      </View>
    </View>
  );

  return (
    <View>
      <Text style={styles.textHeader}>Document List</Text>
    <View style={styles.flcontainer}>
      
      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
    </View>
  );
};

function Dashboard() {
  const user = { name: "chamika" }; 

  return (
    <ScrollView>
    <View>
      <View>
        <UserProfileCard user={user} />
        <GreetCard />
        <ChartsCard />
        <ListCard />
        <Text>This is Dashboard!</Text>
      </View>
    </View>
    </ScrollView>
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
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  },
  text: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },

  //flat list styles
  flcontainer: {
    flex: 1,

    marginHorizontal: 10,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadDate: {
    fontSize: 14,
  },

});

export default Dashboard;
