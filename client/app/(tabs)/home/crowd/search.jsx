import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Importing icons

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

// Sample Clan Data to Mimic Searching (for now, hardcoded)
const clanData = [
  { id: 'A1234567', name: 'Warriors of Light', type: 'Open', members: 50, location: 'International' },
  { id: 'B7654321', name: 'Dragon Knights', type: 'Invite Only', members: 80, location: 'United States' },
  { id: 'C2468135', name: 'Royal Elites', type: 'Open', members: 100, location: 'Europe' },
  // Add more data as needed for testing
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClans, setFilteredClans] = useState(clanData);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredClans(clanData);
    } else {
      const filtered = clanData.filter((clan) =>
        clan.id.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredClans(filtered);
    }
  };

  return (
    <StyledView className="flex-1 bg-gray-100 p-5">
      <StyledText className="text-3xl font-bold text-center mb-5 text-blue-600">Search Clan</StyledText>

      {/* Search Bar */}
      <StyledView className="flex-row items-center bg-white border border-gray-300 rounded-lg px-4 py-3 mb-5">
        <MaterialIcons name="search" size={24} color="#999" />
        <StyledTextInput
          className="flex-1 ml-3 text-lg"
          placeholder="Enter Clan Tag to search"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </StyledView>

      <ScrollView>
        {filteredClans.length > 0 ? (
          filteredClans.map((clan) => (
            <StyledView key={clan.id} className="bg-white p-5 rounded-lg mb-4 shadow-md">
              <StyledView className="flex-row items-center mb-3">
                <FontAwesome5 name="shield-alt" size={24} color="#4b5563" className="mr-3" />
                <StyledText className="text-xl font-bold text-blue-600">{clan.name}</StyledText>
              </StyledView>

              <StyledView className="flex-row justify-between items-center mb-2">
                <StyledText className="text-base text-gray-600">Clan Tag:</StyledText>
                <StyledText className="text-base text-gray-800">{clan.id}</StyledText>
              </StyledView>

              <StyledView className="flex-row justify-between items-center mb-2">
                <StyledText className="text-base text-gray-600">Type:</StyledText>
                <StyledText className="text-base text-gray-800">{clan.type}</StyledText>
              </StyledView>

              <StyledView className="flex-row justify-between items-center mb-2">
                <StyledText className="text-base text-gray-600">Members:</StyledText>
                <StyledText className="text-base text-gray-800">{clan.members} / 100</StyledText>
              </StyledView>

              <StyledView className="flex-row justify-between items-center mb-4">
                <StyledText className="text-base text-gray-600">Location:</StyledText>
                <StyledText className="text-base text-gray-800">{clan.location}</StyledText>
              </StyledView>

              {/* Action Button */}
              <StyledTouchableOpacity className="bg-blue-500 py-3 rounded-lg">
                <StyledText className="text-center text-white font-semibold">Request to Join</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          ))
        ) : (
          <StyledText className="text-center text-gray-500 mt-10 text-lg">
            No clans found with that tag. Please try another search.
          </StyledText>
        )}
      </ScrollView>
    </StyledView>
  );
};

export default Search;
