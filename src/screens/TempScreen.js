import React from 'react';
import { View ,Text,StyleSheet} from 'react-native';

const TempScreen = () => {
  return (
    <View style = {styles.TempScreen}>
      <Text>TempScreen!</Text>  
    </View>
  );
};

const styles = StyleSheet.create({
  TempScreen: {
  textAlign: 'center',
  },
});

export default TempScreen;
