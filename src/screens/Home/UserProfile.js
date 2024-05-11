import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Modal, Button
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useEmail } from '../../EmailContext';

const UserProfile = ({ route, navigation }) => {
    const { userData } = route.params;
    const { email } = useEmail();
  
    const [user, setUser] = useState(userData);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        telephoneNumber: userData.telephoneNumber || '',
        emergencyContactName: userData.emergencyContactName || '',
        emergencyContactNumber: userData.emergencyContactNumber || '',
    });
    const [profilePicUri, setProfilePicUri] = useState(null);
    const [imageActionModalVisible, setImageActionModalVisible] = useState(false);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);

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
          const uri = result.assets[0].uri;
          setProfilePicUri(uri);
          console.log("New profile pic URI:", uri); // This should now log the correct URI
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

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleSaveChanges = async () => {
        const updatedUser = { ...user, ...editData };
        Alert.alert(
            "Confirm Changes",
            "Are you sure you want to save these changes?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: async () => {
                        try {
                            const response = await axios.put(`http://192.168.46.43:33000/api/users/${user.id}`, updatedUser);
                            setUser(updatedUser);
                            setEditMode(false);
                            Alert.alert('Changes Saved', 'Your contact information has been updated successfully.', [
                                { text: "OK", onPress: () => console.log('Changes saved and confirmed') }
                            ]);
                        } catch (error) {
                            console.error('Failed to update user data:', error);
                            Alert.alert('Error', 'Failed to update contact information.');
                        }
                    },
                },
            ]
        );
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

            <Modal
                visible={photoModalVisible}
                transparent={true}
                onRequestClose={closePhotoModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Image
                            key={profilePicUri}
                            source={profilePicUri ? { uri: profilePicUri } : require('../../assets/profilePic.jpg')}
                            style={styles.fullSizeProfilePic}
                        />
                        <Button title="Close" onPress={closePhotoModal} />
                    </View>
                </View>
            </Modal>

            <View style={styles.header}>
                <TouchableOpacity onPress={openPhotoModal}>
                    <Image
                        key={profilePicUri}
                        source={profilePicUri ? { uri: profilePicUri } : require('../../assets/profilePic.jpg')}
                        style={styles.profilePic}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={openImageActions} style={styles.editIconContainer}>
                    <Ionicons name="pencil" size={30} color="white" style={styles.editIcon} />
                </TouchableOpacity>
                <Text style={styles.nameText}>{user.fullName}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Email: {user.email}</Text>
                <Text style={styles.infoText}>Date of Birth: {user.dateOfBirth}</Text>
                <Text style={styles.infoText}>NIC: {user.nic}</Text>
                <Text style={styles.infoText}>Gender: {user.gender}</Text>
            </View>

            <View style={styles.contactInfoContainer}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <TouchableOpacity onPress={toggleEditMode} style={styles.editButton}>
                    <Ionicons name="pencil" size={24} color="black" />
                </TouchableOpacity>
                {editMode ? (
                    <>
                        <TextInput
                            style={styles.editableText}
                            value={editData.telephoneNumber}
                            onChangeText={(text) => setEditData({ ...editData, telephoneNumber: text })}
                        />
                        <TextInput
                            style={styles.editableText}
                            value={editData.emergencyContactName}
                            onChangeText={(text) => setEditData({ ...editData, emergencyContactName: text })}
                            placeholder="Emergency Contact Name..."
                        />
                        <TextInput
                            style={styles.editableText}
                            value={editData.emergencyContactNumber}
                            onChangeText={(text) => setEditData({ ...editData, emergencyContactNumber: text })}
                            placeholder="Emergency Contact Number..."
                        />
                        <Button color="#1921E4" title="Save Changes" onPress={handleSaveChanges} />
                    </>
                ) : (
                    <>
                        <Text style={styles.infoText}>Your Contact Number: {editData.telephoneNumber || 'Not Provided'}</Text>
                        <Text style={styles.infoText}>Emergency Contact Name: {editData.emergencyContactName || 'Not Provided'}</Text>
                        <Text style={styles.infoText}>Emergency Contact: {editData.emergencyContactNumber || 'Not Provided'}</Text>
                    </>
                )}
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
    editIconContainer: {
        position: 'absolute',
        right: 150,
        bottom: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 6,
        borderRadius: 15,
    },
    editIcon: {},
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
    },
    contactInfoContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    editableText: {
        fontSize: 16,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    fullSizeProfilePic: {
        width: 300,
        height: 300,
        borderRadius: 150,
    },
    editButton: {
        position: 'absolute',
        right: 20,
        top: 20,
    },
});

export default UserProfile;
