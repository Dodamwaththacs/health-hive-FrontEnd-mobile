import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const App = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* You should replace require('./path-to-your-logo.png') with the actual path to your logo image */}
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>HealthHive</Text>
      <Text style={styles.subtitle}>Health Passport System</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignIn')} 
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // Change this to the background color of your screen
  },
  logoContainer: {
    // If you have specific dimensions for your logo, set them here
 // Adjust as needed
    marginBottom: 30, 
  },
  logo: {
    width: 100, // Adjust as needed
    height: 100, // Adjust as needed
    resizeMode: 'contain', // or 'cover' depending on your preference
  },
  title: {
    fontSize: 24, // Adjust as needed
    fontWeight: 'bold',
    color: '#000', // Change this to the color of your title text
    marginBottom: 4, // Adjust as needed
  },
  subtitle: {
    fontSize: 18, // Adjust as needed
    color: '#000', // Change this to the color of your subtitle text
    marginBottom: 30, // Adjust as needed
  },
  button: {
    paddingHorizontal: 20, // Adjust as needed
    paddingVertical: 10, // Adjust as needed
    backgroundColor: '#0000ff', // Change this to the color of your button
    borderRadius: 40, // Adjust as needed for rounded corners
  },
  buttonText: {
    fontSize: 20, // Adjust as needed
    color: '#fff', // Change this to the color of your button text
    
  },
});

export default App;
