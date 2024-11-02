import React,{useState} from 'react';
import { View, Text,Image, TextInput, TouchableOpacity,Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import useStore from '../../../../store';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, openroutekey, serverurl } from '../../../../../firebaseConfig';

const CreateCommunity = () => {
  const { userdata } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState([]);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage([...image,result.assets[0].uri]);
    }
  };
  // const handleRemovePhoto = () => {
  //   const newImages = [...image];
  //   newImages.splice(index, 1);
  //   setImage(newImages);
  // }

  const uploadImage = async(uri,userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();

    const photoId = Date.now();
    const storageRef = ref(storage, `issuePhotos/${userId}/${photoId}_${uri.split('/').pop()}`);

    
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  }

  const handleSubmit = async () => {
    try{
      const createCommunityData = {
        creatorId: userdata.id,
        ngoId:'null',
        name,
        description,
        location,
        creatorType:"User",
      };
      const response = await axios.post(`${serverurl}/community`, createCommunityData);
      if(response.status === 201){
        const imageUploadPromises = image.map(uploadImage);
        const imageUrls = await Promise.all(imageUploadPromises);

        createCommunityData.imageUrls = imageUrls;
        router.push({
          pathname: 'home/selectCommunity/myCommunity',
          params: {
            update: 'true'
          }
        });
        console.log("Community created successfully:",response.data);
      }else{
        console.log("Failed to create community:", response.data.message);
      }
    }catch(error){
      console.error("Falied to create a community:",error.message);
      Alert.alert("Error, Failed to create a community");
    }
 
  };

  return (
 
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-5">Create Community</Text>

      <TextInput
        className="border border-gray-300 rounded p-3 mb-4"
        placeholder="Title"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999" 
      />
      <TextInput
        className="border border-gray-300 rounded p-3 mb-4 h-40"
        placeholder="Body"
        value={description}
        onChangeText={setDescription}
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

      {image.length > 0 && (
        <View className="mb-4">
          {image.map((uri, index) => (
            <Image 
              key={index}  // Use a unique key for each image
              source={{ uri }}  // Use the correct variable 'uri'
              style={{ width: '100%', height: 200, borderRadius: 10 }} 
            />
          ))}
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

export default CreateCommunity;