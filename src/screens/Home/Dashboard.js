import React from "react";
import { View, Text, StyleSheet, Image} from "react-native";

const UserProfileCard = ({ user }) => {
  return (
    <View style={styles.card}>
      <Image source={require('../../assets/profilePic.jpg')} style={styles.photo} />
      <View style={styles.details}>
        <Text style={styles.greeting}>Hello, </Text>
        <Text style={styles.name}>{user.name}</Text>
      </View>
    </View>
  );
};

function Dashboard () {
  const user = { name: 'chamika' }; // Define user object

  return(
    <View>
      <UserProfileCard user={user} />
      <Text>This is Dashboard!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 40,
    shadowColor: '#000',
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
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 14,
    color: '#888',
  },
});


export default Dashboard;
