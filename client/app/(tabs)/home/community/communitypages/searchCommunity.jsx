import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { serverurl } from '../../../../../firebaseConfig';
import { styled } from 'nativewind';
import { MaterialIcons } from '@expo/vector-icons'; // Importing icons
import { useAuthStore } from '../../../../store';
import { router } from 'expo-router';


const SearchCommunity = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();

  const fetchNearbyCommunities = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverurl}/community/nearbyCommunities`, {
        params: {
          latitude,
          longitude,
        },
      });
      setCommunities(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const getLocationAndFetchCommunities = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        Alert.alert('Permission denied', 'Please enable location services to find nearby communities.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      fetchNearbyCommunities(latitude, longitude);
    } catch (error) {
      console.error(error);
      setError('Unable to retrieve location');
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      const response = await axios.post(`${serverurl}/community/${communityId}/members`, {
        userId: user.id,
      });
      Alert.alert("Success", "You have successfully joined the community!");
    } catch (error) {
      console.error('Error joining community:', error);
      Alert.alert("Error", "Unable to join the community. Please try again later.");
    }
  };  

  useEffect(() => {
    getLocationAndFetchCommunities();
  }, []);

  const filteredCommunities = communities.filter(community =>
    community.communityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 m-4">
      {/* Search Bar */}
      <View className="flex-row items-center h-10 border border-gray-300 rounded-lg px-2 mb-4 bg-white">
        <MaterialIcons name="search" size={20} color="#999" />
        <TextInput
          className="flex-1 ml-2"
          placeholder="Search for communities..."
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          placeholderTextColor="#999"
        />
      </View>

      {/* ScrollView for Communities */}
      <Text className="text-2xl font-bold mb-4">Nearby Communities</Text>
      <ScrollView>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text className="text-red-500 mb-4">{error}</Text>}
        
        {communities.length > 0 ? (
          communities.map((community) => (
            <View key={community.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
              {/* Community Name with Icon */}
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="group" size={24} color="#4b5563" />
                <Text className="text-xl font-bold ml-2">{community.communityName}</Text>
              </View>

              {/* Community Description */}
              <Text className="text-gray-700 mb-2">{community.description}</Text>

              {/* Additional Info (Location and Members) */}
              <View className="flex-row justify-between items-center mb-4">
                {/* Location Icon and Info */}
                <View className="flex-row items-center">
                  <MaterialIcons name="location-on" size={18} color="#4b5563" />
                  <Text className="ml-1 text-sm text-gray-500">{community.location ? 
                    `${community.location.city}, ${community.location.country}` : 
                     'Location not available'}
                  </Text>
                </View>

                {/* Members Count Icon and Info */}
                <View className="flex-row items-center">
                  <MaterialIcons name="people" size={18} color="#4b5563" />
                  <Text className="ml-1 text-sm text-gray-500">
                    {community.membersCount ? `${community.membersCount} members` : '1 member'}
                  </Text>
                </View>
              </View>

              {/* Join Button */}
              <TouchableOpacity
                className="bg-blue-500 rounded-lg p-2"
                onPress={() => handleJoinCommunity(community.id)}
              >
                <Text className="text-white text-center font-semibold">Join</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          !loading && <Text>No communities found nearby.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchCommunity;