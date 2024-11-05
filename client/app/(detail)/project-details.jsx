import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Linking } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import axios from 'axios';
import { serverurl } from '../../firebaseConfig';
import { useAuthStore } from '../store';

const FeedDetails = () => {
  const {projectId} = useAuthStore();
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${serverurl}/project/${projectId}`);
        setProjectDetails(response.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-xl font-medium">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!projectDetails) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-xl font-medium">Project not found</Text>
      </SafeAreaView>
    );
  }

  const handleContact = (type) => {
    if (type === 'email') {
      Linking.openURL(`mailto:${projectDetails.contactInfo.email}`);
    } else if (type === 'phone') {
      Linking.openURL(`tel:${projectDetails.contactInfo.number}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="py-4">
          {projectDetails.communityId && (
            <View className="bg-white p-5 rounded-2xl shadow-lg mb-6">
              <Text className="text-xl font-bold text-gray-800 mb-2">
                {projectDetails.community.communityName}
              </Text>
              <Text className="text-base font-medium text-gray-600">
                {projectDetails.community.description}
              </Text>
            </View>
          )}

          {/* Project Details */}
          <View className="bg-white p-5 rounded-2xl shadow-lg mb-6">
            <Text className="text-2xl font-bold text-blue-600 mb-4">
              {projectDetails.projectName}
            </Text>
            <Text className="text-base font-medium text-gray-600 mb-5">
              {projectDetails.description}
            </Text>

            {/* Status Badge */}
            <View className="bg-blue-100 self-start px-4 py-2 rounded-full mb-5">
              <Text className="text-blue-800 font-semibold">
                Status: {projectDetails.status}
              </Text>
            </View>

            {/* Location Info */}
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="location-on" size={20} color="gray" />
              <Text className="text-base font-medium text-gray-700 ml-2">
                {projectDetails.community?.location.city}, {projectDetails.community?.location.state}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons name="calendar-today" size={20} color="gray" />
              <Text className="text-base font-medium text-gray-700 ml-2">
                Created: {new Date(projectDetails.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Contact Information */}
          <View className="bg-white p-5 rounded-2xl shadow-lg mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">Contact Information</Text>
            <TouchableOpacity 
              className="flex-row items-center mb-3" 
              onPress={() => handleContact('email')}
            >
              <MaterialIcons name="email" size={20} color="gray" />
              <Text className="text-base font-medium text-blue-600 ml-2">
                {projectDetails.contactInfo.email}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-row items-center" 
              onPress={() => handleContact('phone')}
            >
              <MaterialIcons name="phone" size={20} color="gray" />
              <Text className="text-base font-medium text-blue-600 ml-2">
                {projectDetails.contactInfo.number}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-blue-500 py-4 px-8 rounded-lg flex-row items-center shadow-lg">
              <MaterialIcons name="group-add" size={20} color="#FFFFFF" />
              <Text className="text-white font-bold ml-2">JOIN PROJECT</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 py-4 px-8 rounded-lg flex-row items-center shadow-lg">
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
