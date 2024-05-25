import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';



const FileScreen = ({ route }) => {
  const { folderId } = route.params;
  const baseDir = `${FileSystem.documentDirectory}AppStorage/`;
  
  const createDatabase =async () =>  {
    const db = await SQLite.openDatabaseAsync('databaseName');
    console.log('Database created:', db);
    await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
INSERT INTO test (value, intValue) VALUES ('test1', 123);
INSERT INTO test (value, intValue) VALUES ('test2', 456);
INSERT INTO test (value, intValue) VALUES ('test3', 789);
`);

const firstRow = await db.getFirstAsync('SELECT * FROM test WHERE id = 3;');
console.log(firstRow.id, firstRow.value, firstRow.intValue);
console.log(firstRow.id)

  // Close the database connection (optional)
  db.closeAsync();
    
  }

  // useEffect(() => {
  //   db.transaction(tx => {
  //     console.log('Creating table...');
  //     tx.executeSql(
  //       'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, done INTEGER, value TEXT);',
  //       [],
  //       () => { console.log('Table created successfully') },
  //       (_, error) => { console.log('Error creating table:', error) }
  //     );
  //   });
  // }, []);

  const dir = (folderId) => {
    console.log(`Directory: ${baseDir}${folderId}`);
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.head}>{folderId}</Text>
        <Button onPress={() => dir(folderId)} title="Dir" />
        <Button onPress={() => createDatabase()} title="Create Database" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  head: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default FileScreen;
