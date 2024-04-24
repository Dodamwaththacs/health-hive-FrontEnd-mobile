import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleResetPassword = () => {
    // password reset logic goes here
    // After resetting password, navigate to SignIn screen
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Reset Your Password</Text>
      <View style={styles.lockIconCircle}>
        <Image source={require('../assets/password-reset-icon.png')} style={styles.icon} />
      </View>
      <Text style={styles.instruction}>Password should contain at least 8 characters</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="New Password"
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity 
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.eyeIcon} 
        >
          <Icon
            name={isPasswordVisible ? 'visibility' : 'visibility-off'}
            size={24}
            color="grey"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm New Password"
          secureTextEntry={!isConfirmPasswordVisible}
        />
        <TouchableOpacity 
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          style={styles.eyeIcon} 
        >
          <Icon
            name={isConfirmPasswordVisible ? 'visibility' : 'visibility-off'}
            size={24}
            color="grey"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={handleResetPassword}
      >
        <Text style={styles.resetButtonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  lockIconCircle: {
    
  },
  instruction: {
    color: 'red',
    padding: 10,
    
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5, 
    borderColor: 'grey', 
  },
  input: {
    flex: 1,
    paddingLeft:10, 
  },
  eyeIcon: {
    padding: 5, 
  },
  resetButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  icon: {
  
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginVertical: 20,
  },
});

export default ResetPasswordScreen;
