import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Animated } from 'react-native';

const LoadingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true, // Add this line
        }),
 
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true, // Add this line
          }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../assets/logo.png')} 
        style={[styles.icon, { opacity: fadeAnim }]} // Apply animated opacity to image
      />
      <Text style={styles.loadingText}>Log In...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  icon: {
    width: 100, // Set the width
    height: 100, // Set the height
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
  },
});

export default LoadingScreen;
