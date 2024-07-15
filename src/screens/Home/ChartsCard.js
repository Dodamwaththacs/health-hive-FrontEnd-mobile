import React, { useState, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import GestureRecognizer from "react-native-swipe-gestures";
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
  ScrollView,
} from "react-native";
import {
  Svg,
  Circle,
  Line,
  Text as SvgText,
  Rect,
  Path,
} from "react-native-svg";
import moment from "moment";

const ChartsCard = ({ userId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [notes, setNotes] = useState("");
  const [userData, setUserData] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [currentView, setCurrentView] = useState("bmi"); // State to toggle between views
  const [hasEntryToday, setHasEntryToday] = useState(false);

  const calculateMonthlyAverageWeight = () => {
    const currentMonth = moment().month();
    const currentYear = moment().year();
    const thisMonthData = userData.filter((data) => {
      const dataDate = moment(data.date);
      return (
        dataDate.month() === currentMonth && dataDate.year() === currentYear
      );
    });

    if (thisMonthData.length === 0) return "N/A";
    const sum = thisMonthData.reduce((acc, data) => acc + data.weight, 0);
    return (sum / thisMonthData.length).toFixed(2);
  };

  const getLastUpdatedWeight = () => {
    if (userData.length === 0) return { weight: "N/A", date: "N/A" };
    const lastEntry = userData[userData.length - 1];
    return {
      weight: lastEntry.weight.toFixed(2),
      date: moment(lastEntry.date).format("MMM DD"),
    };
  };

  const monthlyAverageWeight = calculateMonthlyAverageWeight();
  const lastUpdatedWeight = getLastUpdatedWeight();

  const handleAddButtonPress = () => {
    if (hasEntryToday) {
      Alert.alert("Alert", "You already have data for today.");
    } else {
      setModalVisible(true);
    }
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
            const data = {
              weight,
              height,
              notes,
              user: userId,
              date: new Date(),
            };
            try {
              await axios.post(

                "http://13.202.67.81:10000/usermgtapi/api/healthData",

                data
              );
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
      const response = await axios.get(

        `http://13.202.67.81:10000/usermgtapi/api/healthData/userId/${userId}`

      );

      const userData = response.data.map((data) => ({
        ...data,
        date: moment(data.date),
        weight: parseFloat(data.weight),
      }));

      // Check if there is an entry for today
      const today = moment().startOf("day");
      const entryToday = userData.some((data) =>
        moment(data.date).isSame(today, "day")
      );
      setHasEntryToday(entryToday);

      setUserData(userData);
      const profileResponse = await axios.get(

        `http://13.202.67.81:10000/usermgtapi/api/users/${userId}`

      );
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
      return "BMI categories for children and teens are not handled. For children and teens, BMI categories are different. Here we handle adult BMI.";
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
      return `Gain ${(targetWeight - weight).toFixed(
        2
      )} kg to reach a normal weight.`;
    }
    if (bmi >= 25) {
      targetWeight = 24.9 * heightInMeters * heightInMeters;
      return `Lose ${(weight - targetWeight).toFixed(
        2
      )} kg to reach a normal weight.`;
    }
    return "Your weight is normal.";
  };

  const calculateAge = (dateOfBirth) => {
    return moment().diff(moment(dateOfBirth), "years");
  };

  const chartData = userData.map((data) => {
    return data.weight ? parseFloat(data.weight) : 0;
  });

  const defaultData = {
    labels:
      userData.length > 0
        ? userData.map((data) => moment(data.date).format("MMM DD"))
        : ["No data available"],
    datasets: [
      {
        data: chartData.length > 0 ? chartData : [0],
      },
    ],
  };

  const latestData = userData[userData.length - 1] || {};
  const latestBMI =
    chartData.length > 0
      ? calculateBMI(latestData.weight, latestData.height)
      : 0;
  const age = calculateAge(dateOfBirth);
  const bmiCategory = getBMICategory(latestBMI, age, gender);
  const weightChangeSuggestion = getWeightChangeSuggestion(
    latestBMI,
    latestData.height,
    latestData.weight
  );

  const GaugeChart = ({ value, Category }) => {
    const gaugeSize = 260;
    const radius = gaugeSize / 2;
    const strokeWidth = 30; // Reduced stroke width
    const normalizedValue = Math.min(Math.max(value, 0), 40);
  
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    };
  
    const arrowAngle = (normalizedValue / 40) * 180;
    const arrowLength = radius - strokeWidth / 2 - 10;
    const arrowEnd = polarToCartesian(radius, radius, arrowLength, arrowAngle);
  
    const sections = [
      { color: "#007FFF", from: 0, to: 18.5, label: "Underweight" },
      { color: "#4CAF50", from: 18.5, to: 25, label: "Normal" },
      { color: "#FFC107", from: 25, to: 30, label: "Overweight" },
      { color: "#FF4136", from: 30, to: 40, label: "Obesity" },
    ];
  
    const describeArc = (x, y, radius, startAngle, endAngle) => {
      const start = polarToCartesian(x, y, radius, endAngle);
      const end = polarToCartesian(x, y, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      const d = [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
      ].join(" ");
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
        <Svg width={gaugeSize} height={gaugeSize / 2 + 80}>
          {sections.map((section, index) => (
            <Path
              key={index}
              d={describeArc(
                radius,
                radius,
                radius - strokeWidth / 2,
                (section.from / 40) * 180,
                (section.to / 40) * 180
              )}
              stroke={section.color}
              strokeWidth={strokeWidth}
              fill="none"
            />
          ))}
  
          {/* Tick marks */}
          {[...Array(41)].map((_, i) => {
            const angle = (i / 40) * 180;
            const tickStart = polarToCartesian(radius, radius, radius - strokeWidth / 2, angle);
            const tickEnd = polarToCartesian(radius, radius, radius - strokeWidth / 2 - (i % 5 === 0 ? 15 : 10), angle);
            return (
              <Line
                key={i}
                x1={tickStart.x}
                y1={tickStart.y}
                x2={tickEnd.x}
                y2={tickEnd.y}
                stroke="white"
                strokeWidth={i % 5 === 0 ? 2 : 1}
              />
            );
          })}
  
          {/* Arrow */}
          <Path
            d={`M${radius},${radius} L${arrowEnd.x},${arrowEnd.y} L${radius + 5},${radius - 10} L${radius - 5},${radius - 10} Z`}
            fill="#003366"
          />
          <Circle cx={radius} cy={radius} r={12} fill="#003366" />
          
          {/* Value text */}
          <SvgText
            x={radius}
            y={radius + 40}
            fill="#4A90E2"
            fontSize="24"
            fontWeight="bold"
            textAnchor="middle"
          >
            {value}
          </SvgText>
          
          {/* Category text */}
          <SvgText
            x={radius}
            y={radius + 70}
            fill="#4A90E2"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
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
    if (currentView === "bmi") setCurrentView("history");
  };

  const onSwipeRight = () => {
    if (currentView === "history") setCurrentView("bmi");
  };

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={config}
      style={styles.container}
    >
      {currentView === "bmi" ? (
        <View style={styles.containerGaugeChart}>
          <Text style={styles.textHeader}>Your BMI</Text>

          <GaugeChart value={latestBMI} category={bmiCategory} />
          <Text style={styles.bmiText}>{weightChangeSuggestion}</Text>
        </View>
      ) : (
        <View style={styles.containerGaugeChart}>
          {/* <Text style={styles.textHeader}>Weight Chart</Text> */}
          <View style={styles.decoratorContainer}>
            <Text style={styles.decoratorText}>
              Average: {monthlyAverageWeight} kg
            </Text>
            <Text style={styles.decoratorText}>
              Today, {lastUpdatedWeight.date}: {lastUpdatedWeight.weight} kg
            </Text>
          </View>
          <View style={styles.chartBackground}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.scrollViewContent}
            >
            <LineChart
  data={defaultData}
  width={Dimensions.get("window").width * 1.5 - 40}
  height={220}
  chartConfig={{
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2,
    padding: 12,
    color: (opacity = 1) => `rgba(1, 159, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 86, 179, ${opacity})`,
    style: {
      borderRadius: 16,
      padding: 10,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "3",
      stroke: "#003366", // Primary color for dot outline
    },
    yAxisLabel: "",
    yAxisSuffix: "kg",
    yAxisInterval: 10,
    paddingTop: 30,
    fillShadowGradient: "#007FFF", // Bright blue fill gradient
    fillShadowGradientOpacity: 1,
  }}
  bezier
  style={{
    marginVertical: 0,
    borderRadius: 16,
    marginBottom: 10,
  }}
  withVerticalLabels={true}
  withHorizontalLabels={true}
  segments={4}
  renderDotContent={({ x, y, index, indexData }) => (
    <View
      key={index}
      style={{
        position: "absolute",
        top: y - 10,
        left: x - 16,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 2,
      }}
    >
      <Text
        style={{
          color: "#0056B3", // Primary color for text
          fontWeight: "bold",
          fontSize: 10,
        }}
      >
        {indexData}kg
      </Text>
    </View>
  )}
  fillColor="rgba(1, 149, 255, 0.2)" // Primary color with low opacity for area fill
/>
            </ScrollView>
          </View>
        </View>
      )}

      <View style={styles.dotContainer}>
        <View style={[styles.dot, currentView === "bmi" && styles.activeDot]} />
        <View
          style={[styles.dot, currentView === "history" && styles.activeDot]}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
        <Icon name="add" size={20} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Enter your height and weight to calculate BMI</Text>
          <TextInput
    style={styles.input}
    placeholder="Weight (kg)"
    keyboardType="numeric"
    value={weight}
    onChangeText={(text) => {
      // Allow only numbers and one decimal point
      const regex = /^\d*\.?\d*$/;
      if (regex.test(text) || text === '') {
        setWeight(text);
      }
    }}
  />
  <TextInput
    style={styles.input}
    placeholder="Height (cm)"
    keyboardType="numeric"
    value={height}
    onChangeText={(text) => {
      // Allow only numbers and one decimal point
      const regex = /^\d*\.?\d*$/;
      if (regex.test(text) || text === '') {
        setHeight(text);
      }
    }}
  />

          <View style={styles.buttonContainer}>
          <TouchableOpacity
                style={styles.modalButton1}
                onPress={handleCancel} >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                style={styles.modalButton2} 
            onPress={handleSubmit} >
              <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
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
    marginTop: 5,
  },
  textHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#003366",
  },
  infoText: {
    marginTop: 5,
    color:'#003366',
  },

  bmiText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
    color:'#003366',
  },
  addButton: {
    position: "absolute",
    bottom: 300,
    right: 20,
    backgroundColor: "#003366",
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color:"#003366",
  },
  containerGaugeChart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    height: 310,
  },

  categoryText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color:'#003366',
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton1: {
    backgroundColor: '#FF4136',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%', // Adjust the height to fit the button size
  },
  modalButton2: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',// Adjust the height to fit the button size
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#003366",
  },
  chartBackground: {
    position: "relative",
    width: "100%",
    height: 220,
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: -40,
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  chart: {
    marginVertical: 0,
    borderRadius: 16,
    marginLeft: 0, // Adjust to align with static y-axis
  },
  yAxis: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  yAxisLabel: {
    color: "#fff",
  },

  decoratorContainer: {
    position: "absolute",
    top: 20,
    left: 40,
    right: 10,
    flexDirection: "coloumn",
    justifyContent: "space-between",
  },
  decoratorText: {
    color: "#0056b3",
    fontSize: 14,
    fontWeight: "bold",
    
    
  },
});

export default ChartsCard;
