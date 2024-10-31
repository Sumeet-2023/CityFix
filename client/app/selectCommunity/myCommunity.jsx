import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';

// Sample data for communities
const communityData = [
  {
    id: '1',
    name: 'Yoga Enthusiasts',
    description: 'A community for yoga lovers to connect and share.',
    location: 'San Francisco, CA',
    photo: 'https://example.com/yoga-community.jpg',
  },
  {
    id: '2',
    name: 'Mountain Bikers',
    description: 'Join us for mountain biking adventures!',
    location: 'Denver, CO',
    photo: 'https://example.com/biking-community.jpg',
  },
  {
    id: '3',
    name: 'Cooking Masters',
    description: 'For those who love to cook and learn new recipes.',
    location: 'New York, NY',
    photo: 'https://example.com/cooking-community.jpg',
  },
];

const CommunityCard = ({ community }) => (
  <TouchableOpacity className="bg-white p-4 rounded-lg shadow-md mb-4 flex-row items-center">
    <Image
      source={{ uri: community.photo }}
      className="w-16 h-16 rounded-full mr-4"
    />
    <View className="flex-1">
      <Text className="text-lg font-bold text-gray-800">{community.name}</Text>
      <Text className="text-sm text-gray-600">{community.description}</Text>
      <Text className="text-sm text-gray-500">{community.location}</Text>
    </View>
  </TouchableOpacity>
);

const CommunityList = () => {
  return (
    <FlatList
      data={communityData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CommunityCard community={item} />}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

export default CommunityList;
