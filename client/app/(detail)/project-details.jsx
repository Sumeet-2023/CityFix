import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from 'expo-router';
import { auth } from '../../firebaseConfig';

const FeedDetails = () => {
  const { itemno } = useLocalSearchParams();
  const user = auth.currentUser;

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
    {
      id: '2',
      projectTitle: "Community Clean-up",
      date: "October 27, 2024",
      time: "9:00 AM - 1:00 PM",
      location: "Downtown Area",
      peopleJoined: 45,
      description: "Let's clean up the downtown area...",
      profilePicture: user.photoURL,
      username: user.displayName || "username",
    },
  ];

  // Find the feed item by id
  const feedDetails = feedData.find(feed => feed.id === itemno);

  if (!feedDetails) {
    return <Text>Feed not found</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="py-4">
          {/* Organizer Info */}
          <View className="flex-row items-center mb-4">
            <Image 
              source={{ uri: user.photoURL }} 
              className="w-16 h-16 rounded-full mr-4"
            />
            <View>
              <Text className="text-xl font-bold text-gray-800">{user.displayName}</Text>
              <Text className="text-lg text-gray-600">Organizer</Text>
            </View>
          </View>

          {/* Project Title */}
          <Text className="text-2xl font-bold text-blue-600 mb-3">{feedDetails.projectTitle}</Text>

          {/* Event Details */}
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <Text className="text-lg text-gray-700 mb-2">
              <MaterialIcons name="event" size={20} color="gray" /> 
              Date: <Text className="font-bold text-gray-800">{feedDetails.date}</Text>
            </Text>
            <Text className="text-lg text-gray-700 mb-2">
              <MaterialIcons name="access-time" size={20} color="gray" /> 
              Time: <Text className="font-bold text-gray-800">{feedDetails.time}</Text>
            </Text>
            <Text className="text-lg text-gray-700 mb-2">
              <MaterialIcons name="location-on" size={20} color="gray" /> 
              Location: <Text className="font-bold text-gray-800">{feedDetails.location}</Text>
            </Text>
            <Text className="text-lg text-gray-700 mb-2">
              <MaterialIcons name="people" size={20} color="gray" /> 
              People Joined: <Text className="font-bold text-gray-800">{feedDetails.peopleJoined}</Text>
            </Text>
          </View>

          {/* Description */}
          <Text className="text-xl font-bold text-gray-800 mb-2">Description:</Text>
          <Text className="text-lg text-gray-600 mb-4">{feedDetails.description}</Text>

          {/* Buttons */}
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-md flex-row items-center shadow">
              <MaterialIcons name="group-add" size={20} color="#FFFFFF" />
              <Text className="text-white font-bold ml-2">JOIN PROJECT</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-300 py-3 px-6 rounded-md flex-row items-center shadow">
              <MaterialIcons name="share" size={20} color="#4B5563" />
              <Text className="text-gray-800 font-bold ml-2">Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedDetails;
