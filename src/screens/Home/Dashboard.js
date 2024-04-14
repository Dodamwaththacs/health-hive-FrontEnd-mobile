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
        <Text style={styles.texttHead}>Daily tips...</Text>
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
      <Text style={styles.texttHead}>Your weight...</Text>
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

const data = [
  { id: '1', name: 'Item 1', date: '2022-01-01' },
  { id: '2', name: 'Item 2', date: '2022-01-02' },
  { id: '3', name: 'Item 3', date: '2022-01-03' },
  // Add more items as needed
];

const ListCard = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
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
  texttHead: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
  },
  text: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },

  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  date: {
    fontSize: 16,
  },
});

export default Dashboard;
