import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { serverurl } from '../../../../firebaseConfig';
import { useAuthStore } from '../../../store';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const Search = () => {
  const { user } = useAuthStore(); // Assuming user context/store is available
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClans, setFilteredClans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const [error, setError] = useState(null);
  const [canRequestToJoin, setCanRequestToJoin] = useState(true); // State to manage button disabling

  const fetchClans = async (query = '', page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${serverurl}/clan`, {
        params: { search: query, page, limit },
      });

      setFilteredClans(response.data.clans);
    } catch (err) {
      console.error('Error fetching clans:', err.message);
      setError('Failed to load clans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserClanStatus = async () => {
    try {
      const response = await axios.get(`${serverurl}/clan/status/${user.id}`);
      setCanRequestToJoin(response.data.canCreateClan); // Update state based on user status
    } catch (err) {
      console.error('Error fetching user clan status:', err.message);
      setCanRequestToJoin(false); // Default to disabling if there's an error
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchClans(query); // Trigger fetchClans with the search query
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchClans(searchQuery); // Re-fetch clans with the current search query
      await fetchUserClanStatus(); // Re-fetch the user's clan status
    } catch (err) {
      console.error('Error during refresh:', err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClans(); // Fetch clans on initial load
    fetchUserClanStatus(); // Fetch user clan status
  }, []);

  return (
    <StyledView className="flex-1 bg-gray-100 p-5">
      <StyledText className="text-3xl font-bold text-center mb-5 text-blue-600">Search Clan</StyledText>

      {/* Search Bar */}
      <StyledView className="flex-row items-center bg-white border border-gray-300 rounded-lg px-4 py-3 mb-5">
        <MaterialIcons name="search" size={24} color="#999" />
        <StyledTextInput
          className="flex-1 ml-3 text-lg"
          placeholder="Search clans by name or tag"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </StyledView>

      {/* Clan List */}
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : error ? (
        <StyledText className="text-center text-red-500 mt-10 text-lg">{error}</StyledText>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredClans.length > 0 ? (
            filteredClans.map((clan) => (
              <StyledView key={clan.id} className="bg-white p-5 rounded-lg mb-4 shadow-md">
                <StyledView className="flex-row items-center mb-3">
                  <FontAwesome5 name="shield-alt" size={24} color="#4b5563" className="mr-3" />
                  <StyledText className="text-xl font-bold text-blue-600">{clan.clanName}</StyledText>
                </StyledView>

                <StyledView className="flex-row justify-between items-center mb-2">
                  <StyledText className="text-base text-gray-600">Clan Tag:</StyledText>
                  <StyledText className="text-base text-gray-800">{clan.clanTag}</StyledText>
                </StyledView>

                <StyledView className="flex-row justify-between items-center mb-2">
                  <StyledText className="text-base text-gray-600">Type:</StyledText>
                  <StyledText className="text-base text-gray-800">{clan.type}</StyledText>
                </StyledView>

                <StyledView className="flex-row justify-between items-center mb-2">
                  <StyledText className="text-base text-gray-600">Members:</StyledText>
                  <StyledText className="text-base text-gray-800">{clan._count.members} / {clan.requiredMembers || 100}</StyledText>
                </StyledView>

                <StyledView className="flex-row justify-between items-center mb-4">
                  <StyledText className="text-base text-gray-600">Location:</StyledText>
                  <StyledText className="text-base text-gray-800">{clan.location?.city || 'Unknown'}, {clan.location?.country || 'Unknown'}</StyledText>
                </StyledView>

                {/* Action Button */}
                <StyledTouchableOpacity
                  disabled={!canRequestToJoin} // Disable button if user has joined/created a clan
                  className={`py-3 rounded-lg ${canRequestToJoin ? 'bg-blue-500' : 'bg-gray-400'}`}
                >
                  <StyledText className="text-center text-white font-semibold">
                    {canRequestToJoin ? 'Request to Join' : 'Already in a Clan'}
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            ))
          ) : (
            <StyledText className="text-center text-gray-500 mt-10 text-lg">
              No clans found matching your search.
            </StyledText>
          )}
        </ScrollView>
      )}
    </StyledView>
  );
};

export default Search;