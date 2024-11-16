import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {   MaterialIcons, Feather, FontAwesome5  } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { router } from 'expo-router';
import { useAuthStore } from '../../../store';
import { serverurl, openroutekey } from '../../../../firebaseConfig';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import {
  // TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  IconButton,
  List,
  Card,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';

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

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const badges = [
  {
    id: '1',
    icon: 'star',
    iconComponent: MaterialIcons,
    name: 'Shield Badge'
  },
  { 
    id: '2', 
    icon: 'shield', 
    iconComponent: Feather,
    name: 'Star Badge' 
  },
  { 
    id: '3', 
    icon: 'star', 
    iconComponent: MaterialIcons,
    name: 'Award Badge' 
  },
  { 
    id: '4', 
    icon: 'award', 
    iconComponent: Feather,
    name: 'Award Badge' 
  },
  { 
    id: '5', 
    icon: 'medal', 
    iconComponent: FontAwesome5,
    name: 'Crown Badge' 
  },
  {
    id: '6',
    icon: 'medal',
    iconComponent: FontAwesome5,
    name: 'Medal Badge'
  }
];



const CreateClan = () => {
  const { user } = useAuthStore();
  const [clanName, setClanName] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [badge, setBadge] = useState(null);
  const [clanTag,setClanTag] = useState('');
  const [requiredMembers, setRequiredMembers] = useState(0);
  const [type, setType] = useState('Open');
  // const [location, setLocation] = useState('International');
  const [incrementInterval, setIncrementInterval] = useState(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [canCreateClan, setCanCreateClan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({
    type: 'Point',
    coordinates: [-118.2437, 34.0522],
    city: 'Los Angeles',
    country: 'USA'
  });

  useEffect(() => {
    const fetchClanStatus = async () => {
      try {
        const response = await axios.get(`${serverurl}/clan/status/${user.id}`);
        setCanCreateClan(response.data.canCreateClan);
      } catch (error) {
        console.error('Error fetching clan status:', error.message);
        Alert.alert('Error', 'Unable to verify clan status');
      } finally {
        setLoading(false);
      }
    };

    fetchClanStatus();
  }, [user.id]);

  if (loading) {
    return (
      <StyledSafeAreaView className="flex-1 p-4 bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
      </StyledSafeAreaView>
    );
  }

  const handleSelect = (selectedBadge) => {
    setBadge(selectedBadge);
    setIsOpen(false);
  };

  const handleCreateClan = async () => {
    if (!clanName.trim() || !description.trim() || !badge || !clanTag.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try{
      const clanData = {
        creatorId: user.id,
        clanName,
        description,
        location,
        clanTag,
        requiredMembers,
        type,
        badge
      };

      const response = await axios.post(`${serverurl}/clan`, clanData);
      if(response.status === 201){
        Alert.alert('Success', 'Clan Created Successfully!');
        router.push('home/crowd/myClan');

      }

    }catch(error) {
      console.log("Error while Creating Clan",error.message);
      Alert.alert('Error', 'Failed to create an clan');
    } 
    
  };

  const toggleType = () => {
    setType((prev) => (prev === 'Open' ? 'Invite Only' : 'Open'));
  };

  const incrementMembers = () => {
    setRequiredMembers((prev) => prev + 1);
  };

  const decrementMembers = () => {
    if (requiredMembers > 0) {
      setRequiredMembers((prev) => prev - 1);
    }
  };

  const startIncrementing = (callback) => {
    callback();
    const interval = setInterval(callback, 100); // Adjust the speed here (100 ms)
    setIncrementInterval(interval);
  };

  const stopIncrementing = () => {
    if (incrementInterval) {
      clearInterval(incrementInterval);
      setIncrementInterval(null);
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

  const handleMapClose = async () => {
    setShowMap(false);
  
    try {
      const res = await axios.get(
        `https://api.openrouteservice.org/geocode/reverse?api_key=${openroutekey}&point.lon=${location.coordinates[0]}&point.lat=${location.coordinates[1]}`
      );
  
      const locationData = res.data.features[0].properties;
      setLocation({
        ...location,
        country: locationData.country || '',
        city: locationData.locality || '',
        state: locationData.region || '',
      });
    } catch (error) {
      console.error('Error fetching reverse geocode:', error.message);
    }
  };

  const handleMarkerDrag = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({
      ...location,
      type: 'Point',
      coordinates: [longitude, latitude],
    });
    setLocationQuery('');
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

  return (
    <PaperProvider theme={enhancedTheme}>
      <StyledView className="flex-1 bg-gray-100 p-5">
        <ScrollView showsVerticalScrollIndicator={false}>
          <StyledText className="text-3xl font-bold text-center mb-5 text-blue-600">Create Your Clan</StyledText>

          <StyledView className="bg-white p-5 rounded-xl shadow-md mb-5">
            {/* Clan Name Section */}
            <StyledText className="text-lg font-semibold text-black">Clan Name</StyledText>
            <StyledTextInput
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-base"
              placeholder="Enter Clan Name"
              value={clanName}
              onChangeText={setClanName}
              placeholderTextColor="#999"
            />
            {/* Badge selection */}
            <StyledText className="text-lg font-semibold mb-2 text-blue-800">
              Clan Badge
            </StyledText>
            <StyledView className="mb-4">
              <StyledTouchableOpacity 
                className="flex-row items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100"
                onPress={() => setIsOpen(!isOpen)}
              >
                <StyledView className="flex-row items-center gap-2">
                  {badge ? (
                    <badge.iconComponent 
                      name={badge.icon} 
                      size={20} 
                      color="#4B5563"
                    />
                  ) : (
                    <StyledView /> // Keeps layout alignment if no badge is selected
                  )}
                  <StyledText className="text-base">
                    {badge ? badge.name : "Select Badge"}
                  </StyledText>
                </StyledView>
                <MaterialIcons 
                  name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={24} 
                  color="#9CA3AF"
                />
              </StyledTouchableOpacity>

              {isOpen && (
                <>
                  <StyledView className="absolute top-14 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                    {badges.map((badgeItem) => (
                      <StyledTouchableOpacity
                        key={badgeItem.id}
                        className="flex-row items-center px-4 py-3 border-b border-gray-100 last:border-b-0"
                        onPress={() => handleSelect(badgeItem)}
                      >
                        <badgeItem.iconComponent 
                          name={badgeItem.icon} 
                          size={20} 
                          color="#4B5563"
                        />  
                        <StyledText className="ml-3 text-gray-600">
                          {badgeItem.name}
                        </StyledText>
                      </StyledTouchableOpacity>
                    ))}
                  </StyledView>
                  <StyledTouchableOpacity
                    className="absolute top-0 bottom-0 left-0 right-0 -z-10"
                    onPress={() => setIsOpen(false)}
                  />
                </>
              )}
            </StyledView>

            {/* Clan Tag */}
            <StyledText className="text-lg font-semibold text-black">Clan Tag</StyledText>
            <StyledTextInput
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-base"
              placeholder="Enter Clan Tag"
              value={clanTag}
              onChangeText={setClanTag}
              placeholderTextColor="#999"
            />

            {/* Description Section */}
            <StyledText className="text-lg font-semibold mb-2 text-blue-800">Clan Description</StyledText>
            <StyledTextInput
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-base"
              placeholder="Enter Clan Description"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#999"
              multiline
            />

            {/* Clan Type Section */}
            <StyledText className="text-lg font-semibold mb-2 text-blue-800">Clan Type</StyledText>
            <StyledView className="flex-row items-center justify-between mb-4 bg-gray-200 rounded-lg py-3 px-4">
              <StyledTouchableOpacity onPress={toggleType}>
                <MaterialIcons name="chevron-left" size={24} color="#666" />
              </StyledTouchableOpacity>
              <StyledText className="font-semibold text-lg">{type}</StyledText>
              <StyledTouchableOpacity onPress={toggleType}>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </StyledTouchableOpacity>
            </StyledView>

            {/* Required Members Section */}
            <StyledText className="text-lg font-semibold mb-2 text-blue-800">Required Members</StyledText>
            <StyledView className="flex-row items-center justify-between mb-4 bg-gray-200 rounded-lg py-3 px-4">
              <StyledTouchableOpacity
                onPressIn={() => startIncrementing(decrementMembers)}
                onPressOut={stopIncrementing}
              >
                <MaterialIcons name="remove-circle-outline" size={30} color="#666" />
              </StyledTouchableOpacity>
              <StyledText className="font-semibold text-xl">{requiredMembers}</StyledText>
              <StyledTouchableOpacity
                onPressIn={() => startIncrementing(incrementMembers)}
                onPressOut={stopIncrementing}
              >
                <MaterialIcons name="add-circle-outline" size={30} color="#666" />
              </StyledTouchableOpacity>
            </StyledView>

            {/* Location Section */}
            {/* <StyledText className="text-lg font-semibold mb-2 text-blue-800">Location</StyledText>
            <StyledTextInput
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-base"
              placeholder="Enter Location"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#999"
            /> */}
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

            {/* Create Clan Button */}
            <StyledTouchableOpacity
              className="w-full bg-blue-600 p-4 rounded-lg items-center mt-6"
              onPress={handleCreateClan}
              disabled={!canCreateClan}
              style={{
                backgroundColor: canCreateClan ? '#4F46E5' : '#9CA3AF', // Grey out if disabled
                padding: 15,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                {canCreateClan ? 'Create Clan' : 'You Already Have a Clan'}
             </Text>
            </StyledTouchableOpacity>
          </StyledView>
        </ScrollView>
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
                          ...location,
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
              title="Community Location"
              draggable={true}
              onDragEnd={handleMarkerDrag}
              />
          </MapView>

          <Button
              mode="contained"
              onPress={handleMapClose}
              className="m-4"
              contentStyle={{ height: 50 }}
              labelStyle={{ fontSize: 16, fontWeight: '600' }}
          >
              Confirm Location
          </Button>
          </View>
        </Modal>
      </StyledView>
    </PaperProvider>
  );
};

export default CreateClan;
