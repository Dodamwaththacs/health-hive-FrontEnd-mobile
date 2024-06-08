import { Button, View, Text, Image } from 'react-native';

const ImageView = () => {
  // const imageUrl = 'http://192.168.1.7:33000/file/QmdsqpaQnApZGJ1G8omB8SQVSs36rjBWWzp3DwFSr13sip'; // Replace with your image URL

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Image View</Text>
      <Image
        source={{ uri: imageUrl }}
        style={{ width:212, height: 500}}
      />
    </View>
  );
}

export default ImageView;