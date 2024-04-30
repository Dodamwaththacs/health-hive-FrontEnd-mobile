import React from "react";
import { View, Text, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";

const UserProfileCard = ({ user, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={require("../../assets/profilePic.jpg")}
        style={styles.photo}
      />
      <View style={styles.details}>
        <Text style={styles.greeting}>Hello, </Text>
        <Text style={styles.name}>{user.name}</Text>
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
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
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

const ListCard = ({ documents, navigation }) => {
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
          <UserProfileCard user={{ name: "Bhagya" }} onPress={() => navigation.navigate('UserProfile', { user: { /* user data */ } })
} />
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

function Dashboard({ navigation }) {
  const documents = [
    { id: 1, name: "Document 1", uploadDate: "2024-04-14" },
    { id: 2, name: "Document 2", uploadDate: "2024-04-13" },
    { id: 3, name: "Document 3", uploadDate: "2024-04-12" },
    { id: 4, name: "Document 4", uploadDate: "2024-04-11" },
    { id: 5, name: "Document 5", uploadDate: "2024-04-10" },
    { id: 6, name: "Document 6", uploadDate: "2024-04-09" },
  ];

  // Sort the documents by uploadDate in descending order and take the first 5
  const recentDocuments = documents.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)).slice(0, 5);

  return <ListCard documents={recentDocuments} navigation={navigation} />;
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
    color: "#888",
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  uploadDate: {
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default Dashboard;
