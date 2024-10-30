import React, { useState } from 'react';
import { View, Text, Image, Modal, FlatList, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import axios from 'axios';
import {
  TextInput,
  Button,
  List,
  Provider as PaperProvider,
  DefaultTheme,
  IconButton,
} from 'react-native-paper';

const enhancedTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976D2',
    accent: '#03A9F4',
  },
  roundness: 8,
};

const CreateIssue = () => {
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

  const handleSubmit = async () => {
    try {
      const issueData = {
        issueTag,
        issueName,
        userId: '64f1d36e1c9e4234f4d9a1b7',
        issueDescription,
        reportedDate: new Date().toISOString(),
        location,
        lastUpdated: new Date().toISOString(),
      };
      const response = await axios.post('https://30rm3zfj-3000.inc1.devtunnels.ms/issues', issueData);
      if (response.status === 201) {
        Alert.alert('Success', 'Issue Created Successfully!');
        router.push({
          pathname: 'home/report/myIssue',
          params: {
            update: 'true'
          }
        });
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
    setLocationQuery(''); // Clear the location query when marker is dragged
  };

  const fetchLocationSuggestions = async () => {
    if (locationQuery.trim().length === 0) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/autocomplete?api_key=5b3ce3597851110001cf6248b5c28893cd7d4feb8536ae7f28200260&text=${locationQuery}`
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
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-blue-600">Photo Gallery</Text>
          <IconButton
            icon="close"
            size={24}
            onPress={() => setShowGallery(false)}
          />
        </View>
        <ScrollView className="p-4">
          <View className="flex-row flex-wrap justify-between">
            {images.map((uri, index) => (
              <View key={index} className="w-[48%] mb-4 relative">
                <Image
                  source={{ uri }}
                  className="w-full h-40 rounded-lg"
                />
                <TouchableOpacity
                  onPress={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1"
                >
                  <IconButton icon="close" size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const formData = [
    {
      label: 'Issue Tag',
      input: () => (
        <TextInput
          mode="outlined"
          value={issueTag}
          onChangeText={setIssueTag}
          placeholder="Issue Tag"
          className="bg-white"
        />
      ),
    },
    {
      label: 'Issue Name',
      input: () => (
        <TextInput
          mode="outlined"
          value={issueName}
          onChangeText={setIssueName}
          placeholder="Issue Name"
          className="bg-white"
        />
      ),
    },
    {
      label: 'Issue Description',
      input: () => (
        <TextInput
          mode="outlined"
          value={issueDescription}
          onChangeText={setIssueDescription}
          placeholder="Issue Description"
          multiline
          numberOfLines={4}
          className="bg-white h-24"
        />
      ),
    },
  ];

  return (
    <PaperProvider theme={enhancedTheme}>
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="bg-white p-4 mb-4 shadow">
          <Text className="text-2xl font-bold text-center text-blue-600">
            Create New Issue
          </Text>
        </View>

        <FlatList
          data={formData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="mx-4 mb-4">
              <Text className="text-base font-semibold mb-2 text-gray-800">
                {item.label}
              </Text>
              {item.input()}
            </View>
          )}
          ListHeaderComponent={
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
                  onPress={() => setShowMap(false)}
                  className="m-4"
                >
                  Confirm Location
                </Button>
              </View>
            </Modal>
          }
          ListFooterComponent={
            <View className="p-4">
              <View className="bg-white p-4 rounded-lg shadow mb-4">
                <View className="mb-4">
                  <Button
                    mode="contained"
                    icon="map-marker"
                    onPress={() => setShowMap(true)}
                    className="mb-2"
                  >
                    Select Location
                  </Button>
                  <Text className="text-center text-gray-600">
                    {locationQuery ? locationQuery : `${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}`}
                  </Text>
                </View>

                <View className="mt-4">
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
                        View Photos ({images.length})
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
                        <View key={index} className="mr-2 relative">
                          <Image
                            source={{ uri }}
                            className="w-24 h-24 rounded-lg"
                          />
                          <TouchableOpacity
                            onPress={() => handleRemovePhoto(index)}
                            className="absolute top-1 right-1 bg-white rounded-full"
                          >
                            <IconButton icon="close" size={16} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>

              <Button
                mode="contained"
                onPress={handleSubmit}
                className="h-12 justify-center"
                labelStyle="text-lg font-bold"
              >
                Submit Issue
              </Button>
            </View>
          }
        />
        <PhotoGalleryModal />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default CreateIssue;