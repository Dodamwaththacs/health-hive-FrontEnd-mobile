import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const SelectTests = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { scannedUserId , user} = route.params;

  const [selectedTests, setSelectedTests] = useState([]);
  const [customTest, setCustomTest] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const labTests = [
    "Complete Blood Count (CBC)",
    "Basic Metabolic Panel (BMP)",
    "Comprehensive Metabolic Panel (CMP)",
    "Lipid Panel",
    "Liver Function Tests (LFTs)",
    "Thyroid Function Tests",
    "Hemoglobin A1c (HbA1c)",
    "Urinalysis",
    "Electrolyte Panel",
    "Coagulation Panel",
    "C-reactive Protein (CRP)",
    "Erythrocyte Sedimentation Rate (ESR)",
    "Vitamin D Test",
    "Iron Studies",
    "Cardiac Enzyme Tests",
    "Blood Gases",
    "Microbial Cultures",
    "Hormone Panels",
    "Allergy Testing",
    "Tumor Markers",
  ];

  const toggleTestSelection = (test) => {
    setSelectedTests((prevSelectedTests) =>
      prevSelectedTests.includes(test)
        ? prevSelectedTests.filter((t) => t !== test)
        : [...prevSelectedTests, test]
    );
  };

  const handleCustomTestSubmit = () => {
    if (customTest.trim()) {
      toggleTestSelection(customTest);
      setCustomTest("");
    }
  };

  const handleLabRequest = async () => {
    if (selectedTests.length === 0) {
      Alert.alert("No Tests Selected", "Please select at least one test.");
      return;
    }

    for (let i = 0; i < selectedTests.length; i++) {
      console.log(`Sending lab request ${i + 1} of ${selectedTests.length}`);
      try {
        await axios.post(
          "http://13.202.67.81:10000/usermgtapi/api/labRequests",
          {
            user: user.id, // You need to pass user data to this component
            lab: scannedUserId,
            description: selectedTests[i],
            customerName: user.fullName, // You need to pass user data to this component
          }
        );

        console.log(`Completed request ${i + 1}`);
      } catch (error) {
        console.error(
          `Error submitting lab request for ${selectedTests[i]}:`,
          error.message
        );
        Alert.alert(
          "Error",
          `Failed to submit lab request for ${selectedTests[i]}.`
        );
      }
    }

    console.log("All requests completed");
    Alert.alert("Lab Requests", "All lab requests have been submitted.");
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your tests</Text>
      <ScrollView style={styles.scrollView}>
        {labTests.map((test, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleTestSelection(test)}
            style={styles.testContainer}
          >
            <Text style={styles.testText}>{test}</Text>
            <View
              style={[
                styles.checkbox,
                selectedTests.includes(test) && styles.checkboxSelected,
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addCustomButton}
        onPress={() => setShowCustomInput(!showCustomInput)}
      >
        <Ionicons
          name={showCustomInput ? "remove" : "add"}
          size={24}
          color="white"
        />
      </TouchableOpacity>
      {showCustomInput && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your test name here"
            value={customTest}
            onChangeText={setCustomTest}
          />
          <TouchableOpacity
            onPress={handleCustomTestSubmit}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add Test</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button1}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={handleLabRequest}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
  },
  scrollView: {
    flex: 1,
  },
  testContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  testText: {
    fontSize: 16,
    color: '#003366',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#003366',
    borderRadius: 4,
  },
  checkboxSelected: {
    backgroundColor: '#003366',
  },
  addCustomButton: {
    alignSelf: 'flex-start',
    marginTop: 15,
    marginBottom: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#003366',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4A90E2',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button1: {
    backgroundColor: '#FF4136',
    padding: 10,
    marginVertical: 30,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  button2: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 30,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SelectTests;