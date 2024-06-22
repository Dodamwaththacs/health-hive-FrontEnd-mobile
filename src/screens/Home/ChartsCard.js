import React, { useState, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import GestureRecognizer from 'react-native-swipe-gestures';
import * as SQLite from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import moment from 'moment';

const ChartsCard = ({ userId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [notes, setNotes] = useState("");
  const [userData, setUserData] = useState([]);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [currentView, setCurrentView] = useState('bmi'); // State to toggle between views

  const handleAddButtonPress = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!weight || !height) {
      Alert.alert("Error", "Please enter both weight and height.");
      return;
    }

    Alert.alert(
      "Confirm Submission",
      "Are you sure you want to add this data?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const data = { weight, height, notes, user: userId, date: new Date() };
            try {
              await axios.post('http://192.168.205.43:33000/api/healthData', data);
              setModalVisible(false);
              fetchUserData();
            } catch (error) {
              console.error("Error saving health data:", error);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://192.168.205.43:33000/api/healthData/userId/${userId}`);
      setUserData(response.data);
      // Fetch additional user profile data
      const profileResponse = await axios.get(`http://192.168.205.43:33000/api/users/${userId}`);
      setDob(profileResponse.data.dob);
      setGender(profileResponse.data.gender);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const calculateBMI = (weight, height) => {
    if (!weight || !height) {
      return 0;
    }
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  };

  const chartData = userData.map(data => {
    if (data.weight && data.height) {
      return calculateBMI(data.weight, data.height);
    }
    return 0;
  });

  const defaultData = {
    labels: userData.length > 0 ? userData.map(data => new Date(data.date).toLocaleString('default', { month: 'short' })) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      data: chartData.length > 0 ? chartData : [0, 0, 0, 0, 0, 0]
    }],
  };

  const latestBMI = chartData[chartData.length - 1] || 0;

  const calculateAge = dob => {
    return moment().diff(moment(dob), 'years');
  };

  const GaugeChart = ({ value }) => {
    const gaugeSize = 200;
    const radius = gaugeSize / 2;
    const strokeWidth = 20;
    const normalizedValue = Math.min(Math.max(value, 0), 40); // Clamp the value between 0 and 40

    const getColor = value => {
      if (value < 16.0) return 'blue';
      if (value < 18.5) return 'lightblue';
      if (value < 25) return 'green';
      if (value < 30) return 'orange';
      if (value < 35) return 'darkorange';
      if (value < 40) return 'red';
      return 'darkred';
    };

    return (
      <Svg width={gaugeSize} height={gaugeSize}>
        <Circle cx={radius} cy={radius} r={radius} fill="#eee" />
        <Circle cx={radius} cy={radius} r={radius - strokeWidth / 2} fill="none" stroke="#ddd" strokeWidth={strokeWidth} />
        <Line
          x1={radius}
          y1={radius}
          x2={radius + (radius - strokeWidth) * Math.cos((normalizedValue / 40) * Math.PI - Math.PI / 2)}
          y2={radius + (radius - strokeWidth) * Math.sin((normalizedValue / 40) * Math.PI - Math.PI / 2)}
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
        />
        <SvgText
          x={radius}
          y={radius}
          fill="black"
          fontSize="20"
          fontWeight="bold"
          textAnchor="middle"
          dy=".3em"
        >
          {value}
        </SvgText>
      </Svg>
    );
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipeLeft = () => {
    if (currentView === 'bmi') setCurrentView('history');
  };

  const onSwipeRight = () => {
    if (currentView === 'history') setCurrentView('bmi');
  };

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={config}
      style={styles.container}
    >
      {currentView === 'bmi' ? (
        <View>
          <Text style={styles.textHeader}>Your BMI</Text>
          <GaugeChart value={latestBMI} />
          <Text style={styles.bmiText}>{`Age: ${calculateAge(dob)} | Gender: ${gender}`}</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
            <Icon name="add-circle-outline" size={30} color="#000" />
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.textHeader}>BMI History</Text>
          <LineChart
            data={defaultData}
            width={Dimensions.get("window").width - 20}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#ffd600",
              backgroundGradientFrom: "#ff6d00",
              backgroundGradientTo: "#ffab00",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            fromZero={true}
            style={{ margin: 10, borderRadius: 16 }}
          />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add Your Health Data</Text>
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
          />
          <View style={styles.buttonContainer}>
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Cancel" onPress={handleCancel} color="#FF6347" />
          </View>
        </View>
      </Modal>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 16,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10,
  },
  bmiText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    width: "100%",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default ChartsCard;
