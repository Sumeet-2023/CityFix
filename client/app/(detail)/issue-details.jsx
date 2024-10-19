import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const IssueDetails = () => {
  const { issue } = useLocalSearchParams();
  const issueDetails = JSON.parse(issue);

  // State to manage comment visibility
  const [showComments, setShowComments] = useState(false);

  return (
    <ScrollView className="flex-1 px-5 py-5 bg-white">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-black">#{issueDetails.id} {issueDetails.title}</Text>
        <Text className="text-sm text-blue-500 uppercase">{issueDetails.status}</Text>
      </View>

      <View className="mb-3">
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="person" size={20} color="#555" />
          <Text className="ml-2 text-lg text-gray-700">Reported by: {issueDetails.reportedBy}</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="event" size={20} color="#555" />
          <Text className="ml-2 text-lg text-gray-700">Date Reported: {issueDetails.dateReported}</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="location-on" size={20} color="#555" />
          <Text className="ml-2 text-lg text-gray-700">Location: {issueDetails.location}</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="update" size={20} color="#555" />
          <Text className="ml-2 text-lg text-gray-700">Last Updated: {issueDetails.lastUpdated}</Text>
        </View>
      </View>

      <View className="mb-5">
        <Text className="text-lg text-gray-800 mb-3">{issueDetails.details}</Text>
        <Image source={require('../../assets/images/pothole.jpg')} className="w-full h-40 rounded-xl mb-5" />
      </View>

      {/* Separator Line */}
      <View className="border-b border-gray-300 mb-5"></View>

      {/* Comments Section Toggle */}
      <TouchableOpacity className="flex-row items-center" onPress={() => setShowComments(!showComments)}>
        <Text className="text-lg font-semibold text-blue-500 mr-0">
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </Text>
        {showComments ? (
          <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
        ) : (
          <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
        )}
      </TouchableOpacity>

      {/* Comments Section */}
      {showComments && (
        <View className="mb-5">
          <Text className="text-lg font-semibold mb-4">Comments</Text>
          
          {/* Hardcoded comments for demonstration */}
          <View className="mb-4 p-4 bg-gray-100 rounded-lg">
            <View className="flex-row items-center mb-2">
              <Image source={require('../../assets/images/pothole.jpg')} className="w-8 h-8 rounded-full mr-3" />
              <Text className="font-bold text-black">User1</Text>
            </View>
            <Text className="text-gray-600">Thanks for reporting this issue! We are looking into it.</Text>
          </View>
          <View className="mb-4 p-4 bg-gray-100 rounded-lg">
            <View className="flex-row items-center mb-2">
              <Image source={require('../../assets/images/pothole.jpg')} className="w-8 h-8 rounded-full mr-3" />
              <Text className="font-bold text-black">User2</Text>
            </View>
            <Text className="text-gray-600">I noticed this as well. It’s really causing a lot of trouble.</Text>
          </View>

          {/* Add Comment Section */}
          <View className="p-4 bg-gray-100 rounded-lg">
            <TextInput
              className="w-full h-20 border border-gray-300 rounded-lg p-4 mb-4 bg-white"
              placeholder="Add a comment..."
              multiline
            />
            <TouchableOpacity className="bg-blue-500 py-3 rounded-lg">
              <Text className="text-white text-center font-bold">Post Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default IssueDetails;