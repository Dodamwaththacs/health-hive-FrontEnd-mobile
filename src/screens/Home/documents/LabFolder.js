import React from 'react';
import { View, Text,StyleSheet } from 'react-native';

const LabFolder = ({ route }) => {
    const { folderName } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.head}>{folderName}</Text>
            <Text style={styles.head2}>
                Here you can find all the documents related to the lab.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
      },
      head: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
      },
        head2: {
            fontSize: 18,
            marginBottom: 10,
        },
    });

export default LabFolder;