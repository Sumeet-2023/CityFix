import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { auth } from '../../../../firebaseConfig';


const FeedCard = ({ username, profilePicture, projectTitle, date, time, location, peopleJoined }) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-2 shadow-md">
      <View className="flex-row items-center mb-2">
        <Image 
          source={{ uri: profilePicture }} 
          className="w-10 h-10 rounded-full mr-2"
        />
        <Text className="text-gray-500">{username}</Text>
      </View>
      <Text className="font-bold mb-2">no. of people joined: {peopleJoined}</Text>
      <Text className="font-bold mb-1">Project Title:</Text>
      <Text className="mb-2">"{projectTitle}"</Text>
      <Text className="mb-1">Date: {date}</Text>
      <Text className="mb-1">Time: {time}</Text>
      <Text className="mb-4">Location: {location}</Text>
      <View className="flex-row justify-between">
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded">
          <Text className="text-white font-bold">JOIN</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded">
          <Text className="text-gray-700 font-bold">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Feeds() {
  const user = auth.currentUser;
  return (
    <View className="p-4">
      <FeedCard
        username={user.displayName||"username"}
        profilePicture="/api/placeholder/40/40" // Placeholder image
        projectTitle="Tree Planting Drive"
        date="October 20, 2024"
        time="10:00 AM - 2:00 PM"
        location="City Park"
        peopleJoined={29}
      />
      <FeedCard
        username={user.displayName||"username"}
        profilePicture="/api/placeholder/40/40" // Placeholder image
        projectTitle="Tree Planting Drive"
        date="October 20, 2024"
        time="10:00 AM - 2:00 PM"
        location="City Park"
        peopleJoined={29}
      />
    </View>
  );
}