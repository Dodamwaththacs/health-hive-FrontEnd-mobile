import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Modal,
  Button
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const UserProfile = ({ route, navigation }) => {
  const [userData, setUserData] = useState({
    name: 'Bhagya',
    email: 'bhagya.@example.com',
    dateOfBirth: '1990-01-01',
    gender: 'Female',
    nic: '123456789V',
    address: '1234 Main St',
    contactNumber: '555-1234',
  });
  const [profilePicUri, setProfilePicUri] = useState(null);
  const [imageActionModalVisible, setImageActionModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleChoosePhoto = async (fromCamera) => {
    let result;
    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
    }

    if (!result.cancelled) {
      setProfilePicUri(result.uri);
      setImageActionModalVisible(false);
    }
  };

  const handleDeletePhoto = () => {
    setProfilePicUri(null);
    setImageActionModalVisible(false);
  };

  const openImageActions = () => {
    setImageActionModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Modal
        visible={imageActionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setImageActionModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.button} onPress={() => handleChoosePhoto(true)}>
              <Ionicons name="camera" size={30} color="black" />
              <Text style={styles.textStyle}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleChoosePhoto(false)}>
              <Ionicons name="images" size={30} color="black" />
              <Text style={styles.textStyle}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDeletePhoto}>
              <Ionicons name="trash-bin" size={30} color="black" />
              <Text style={styles.textStyle}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => openImageActions()}>
          <Image
            source={profilePicUri ? { uri: profilePicUri } : require('../../assets/profilePic.jpg')}
            style={styles.profilePic}
          />
          <Ionicons name="pencil" size={30} color="white" style={styles.editIcon} />
        </TouchableOpacity>
        <Text style={styles.nameText}>{userData.name}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Email: {userData.email}</Text>
        <Text style={styles.infoText}>Date of Birth: {userData.dateOfBirth}</Text>
        <Text style={styles.infoText}>NIC: {userData.nic}</Text>
        <Text style={styles.infoText}>Gender: {userData.gender}</Text>
        <Text style={styles.infoText}>Address: {userData.address}</Text>
        <Text style={styles.infoText}>Contact: {userData.contactNumber}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 6,
    borderRadius: 15,
  },
  nameText: {
    fontSize: 18,
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    padding: 10,
    elevation: 2,
    alignItems: 'center',
    marginBottom: 10,
  },
  textStyle: {
    color: "black",
    textAlign: "center"
  },
  infoContainer: {
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#e9e9ef',
    padding: 10,
    borderRadius: 5,
  }
});

export default UserProfile;
