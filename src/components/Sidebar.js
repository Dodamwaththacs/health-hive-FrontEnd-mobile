import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Sidebar = () => {
  const menuItems = ['Home', 'Profile', 'Settings', 'Logout'];

  return (
    <View style={styles.sidebarContainer}>
      {menuItems.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => console.log(`${item} clicked`)}>
          <Text style={styles.menuItem}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    backgroundColor: '#4A90E2',
    padding: 10,
  },
  menuItem: {
    padding: 10,
    color: 'white',
    fontSize: 18,
  },
});

export default Sidebar;