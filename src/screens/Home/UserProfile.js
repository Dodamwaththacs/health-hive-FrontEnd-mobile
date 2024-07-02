import React, { useState, useEffect } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEmail } from "../../EmailContext";
import { storage, ref } from "../../../firebaseConfig";
import { uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const UserProfile = ({ route, navigation }) => {
  const { userData } = route.params;
  const { email } = useEmail();

  const [user, setUser] = useState(userData);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    telephoneNumber: userData.telephoneNumber || "",
    emergencyContactName: userData.emergencyContactName || "",
    emergencyContactNumber: userData.emergencyContactNumber || "",
  });
  const [profilePicUri, setProfilePicUri] = useState(
    userData.profilePicUri || null
  );
  const [imageActionModalVisible, setImageActionModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.115.140:33000/api/users/${user.id}`
        );
        const fetchedUser = response.data;
        setUser(fetchedUser);
        setProfilePicUri(fetchedUser.profilePictureUrl || null);
        setEditData({
          telephoneNumber: fetchedUser.telephoneNumber || "",
          emergencyContactName: fetchedUser.emergencyContactName || "",
          emergencyContactNumber: fetchedUser.emergencyContactNumber || "",
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        Alert.alert("Error", "Failed to load user profile.");
      }
    };

    fetchUserData();

    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  const handleChoosePhoto = async (fromCamera) => {
    let result;
    try {
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

      if (!result.canceled) {
        const uri = fromCamera ? result.uri : result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(storage, `profilePics/${user.id}`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);
        setProfilePicUri(downloadURL);

        await axios.put(`http://192.168.115.140:33000/api/users/${user.id}`, {
          ...user,
          profilePictureUrl: downloadURL,
        });

        setImageActionModalVisible(false);
      }
    } catch (error) {
      console.error("Error picking or uploading image:", error);
      Alert.alert("Error", "Failed to pick or upload image. Please try again.");
    }
  };

  const handleDeletePhoto = async () => {
    try {
      if (profilePicUri) {
        const storageRef = ref(storage, `profilePics/${user.id}`);
        await deleteObject(storageRef);

        setProfilePicUri(null);

        await axios.put(`http://192.168.115.140:33000/api/users/${user.id}`, {
          ...user,
          profilePictureUrl: null,
        });

        setImageActionModalVisible(false);
      } else {
        console.warn("No profile pic URI to delete.");
      }
    } catch (error) {
      console.error("Error deleting image from Firebase Storage:", error);
      Alert.alert("Error", "Failed to delete image.");
    }
  };

  const openImageActions = () => {
    setImageActionModalVisible(true);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    const updatedUser = {
      ...user,
      ...editData,
      profilePictureUrl: profilePicUri,
    };
    try {
      const response = await axios.put(
        `http://192.168.115.140:33000/api/users/${user.id}`,
        updatedUser
      );
      setUser(updatedUser);
      setEditMode(false);
      Alert.alert(
        "Changes Saved",
        "Your profile has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () => console.log("Changes saved and confirmed"),
          },
        ]
      );
    } catch (error) {
      console.error("Failed to update user data:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const openPhotoModal = () => {
    setPhotoModalVisible(true);
  };

  const closePhotoModal = () => {
    setPhotoModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Modal
        visible={imageActionModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageActionModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={[styles.textStyle, { marginBottom: 20, fontSize: 18 }]}
            >
              Choose an option
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleChoosePhoto(true)}
            >
              <Ionicons name="camera" size={24} color="#0056B3" />
              <Text style={styles.textStyle}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleChoosePhoto(false)}
            >
              <Ionicons name="images" size={24} color="#0056B3" />
              <Text style={styles.textStyle}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDeletePhoto}>
              <Ionicons name="trash-bin" size={24} color="#0056B3" />
              <Text style={styles.textStyle}>Remove Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={() => setImageActionModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#0056B3" />
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={photoModalVisible}
        transparent={true}
        onRequestClose={closePhotoModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView2}>
            <Image
              key={profilePicUri}
              source={
                profilePicUri
                  ? { uri: profilePicUri }
                  : require("../../assets/profilePic.jpeg")
              }
              style={styles.fullSizeProfilePic}
            />
            <TouchableOpacity
              style={styles.closeButton2}
              onPress={closePhotoModal}
            >
              <Ionicons name="close-circle" size={30} color="#0056B3" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={openPhotoModal}>
          <Image
            key={profilePicUri}
            source={
              profilePicUri
                ? { uri: profilePicUri }
                : require("../../assets/profilePic.jpeg")
            }
            style={styles.profilePic}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openImageActions}
          style={styles.editIconContainer}
        >
          <Ionicons name="pencil" size={20} color="#0056B3" />
        </TouchableOpacity>
        <Text style={styles.nameText}>{user.fullName}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoText}>
          <Ionicons
            name="mail"
            size={24}
            color="#0056B3"
            style={styles.infoIcon}
          />
          <Text style={styles.detailsText}>{user.email}</Text>
        </View>
        <View style={styles.infoText}>
          <Ionicons
            name="calendar"
            size={24}
            color="#0056B3"
            style={styles.infoIcon}
          />
          <Text style={styles.detailsText}>{user.dateOfBirth}</Text>
        </View>
        <View style={styles.infoText}>
          <Ionicons
            name="card"
            size={24}
            color="#0056B3"
            style={styles.infoIcon}
          />
          <Text style={styles.detailsText}>{user.nic}</Text>
        </View>
        <View style={styles.infoText}>
          <Ionicons
            name="person"
            size={24}
            color="#0056B3"
            style={styles.infoIcon}
          />
          <Text style={styles.detailsText}>{user.gender}</Text>
        </View>
      </View>

      <View style={styles.contactInfoContainer}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <TouchableOpacity
          onPress={toggleEditMode}
          style={styles.editButton}
        ></TouchableOpacity>
        {editMode ? (
          <>
            <TextInput
              style={[
                styles.editableText,
                errors.telephoneNumber && styles.errorInput,
              ]}
              value={editData.telephoneNumber}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                setEditData({
                  ...editData,
                  telephoneNumber: numericText.slice(0, 10),
                });
              }}
              placeholder="Your Contact Number"
              keyboardType="numeric"
              maxLength={10}
            />
            {errors.telephoneNumber && (
              <Text style={styles.errorText}>{errors.telephoneNumber}</Text>
            )}

            <TextInput
              style={[
                styles.editableText,
                errors.emergencyContactName && styles.errorInput,
              ]}
              value={editData.emergencyContactName}
              onChangeText={(text) => {
                const alphabeticText = text.replace(/[^a-zA-Z\s]/g, "");
                setEditData({
                  ...editData,
                  emergencyContactName: alphabeticText,
                });
              }}
              placeholder="Emergency Contact Name"
            />
            {errors.emergencyContactName && (
              <Text style={styles.errorText}>
                {errors.emergencyContactName}
              </Text>
            )}

            <TextInput
              style={[
                styles.editableText,
                errors.emergencyContactNumber && styles.errorInput,
              ]}
              value={editData.emergencyContactNumber}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                setEditData({
                  ...editData,
                  emergencyContactNumber: numericText.slice(0, 10),
                });
              }}
              placeholder="Emergency Contact Number"
              keyboardType="numeric"
              maxLength={10}
            />
            {errors.emergencyContactNumber && (
              <Text style={styles.errorText}>
                {errors.emergencyContactNumber}
              </Text>
            )}
            {errors.emergencyContactNumber && (
              <Text style={styles.errorText}>
                {errors.emergencyContactNumber}
              </Text>
            )}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.infoText}>
              <Ionicons
                name="call"
                size={24}
                color="#0056B3"
                style={styles.infoIcon}
              />
              <Text style={styles.detailsText}>
                {editData.telephoneNumber || "Your Contact Number"}
              </Text>
            </View>
            <View style={styles.infoText}>
              <Ionicons
                name="person"
                size={24}
                color="#B30000"
                style={styles.infoIcon}
              />
              <Text style={styles.detailsText}>
                {editData.emergencyContactName || "Emergency Contact Person"}
              </Text>
            </View>
            <View style={styles.infoText}>
              <Ionicons
                name="call"
                size={24}
                color="#B30000"
                style={styles.infoIcon}
              />
              <Text style={styles.detailsText}>
                {editData.emergencyContactNumber || "Emergency Contact Number"}
              </Text>
            </View>
          </>
        )}
      </View>

      {!editMode && (
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={toggleEditMode}
        >
          <Text style={styles.editProfileText}>Edit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    alignItems: "center",
    backgroundColor: "#0056B3",
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "white",
  },
  editIconContainer: {
    position: "absolute",
    right: 145,
    bottom: 70,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  infoContainer: {
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 10,
  },
  detailsText: {
    color: "gray",
    fontFamily: "Arial",
  },
  contactInfoContainer: {
    padding: 20,
    marginTop: -30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0056B3",
  },
  editButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  editableText: {
    fontSize: 16,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#0056B3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  editProfileButton: {
    backgroundColor: "#0056B3",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  editProfileText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  modalView2: {
    margin: 0,
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 0,
    alignItems: "center",
  },
  button: {
    padding: 10,
    elevation: 2,
    alignItems: "center",
    marginBottom: 10,
  },
  textStyle: {
    color: "black",
    textAlign: "center",
  },
  fullSizeProfilePic: {
    width: 350,
    height: 350,
    borderRadius: 20,
    marginBottom: 0,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    color: "white",
  },
  closeButton2: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UserProfile;
