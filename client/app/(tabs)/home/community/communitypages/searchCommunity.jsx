import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { serverurl } from '../../../../../firebaseConfig';
import { styled } from 'nativewind';
import { MaterialIcons } from '@expo/vector-icons'; // Importing icons
import { useAuthStore } from '../../../../store';
import { router } from 'expo-router';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const SearchCommunity = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [joinedCommunities, setJoinedCommunities] = useState(new Set()); // To track joined communities
  const { user } = useAuthStore();

  // Fetch nearby communities based on user's location
  const fetchNearbyCommunities = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverurl}/community/nearbyCommunities`, {
        params: { latitude, longitude },
      });
      setCommunities(response.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Unable to retrieve nearby communities.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch communities joined by the user
  const fetchJoinedCommunities = async () => {
    try {
      const response = await axios.get(`${serverurl}/community/communityJoined/${user.id}`);
      const joinedIds = response.data.map((community) => community.id);
      setJoinedCommunities(new Set(joinedIds)); // Store joined community IDs in a Set for quick lookup
    } catch (err) {
      console.error('Error fetching joined communities:', err);
    }
  };

  // Fetch user's location and nearby communities
  const getLocationAndFetchCommunities = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        Alert.alert('Permission denied', 'Please enable location services to find nearby communities.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      await fetchNearbyCommunities(latitude, longitude);
      await fetchJoinedCommunities(); // Fetch joined communities after fetching nearby communities
    } catch (error) {
      console.error(error);
      setError('Unable to retrieve location');
    } finally {
      setLoading(false);
    }
  };

  // Handle user joining a community
  const handleJoinCommunity = async (communityId) => {
    try {
      await axios.post(`${serverurl}/community/${communityId}/members`, {
        userId: user.id,
      });
      setJoinedCommunities((prev) => new Set(prev).add(communityId)); // Add the communityId to the joined set
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
    <StyledSafeAreaView className="flex-1 m-4">
      {/* Search Bar */}
      <StyledView className="flex-row items-center h-10 border border-gray-300 rounded-lg px-2 mb-4 bg-white">
        <MaterialIcons name="search" size={20} color="#999" />
        <TextInput
          className="flex-1 ml-2"
          placeholder="Search for communities..."
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          placeholderTextColor="#999"
        />
      </StyledView>

      {/* ScrollView for Communities */}
      <StyledText className="text-2xl font-bold mb-4">Nearby Communities</StyledText>
      <ScrollView>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <StyledText className="text-red-500 mb-4">{error}</StyledText>}
        
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map((community) => (
            <StyledView key={community.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
              {/* Community Name with Icon */}
              <StyledView className="flex-row items-center mb-2">
                <MaterialIcons name="group" size={24} color="#4b5563" />
                <StyledText className="text-xl font-bold ml-2">{community.communityName}</StyledText>
              </StyledView>

              {/* Community Description */}
              <StyledText className="text-gray-700 mb-2">{community.description}</StyledText>

              {/* Additional Info (Location and Members) */}
              <StyledView className="flex-row justify-between items-center mb-4">
                {/* Location Icon and Info */}
                <StyledView className="flex-row items-center">
                  <MaterialIcons name="location-on" size={18} color="#4b5563" />
                  <StyledText className="ml-1 text-sm text-gray-500">{community.location ? 
                    `${community.location.city}, ${community.location.country}` : 
                     'Location not available'}
                  </StyledText>
                </StyledView>

                {/* Members Count Icon and Info */}
                <StyledView className="flex-row items-center">
                  <MaterialIcons name="people" size={18} color="#4b5563" />
                  <StyledText className="ml-1 text-sm text-gray-500">
                    {community.members?.length  ? `${community.members?.length } members` : '1 member'}
                  </StyledText>
                </StyledView>
              </StyledView>

              {/* Join Button */}
              <StyledTouchableOpacity
                className={`${
                  joinedCommunities.has(community.id) ? 'bg-gray-300' : 'bg-blue-500'
                } rounded-lg p-2`}
                onPress={() => handleJoinCommunity(community.id)}
                disabled={joinedCommunities.has(community.id)}
              >
                <StyledText className="text-white text-center font-semibold">
                  {joinedCommunities.has(community.id) ? 'Joined' : 'Join'}
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          ))
        ) : (
          !loading && <StyledText>No communities found nearby.</StyledText>
        )}
      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default SearchCommunity;