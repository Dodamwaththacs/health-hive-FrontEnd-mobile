import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,StatusBar,Platform} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';



const Header = () => {
  return (
    <View style = {styles.container}>
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <TouchableOpacity style={styles.menuButton}>
          <FontAwesomeIcon icon={faBars} size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.centerContainer}>
        <TouchableOpacity onPress={() => console.log("chamika")}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </TouchableOpacity>
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.title}>HealthHive</Text>
        <Text style={styles.subtitle}>Health Passport System</Text>
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4A90E2',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  leftContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  menuButton: {
    marginRight: 10,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    fontSize: 12,
  },
});

export default Header;