import React, { useState } from 'react';
import { View, Text, Image, Modal, FlatList, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import axios from 'axios';
import { MaterialIcons } from "@expo/vector-icons";
import {
  TextInput,
  Button,
  List,
  Provider as PaperProvider,
  DefaultTheme,
  IconButton,
  Card,
  Chip
} from 'react-native-paper';
// import useStore from '../../../store';
import { useAuthStore, useFeedsStore, useMyIssuesStore } from '../../../store';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, openroutekey, serverurl } from '../../../../firebaseConfig';

const enhancedTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3B82F6',
    accent: '#60A5FA',
    background: '#F3F4F6',
  },
  roundness: 12,
};

const issueTags = ['Garbage', 'Road', 'Safety', 'Noise', 'Other'];

const CreateIssue = () => {
  const {user, isLoading} = useAuthStore();
  const [issueTag, setIssueTag] = useState('Garbage');
  const [issueName, setIssueName] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [location, setLocation] = useState({
    type: 'Point',
    coordinates: [-118.2437, 34.0522],
  });
  const [images, setImages] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [authorityNeeds, setAuthorityNeeds] = useState('Need');

  const toggleAuthorityNeeds = (direction) => {
    if (direction === 'left') {
      setAuthorityNeeds('Need');
    } else {
      setAuthorityNeeds('Not needed');
    }
  };

  // const user = auth.currentUser;

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

  const uploadImage = async (uri, issueId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    
    // Create a unique reference for each image based on its URI or a timestamp
    const photoId = Date.now();
    const storageRef = ref(storage, `issuePhotos/${issueId}/${photoId}_${uri.split('/').pop()}`);
    
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef); // Return the download URL
  };

  const handleSubmit = async () => {
    try {
      const issueData = {
        issueTag,
        issueName,
        userId: user.id,
        issueDescription,
        reportedDate: new Date().toISOString(),
        location,
        lastUpdated: new Date().toISOString(),
        authorityNeeds,
      };
      const response = await axios.post(`${serverurl}/issues`, issueData);
      if (response.status === 201) {
        const newIssue = response.data;
        const issueId = newIssue.id; 
        const imageUploadPromises = images.map(uploadImage);
        const imageUrls = await Promise.all(imageUploadPromises);

        await axios.patch(`${serverurl}/issues/${issueId}`, {
          issuePhotos: imageUrls,
        });

        Alert.alert('Success', 'Issue Created Successfully!');
        const { user } = useAuthStore.getState();
        useFeedsStore.getState().fetchFeeds();
        useMyIssuesStore.getState().fetchMyIssues(user.id);
        useMyIssuesStore.setState({ isLoading: false });
        router.push('home/report/myIssue');
      }
    } catch (error) {
      console.error('Error creating issue', error.message);
      Alert.alert('Error', 'Failed to create an issue');
    }
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({
      type: 'Point',
      coordinates: [longitude, latitude],
    });
    setLocationQuery(''); // Clear the location query when map is pressed
  };

  const handleMarkerDrag = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({
      type: 'Point',
      coordinates: [longitude, latitude],
    });
    setLocationQuery('');
  };

  const handleMapClose = async () => {
    setShowMap(false);
  
    try {
      const res = await axios.get(
        `https://api.openrouteservice.org/geocode/reverse?api_key=${openroutekey}&point.lon=${location.coordinates[0]}&point.lat=${location.coordinates[1]}`
      );
  
      const locationData = res.data.features[0].properties;
      setLocation({
        type: 'Point',
        coordinates: location.coordinates,
        country: locationData.country || '',
        city: locationData.locality || '',
        state: locationData.region || '',
      });
    } catch (error) {
      console.error('Error fetching reverse geocode:', error.message);
    }
  }; 

  const fetchLocationSuggestions = async () => {
    if (locationQuery.trim().length === 0) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/autocomplete?api_key=${openroutekey}&text=${locationQuery}`
      );
      setLocationSuggestions(response.data.features || []);
    } catch (error) {
      console.error('Error fetching location suggestions:', error.message);
    }
  };

  const PhotoGalleryModal = () => (
    <Modal
      visible={showGallery}
      animationType="slide"
      onRequestClose={() => setShowGallery(false)}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
          <Text className="text-2xl font-bold text-blue-600">Photo Gallery</Text>
          <IconButton icon="close" size={24} onPress={() => setShowGallery(false)} />
        </View>
        <ScrollView className="p-4">
          <View className="flex-row flex-wrap justify-between">
            {images.map((uri, index) => (
              <Card key={index} className="w-[48%] mb-4">
                <Card.Cover source={{ uri }} className="h-40" />
                <Card.Actions className="justify-end">
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleRemovePhoto(index)}
                    className="bg-red-50"
                    iconColor="#EF4444"
                  />
                </Card.Actions>
              </Card>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <PaperProvider theme={enhancedTheme}>
      <View className="flex-1 bg-gray-50">
  
          <View className="bg-blue-600 p-6 rounded-b-3xl shadow-lg">
            <Text className="text-3xl font-bold text-white text-center mb-2">
              Report an Issue
            </Text>
            <Text className="text-blue-100 text-center">
              Help us make your community better
            </Text>
          </View>
          <ScrollView>
          <View className="px-4 pt-6">
            <Card className="mb-6 elevation-2">
              <Card.Content>
                <Text className="text-lg font-bold mb-4 text-gray-800">
                  Issue Category
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  className="mb-4"
                >
                  {issueTags.map((tag) => (
                    <Chip
                      key={tag}
                      selected={issueTag === tag}
                      onPress={() => setIssueTag(tag)}
                      className="mr-2"
                      selectedColor="#2563EB"
                    >
                      {tag}
                    </Chip>
                  ))}
                </ScrollView>

                <TextInput
                  mode="outlined"
                  label="Issue Title"
                  value={issueName}
                  onChangeText={setIssueName}
                  className="bg-white mb-4"
                />

                <TextInput
                  mode="outlined"
                  label="Description"
                  value={issueDescription}
                  onChangeText={setIssueDescription}
                  multiline
                  numberOfLines={4}
                  className="bg-white h-32"
                />
              </Card.Content>
            </Card>

            <Card className="mb-6 elevation-2">
              <Card.Content>
                <Text className="text-lg font-bold mb-4 text-gray-800">
                  Location Details
                </Text>
                <Button
                  mode="contained"
                  icon="map-marker"
                  onPress={() => setShowMap(true)}
                  className="mb-3"
                >
                  Select Location
                </Button>
                <Text className="text-center text-gray-600">
                  {`${location.city}, ${location.country}` || `${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}`}
                </Text>
              </Card.Content>
            </Card>

            <Card className="mb-6 elevation-2">
              <Card.Content>
                <Text className="text-lg font-bold mb-4 text-gray-800">
                  Photos
                </Text>
                <View className="flex-row justify-between items-center mb-4">
                  <Button
                    mode="contained"
                    icon="camera"
                    onPress={handleChoosePhoto}
                    className="flex-1 mr-2"
                  >
                    Add Photo
                  </Button>
                  {images.length > 0 && (
                    <Button
                      mode="outlined"
                      onPress={() => setShowGallery(true)}
                      className="flex-1 ml-2"
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
                      <Card key={index} className="mr-2 w-24">
                        <Card.Cover source={{ uri }} className="h-24" />
                      </Card>
                    ))}
                  </ScrollView>
                )}
              </Card.Content>
            </Card>
            <Card className="mb-6 elevation-2">
              <Card.Content>
                <Text className="text-lg font-bold mb-4 text-gray-800">
                  Local Authority Involvement
                </Text>
                <View className="flex-row justify-between items-center">
                  <TouchableOpacity
                    onPress={() => toggleAuthorityNeeds('left')}
                    className="bg-gray-200 p-2 rounded-full"
                  >
                    <MaterialIcons name="arrow-left" size={24} color="black" />
                  </TouchableOpacity>

                  <Text className="text-xl font-bold text-blue-600 mx-4">
                    {authorityNeeds}
                  </Text>

                  <TouchableOpacity
                    onPress={() => toggleAuthorityNeeds('right')}
                    className="bg-gray-200 p-2 rounded-full"
                  >
                    <MaterialIcons name="arrow-right" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>  

            <Button
              mode="contained"
              onPress={handleSubmit}
              className="h-14 justify-center mb-6"
              contentStyle={{ height: 56 }}
              labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
            >
              Submit Report
            </Button>
          </View>
        </ScrollView>

        {/* Keep the original Map Modal */}
        <Modal visible={showMap} animationType="slide">
          <View className="flex-1 bg-white">
            <View className="p-4">
              <TextInput
                mode="outlined"
                value={locationQuery}
                onChangeText={setLocationQuery}
                placeholder="Search location"
                onEndEditing={fetchLocationSuggestions}
                className="bg-white mb-0"
              />
            </View>

            {locationSuggestions.length > 0 && (
              <View className="mx-4 max-h-36 bg-white shadow rounded-lg">
                <FlatList
                  data={locationSuggestions}
                  keyExtractor={(item) => item.properties.id}
                  renderItem={({ item }) => (
                    <List.Item
                      onPress={() => {
                        setLocation({
                          type: 'Point',
                          coordinates: [
                            item.geometry.coordinates[0],
                            item.geometry.coordinates[1],
                          ],
                        });
                        setLocationQuery(item.properties.label);
                        setLocationSuggestions([]);
                      }}
                      title={item.properties.label}
                      titleNumberOfLines={2}
                      className="border-b border-gray-100"
                    />
                  )}
                />
              </View>
            )}

            <MapView
              className="flex-1"
              region={{
                latitude: location.coordinates[1],
                longitude: location.coordinates[0],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              provider={PROVIDER_GOOGLE}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={{
                  latitude: location.coordinates[1],
                  longitude: location.coordinates[0],
                }}
                title="Selected Location"
                draggable={true}
                onDragEnd={handleMarkerDrag}
              />
            </MapView>

            <Button
              mode="contained"
              onPress={handleMapClose}
              className="m-4"
            >
              Confirm Location
            </Button>
          </View>
        </Modal>

        <PhotoGalleryModal />
      </View>
    </PaperProvider>
  );
};

export default CreateIssue;