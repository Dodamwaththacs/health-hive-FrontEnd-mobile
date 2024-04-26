import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Ensure you have expo-image-picker installed

const UserProfile = ({ route, navigation }) => {
  const { user } = route.params;
  const [profileData, setProfileData] = useState({
    profilePic: user.profilePic || 'default_uri_if_needed',
    weight: user.weight || '', // Provide a default value
    contactNumber: user.contactNumber,
    address: user.address,
  });

  const handleSave = () => {
    console.log('Profile data saved:', profileData);
    navigation.goBack();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.uri) {
      setProfileData({ ...profileData, profilePic: result.uri });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: profileData.profilePic }} style={styles.profilePic} />
      </TouchableOpacity>
      <Text style={styles.label}>Username (cannot be changed):</Text>
      <Text style={styles.inputFixed}>{user.username}</Text>
      <Text style={styles.label}>Name (cannot be changed):</Text>
      <Text style={styles.inputFixed}>{user.name}</Text>
      <Text style={styles.label}>Date of Birth (cannot be changed):</Text>
      <Text style={styles.inputFixed}>{user.dob}</Text>
      <Text style={styles.label}>Weight (kg):</Text>
      <TextInput
        style={styles.input}
        value={profileData.weight.toString()} // Ensure toString is safe to call
        onChangeText={(text) => setProfileData({ ...profileData, weight: text })}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Contact Number:</Text>
      <TextInput
        style={styles.input}
        value={profileData.contactNumber}
        onChangeText={(text) => setProfileData({ ...profileData, contactNumber: text })}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Address:</Text>
      <TextInput
        style={styles.input}
        value={profileData.address}
        onChangeText={(text) => setProfileData({ ...profileData, address: text })}
      />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  inputFixed: {
    width: '90%',
    padding: 10,
    marginBottom: 20,
    color: '#666',
    backgroundColor: '#e9e9e9',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginTop: 10,
  },
});

export default UserProfile;
