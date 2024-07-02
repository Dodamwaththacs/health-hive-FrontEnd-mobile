import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const App = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
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
    backgroundColor: '#fff', 
  },
  logoContainer: {
  
    marginBottom: 30, 
  },
  logo: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain', 
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#0056B3', 
    marginBottom: 4, 
  },
  subtitle: {
    fontSize: 18, 
    color: '#0056B3', 
    marginBottom: 30, 
  },
  button: {
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    backgroundColor: '#0056B3', 
    borderRadius: 40, 
  },
  buttonText: {
    fontSize: 20, 
    color: '#fff', 
    
  },
});

export default App;