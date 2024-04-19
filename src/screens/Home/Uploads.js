import React from "react";
import { View, Text, Button } from "react-native";
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

function Uploads () {
  // const uploadFile = async () => {
  //   try {
  //     // Pick a single file
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
  //     });

  //     // Create a new file path
  //     const newFilePath = `${RNFS.DocumentDirectoryPath}/${res.name}`;

  //     // Move the file
  //     await RNFS.moveFile(res.uri, newFilePath);

  //     alert('File uploaded successfully!');
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User cancelled the picker
  //     } else {
  //       throw err;
  //     }
  //   }
  // };

  return(
    <View>
      <Text>This is Uploads!</Text>
      {/* <Button title="Upload File" onPress={uploadFile} /> */}
    </View>
  );
}

export default Uploads;