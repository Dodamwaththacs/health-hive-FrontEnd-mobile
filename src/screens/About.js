import React from 'react';
import { View ,Text, StyleSheet} from 'react-native';


const About = () => {
  return(
  <View style = {styles.qrContainer}>
    <Text>This is About!</Text>
  </View>
  );
};

export default About;

const styles = StyleSheet.create({
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
