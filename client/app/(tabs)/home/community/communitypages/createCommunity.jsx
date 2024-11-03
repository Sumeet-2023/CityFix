import React, { useState } from 'react';
import { View, Text, Image, Modal, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import axios from 'axios';
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  IconButton,
  Card,
  Surface,
} from 'react-native-paper';
// import useStore from '../../../../store';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { serverurl } from '../../../../../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../../../store';

const enhancedTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4F46E5',
    accent: '#818CF8',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1E293B',
    placeholder: '#64748B',
  },
  roundness: 16,
};

const CreateCommunity = () => {
  const {user, isLoading} = useAuthStore;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({
    type: 'Point',
    coordinates: [-118.2437, 34.0522],
    city: 'Los Angeles',
    country: 'USA'
  });
  const [images, setImages] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleRemovePhoto = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadImage = async (uri, communityId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const photoId = Date.now();
    const storageRef = ref(storage, `communityPhotos/${communityId}/${photoId}_${uri.split('/').pop()}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const communityData = {
        communityName: name,
        userId: user.id,
        description,
        reportedDate: new Date().toISOString(),
        location,
        lastUpdated: new Date().toISOString(),
        creatorType: 'USER'
      };
      const response = await axios.post(`${serverurl}/community`, communityData);
      
      if (response.status === 201) {
        const newCommunity = response.data;
        const communityId = newCommunity.id;
        
        if (images.length > 0) {
          const imageUrls = await Promise.all(images.map(uri => uploadImage(uri, communityId)));
          await axios.patch(`${serverurl}/community/${communityId}`, {
            communityPhotos: imageUrls,
          });
        }

        Alert.alert('Success', 'Community Created Successfully!');
        router.push({
          pathname: 'home/community/communitypages/myCommunity',
          params: { update: 'true' }
        });
      }
    } catch (error) {
      console.error('Error creating community:', error.message);
      Alert.alert('Error', 'Failed to create a community');
    }
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({
      ...location,
      type: 'Point',
      coordinates: [longitude, latitude],
    });
  };

  const CardHeader = ({ title, subtitle }) => (
    <View className="mb-4">
      <Text className="text-xl font-bold text-gray-800">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
      )}
    </View>
  );

  const PhotoGalleryModal = () => (
    <Modal
      visible={showGallery}
      animationType="slide"
      onRequestClose={() => setShowGallery(false)}
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        <LinearGradient
          colors={['#4F46E5', '#818CF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="p-4 border-b border-gray-100"
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-white">Gallery</Text>
            <IconButton icon="close" size={24} iconColor="white" onPress={() => setShowGallery(false)} />
          </View>
        </LinearGradient>
        <ScrollView className="p-4">
          <View className="flex-row flex-wrap justify-between">
            {images.map((uri, index) => (
              <Surface key={index} className="w-[48%] mb-4 rounded-xl overflow-hidden elevation-4">
                <Image source={{ uri }} className="h-40 w-full" />
                <View className="absolute top-2 right-2">
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleRemovePhoto(index)}
                    className="bg-white"
                    iconColor="#EF4444"
                  />
                </View>
              </Surface>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <PaperProvider theme={enhancedTheme}>
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView>
          <LinearGradient
            colors={['#4F46E5', '#818CF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-8 pt-12 pb-16 rounded-b-[40px] shadow-lg"
          >
            <View className="items-center">
              <Text className="text-4xl font-bold text-white text-center mb-3">
                Create Community
              </Text>
              <Text className="text-lg text-indigo-100 text-center opacity-90">
                Build a better community together
              </Text>
            </View>
          </LinearGradient>

          <View className="px-4 -mt-8">
            <Surface className="rounded-3xl p-6 mb-6 elevation-4 bg-white">
              <CardHeader 
                title="Community Details" 
                subtitle="Give your community a unique identity"
              />
              <TextInput
                mode="outlined"
                label="Community Name"
                value={name}
                onChangeText={setName}
                className="bg-white mb-4"
                placeholder="Enter a memorable name"
                outlineColor="#E2E8F0"
                activeOutlineColor="#4F46E5"
              />

              <TextInput
                mode="outlined"
                label="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                className="bg-white mb-2 h-32"
                placeholder="What makes your community special?"
                outlineColor="#E2E8F0"
                activeOutlineColor="#4F46E5"
              />
            </Surface>

            <Surface className="rounded-3xl p-6 mb-6 elevation-4 bg-white">
              <CardHeader 
                title="Location" 
                subtitle="Pin your community on the map"
              />
              <Button
                mode="contained"
                icon="map-marker"
                onPress={() => setShowMap(true)}
                className="mb-3"
                contentStyle={{ height: 50 }}
                labelStyle={{ fontSize: 16, fontWeight: '600' }}
              >
                Select Location
              </Button>
              <Text className="text-center text-gray-600">
                {location.city ? `📍 ${location.city}, ${location.country}` : 'Location not set'}
              </Text>
            </Surface>

            <Surface className="rounded-3xl p-6 mb-6 elevation-4 bg-white">
              <CardHeader 
                title="Community Photos" 
                subtitle="Share the visual essence of your community"
              />
              <View className="flex-row justify-between items-center mb-4">
                <Button
                  mode="contained"
                  icon="camera"
                  onPress={handleChoosePhoto}
                  className="flex-1 mr-2"
                  contentStyle={{ height: 50 }}
                  labelStyle={{ fontSize: 16, fontWeight: '600' }}
                >
                  Add Photos
                </Button>
                {images.length > 0 && (
                  <Button
                    mode="outlined"
                    onPress={() => setShowGallery(true)}
                    className="flex-1 ml-2"
                    contentStyle={{ height: 50 }}
                    labelStyle={{ fontSize: 16, fontWeight: '600' }}
                  >
                    View All ({images.length})
                  </Button>
                )}
              </View>
              
              {images.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row"
                >
                  {images.map((uri, index) => (
                    <Surface key={index} className="mr-3 rounded-xl overflow-hidden elevation-2">
                      <Image source={{ uri }} className="h-24 w-24" />
                    </Surface>
                  ))}
                </ScrollView>
              )}
            </Surface>

            <Button
              mode="contained"
              onPress={handleSubmit}
              className="mb-6"
              contentStyle={{ height: 56 }}
              labelStyle={{ fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 }}
            >
              Create Community
            </Button>
          </View>
        </ScrollView>

        <Modal visible={showMap} animationType="slide">
          <SafeAreaView className="flex-1">
            <MapView
              className="flex-1"
              region={{
                latitude: location.coordinates[1],
                longitude: location.coordinates[0],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={{
                  latitude: location.coordinates[1],
                  longitude: location.coordinates[0],
                }}
                title="Community Location"
              />
            </MapView>
            <View className="p-4 bg-white">
              <Button
                mode="contained"
                onPress={() => setShowMap(false)}
                contentStyle={{ height: 50 }}
                labelStyle={{ fontSize: 16, fontWeight: '600' }}
              >
                Confirm Location
              </Button>
            </View>
          </SafeAreaView>
        </Modal>

        <PhotoGalleryModal />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default CreateCommunity;