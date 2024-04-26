import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const UserProfile = ({ route, navigation }) => {
  // Assuming you will handle the state accordingly for each field
  const [profileData, setProfileData] = useState({
    profilePic: '../../assets/profilePic.jpg', // You need to replace this with your actual default image URI
    firstName: '',
    lastName: '',
    NIC: '',
    gender: '',
    dateOfBirth: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    weight: '',
    height: '',
  });

  const handleSave = () => {
    // Implement the save functionality here, such as sending the data to a backend service
    Alert.alert('Profile Updated', 'Your profile details have been saved successfully.');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileData({ ...profileData, profilePic: result.uri });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: profileData.profilePic }} style={styles.profilePic} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProfileData({ ...profileData, firstName: text })}
        value={profileData.firstName}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProfileData({ ...profileData, lastName: text })}
        value={profileData.lastName}
        placeholder="Last Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProfileData({ ...profileData, NIC: text })}
        value={profileData.NIC}
        placeholder="NIC"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProfileData({ ...profileData, gender: text })}
        value={profileData.gender}
        placeholder="Gender"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProfileData({ ...profileData, dateOfBirth: text })}
        value={profileData.dateOfBirth}
        placeholder="Date of Birth"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProfileData({ ...profileData, addressLine1: text })}
        value={profileData.addressLine1}
        placeholder="Address Line 1"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProfileData({ ...profileData, addressLine2: text })}
        value={profileData.addressLine2}
        placeholder="Address Line 2"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProfileData({ ...profileData, city: text })}
        value={profileData.city}
        placeholder="City"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProfileData({ ...profileData, district: text })}
        value={profileData.district}
        placeholder="District"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProfileData({ ...profileData, weight: text })}
        value={profileData.weight}
        placeholder="Weight"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setProfileData({ ...profileData, height: text })}
        value={profileData.height}
        placeholder="Height"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'black', // Change this as needed to match your UI design
  },
  input: {
    backgroundColor: '#e9e9e9', // Color for the input field backgrounds
    borderRadius: 5, // Rounded corners for input fields
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    fontSize: 16, // Adjust the font size as necessary
  },
  button: {
    backgroundColor: '#007bff', // Button color
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16, // Adjust the font size as necessary
  },
});

export default UserProfile;
