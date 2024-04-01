import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const HealthHiveHeader = () => {
  return (
    <View style={styles.container}>
        
            <View style={styles.menuIcon}>
                {/* You can use an icon library like react-native-vector-icons here */}
            <Text style={{ fontSize: 24 }}>☰</Text>
            </View>
            <Text style={styles.title}>HealthHive</Text>
            <Image
                source={require('../assets/logo.png')} // Replace with the actual path to your icon
            style={styles.logo}
            />
           
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0000FF', // Replace with the exact color code from your design
    padding: 10, 
    paddingTop:40,
    radio
  },

  
  menuIcon: {
    // Style for the menu icon
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20, // Adjust font size as needed
  },
  logo: {
    width: 50, // Adjust size as needed
    height: 50, // Adjust size as needed
    resizeMode: 'contain',
  },
});

export default HealthHiveHeader;
