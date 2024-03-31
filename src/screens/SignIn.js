import React, { useState } from 'react';
import { StyleSheet, Image,Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();


  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to HealthHive</Text>

      <View>
        <Image source={require('../assets/sign-bg.png')} style={styles.sign_bg} />
      </View>
    


      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email/Phone No"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
        />
        

        
      </View>

      <TouchableOpacity style={styles.button} onPress={null}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() =>  navigation.navigate('Reset')}>
        <Text style={styles.forgotPassword}>Forget Password</Text>
      </TouchableOpacity>

  
      
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
  },

  sign_bg: {
    width: 350, // Adjust as needed
    height: 350, // Adjust as needed
    resizeMode: 'cover', // or 'cover' depending on your preference
  },

  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#0000ff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#0000ff',
    marginTop: 15,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#0000ff',
    marginHorizontal: 5,
  },
  paginationDotInactive: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
});

export default App;
