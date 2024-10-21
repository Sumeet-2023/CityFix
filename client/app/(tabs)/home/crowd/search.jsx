import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-center mb-5">Search Clan</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 mb-5"
        placeholder="Enter Clan Tag to search"
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor="#999"
      />

      <ScrollView>
        {filteredClans.length > 0 ? (
          filteredClans.map((clan) => (
            <View key={clan.id} className="bg-gray-100 p-4 rounded-xl mb-4 shadow-md">
              <Text className="text-lg font-bold">{clan.name}</Text>
              <Text className="text-base text-gray-700">Clan Tag: {clan.id}</Text>
              <Text className="text-base text-gray-700">Type: {clan.type}</Text>
              <Text className="text-base text-gray-700">Members: {clan.members}</Text>
              <Text className="text-base text-gray-700">Location: {clan.location}</Text>
            </View>
          ))
        ) : (
          <Text className="text-center text-gray-500 mt-5">No clans found with that tag</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Search;