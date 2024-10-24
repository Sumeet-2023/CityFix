import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Image,ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

const CreateIssue = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = () => {
    // handle issue submission, you can use a backend API to save the issue
    console.log({ title, body, location, image });
    alert('Issue Created Successfully!');
    router.push('home/report/myIssue');
  };

  return (
 
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-5">Create Issue</Text>

      <TextInput
        className="border border-gray-300 rounded p-3 mb-4"
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999" 
      />
      <TextInput
        className="border border-gray-300 rounded p-3 mb-4 h-40"
        placeholder="Body"
        value={body}
        onChangeText={setBody}
        placeholderTextColor="#999" 
        multiline
        numberOfLines={4}
        editable
      />
      <TextInput
        className="border border-gray-300 rounded p-3 mb-4"
        placeholder="Url/Location"
        value={location}
        onChangeText={setLocation}
        placeholderTextColor="#999" 
      />

      <TouchableOpacity
        className="bg-blue-500 rounded py-3 px-4 mb-4"
        onPress={handleChoosePhoto}
      >
        <Text className="text-white text-center">Choose Photo</Text>
      </TouchableOpacity>

      {image && (
        <View className="mb-4">
          <Image source={{ uri: image }} style={{ width: '100%', height: 200, borderRadius: 10 }} />
        </View>
      )}

      <TouchableOpacity
        className="bg-green-600 rounded py-3"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-bold">SUBMIT</Text>
      </TouchableOpacity>
    </View>

  );
};

export default CreateIssue;