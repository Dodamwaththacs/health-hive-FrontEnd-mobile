import React, { useState, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import GestureRecognizer from 'react-native-swipe-gestures';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import {Svg,  Circle, Line, Text as SvgText, Rect,Path } from 'react-native-svg';
import moment from 'moment';

const ChartsCard = ({ userId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [notes, setNotes] = useState("");
  const [userData, setUserData] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState("");
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
      setDateOfBirth(profileResponse.data.dateOfBirth);
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

  const getBMICategory = (bmi, age, gender) => {
    if (age < 18) {
      // For children and teens, BMI categories are different. Here we handle adult BMI.
      return "BMI categories for children and teens are not handled.For children and teens, BMI categories are different. Here we handle adult BMI.";
    }
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  };

  const getWeightChangeSuggestion = (bmi, height, weight) => {
    const heightInMeters = height / 100;
    let targetWeight = 0;
    if (bmi < 18.5) {
      targetWeight = 18.5 * heightInMeters * heightInMeters;
      return `Gain ${(targetWeight - weight).toFixed(2)} kg to reach a normal weight.`;
    }
    if (bmi >= 25) {
      targetWeight = 24.9 * heightInMeters * heightInMeters;
      return `Lose ${(weight - targetWeight).toFixed(2)} kg to reach a normal weight.`;
    }
    return "Your weight is normal.";
  };

  const calculateAge = dateOfBirth => {
    return moment().diff(moment(dateOfBirth), 'years');
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

  const latestData = userData[userData.length - 1] || {};
  const latestBMI = chartData[chartData.length - 1] || 0;
  const age = calculateAge(dateOfBirth);
  const bmiCategory = getBMICategory(latestBMI, age, gender);
  const weightChangeSuggestion = getWeightChangeSuggestion(latestBMI, latestData.height, latestData.weight);


  
  const GaugeChart = ({ value, Category }) => {
    const gaugeSize = 280;
    const radius = gaugeSize / 2;
    const strokeWidth = 60;
    const normalizedValue = Math.min(Math.max(value, 0), 40); // Clamp the value between 0 and 40
  
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    };
  
    const arrowAngle = (normalizedValue / 40) * 180;
    const arrowLength = radius - strokeWidth / 10 - 30;
    const arrowEnd = polarToCartesian(radius, radius, arrowLength, arrowAngle);
  
    const sections = [
      { color: '#00BFFF', from: 0, to: 18.5, label: 'Underweight' },
      { color: '#32CD32', from: 18.5, to: 25, label: 'Normal' },
      { color: '#FFA500', from: 25, to: 30, label: 'Overweight' },
      { color: '#FF4500', from: 30, to: 40, label: 'Obesity' },
    ];
  
    const describeArc = (x, y, radius, startAngle, endAngle) => {
      const start = polarToCartesian(x, y, radius, endAngle);
      const end = polarToCartesian(x, y, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      const d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      ].join(' ');
      return d;
    };
  
    const getSectionLabel = (value) => {
      for (let section of sections) {
        if (value >= section.from && value < section.to) {
          return section.label;
        }
      }
      return sections[sections.length - 1].label;
    };
  
    return (
      <View style={styles.GaugeChart}>
        <Svg width={gaugeSize} height={gaugeSize / 2 + 30}>
          {sections.map((section, index) => (
            <Path
              key={index}
              d={describeArc(radius, radius, radius - strokeWidth / 2, (section.from / 40) * 180, (section.to / 40) * 180)}
              stroke={section.color}
              strokeWidth={strokeWidth}
              fill="none"
            />
          ))}
          
          <Line
            x1={radius}
            y1={radius}
            x2={arrowEnd.x}
            y2={arrowEnd.y}
            stroke="black"
            strokeWidth={5}
          />
          <Circle cx={radius} cy={radius} r={5} fill="black" />
          <SvgText
            x={radius}
            y={radius - 30}
            fill="black"
            fontSize="20"
            fontWeight="bold"
            textAnchor="middle"
            dy=".3em"
          >
            {value}
          </SvgText>
          <SvgText
            x={radius}
            y={radius + 20}
            fill="black"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            dy=".3em"
          >
            {getSectionLabel(value)}
          </SvgText>
        
        </Svg>
      </View>
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
        <View style={styles.containerGaugeChart}>
          <Text style={styles.textHeader}>Your BMI</Text>

          <GaugeChart value={latestBMI} category={bmiCategory} />
          <Text style={styles.bmiText}>{weightChangeSuggestion}</Text>
        
        </View>
      ) : (
        <View style={styles.containerGaugeChart}>
          <Text style={styles.textHeader}>BMI History</Text>
          <LineChart
            data={defaultData}
            width={Dimensions.get("window").width * 0.9}
            height={220}
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddButtonPress}
      >
        <Icon name="add" size={20} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add Health Data</Text>
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
    padding: 10,
    marginTop: -5,
    
  },
  textHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoText:{
    marginTop:5,
  },

  bmiText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 265,
    right: 20,
    backgroundColor: '#0056B3',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: 200,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
  },
  containerGaugeChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 } ,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    height: 310,
  },
  GaugeChart: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    padding: 10,
  },
    
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

});

export default ChartsCard;
