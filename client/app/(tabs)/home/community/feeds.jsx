import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { auth } from '../../../../firebaseConfig';
import { router } from 'expo-router';

const FeedCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="bg-white rounded-lg p-4 mb-2 shadow-md">
      <View className="flex-row items-center mb-2">
        <Image 
          source={{ uri: item.profilePicture }} 
          className="w-10 h-10 rounded-full mr-2"
        />
        <Text className="text-gray-500">{item.username}</Text>
      </View>
      <Text className="font-bold mb-2">No. of people joined: {item.peopleJoined}</Text>
      <Text className="font-bold mb-1">Project Title:</Text>
      <Text className="mb-2">"{item.projectTitle}"</Text>
      <Text className="mb-1">Date: {item.date}</Text>
      <Text className="mb-1">Time: {item.time}</Text>
      <Text className="mb-4">Location: {item.location}</Text>
      <View className="flex-row justify-between">
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded">
          <Text className="text-white font-bold">JOIN</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded">
          <Text className="text-gray-700 font-bold">Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function Feeds() {
  const user = auth.currentUser;

  // Sample data array for demonstration
  const feedData = [
    {
      id: '1',
      projectTitle: "Tree Planting Drive",
      date: "October 20, 2024",
      time: "10:00 AM - 2:00 PM",
      location: "City Park",
      peopleJoined: 29,
      description: "Join us for a day of environmental conservation...",
      profilePicture: user.photoURL,
      username: user.displayName || "username",
    },
    
  ];

  const handleCardPress = (item) => {
    // Pass only the item id
    router.push({
      pathname: '/project-details',
      params: { itemno: item.id }
    });
  };

  return (
    <FlatList
      data={feedData}
      renderItem={({ item }) => <FeedCard item={item} onPress={() => handleCardPress(item)} />}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}
