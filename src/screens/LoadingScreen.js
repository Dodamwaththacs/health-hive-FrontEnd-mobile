import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoadingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value
  const navigation = useNavigation();

  useEffect(() => {
    // Animation sequence
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate to Dashboard screen after 3 seconds
    const timeout = setTimeout(() => {
      navigation.navigate('TempScreen');
    }, 3000);

    // Clear the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../assets/logo.png')} 
        style={[styles.icon, { opacity: fadeAnim }]}
      />
      <Text style={styles.loadingText}>Logging In...</Text>
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
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
  },
});

export default LoadingScreen;
