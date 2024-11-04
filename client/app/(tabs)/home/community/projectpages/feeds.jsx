import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../../../store';
import { serverurl } from '../../../../../firebaseConfig';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

const ProjectCard = ({ item, onPress }) => {
  const formattedDate = format(new Date(item.createdAt), 'MMMM dd, yyyy');
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      className="bg-white rounded-2xl mb-4 overflow-hidden shadow-lg"
    >
      <LinearGradient
        colors={['#4F46E5', '#818CF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="px-4 py-2"
      >
        <Text className="text-white font-bold text-lg">{item.projectName}</Text>
      </LinearGradient>
      
      <View className="p-4">
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center mr-3">
            <Ionicons name="briefcase-outline" size={24} color="#4F46E5" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-600 text-sm">Project ID</Text>
            <Text className="text-gray-800 font-semibold">{item.id.slice(0, 8)}...</Text>
          </View>
          <View className="bg-indigo-100 px-3 py-1 rounded-full">
            <Text className="text-indigo-600 font-medium">{item.status}</Text>
          </View>
        </View>

        <Text className="text-gray-600 mb-2" numberOfLines={2}>{item.description}</Text>
        
        <View className="flex-row items-center mb-3">
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text className="text-gray-500 ml-2 text-sm">{formattedDate}</Text>
        </View>

        <View className="flex-row items-center mb-4">
          <Ionicons name="mail-outline" size={16} color="#6B7280" />
          <Text className="text-gray-500 ml-2 text-sm">{item.contactInfo.email}</Text>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity className="bg-indigo-600 px-6 py-3 rounded-xl flex-row items-center">
            <Ionicons name="people-outline" size={18} color="white" />
            <Text className="text-white font-bold ml-2">Join Project</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 px-6 py-3 rounded-xl flex-row items-center">
            <Ionicons name="share-social-outline" size={18} color="#4B5563" />
            <Text className="text-gray-700 font-bold ml-2">Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function Feeds() {
  const { communityId } = useLocalSearchParams();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${serverurl}/project/byCommunity/${communityId}`);
        setProjects(response.data);
        setFilteredProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [communityId]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((project) =>
        project.id.toLowerCase().includes(query.toLowerCase()) ||
        project.projectName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  const handleCardPress = (item) => {
    router.push({
      pathname: '/project-details',
      params: { itemno: item.id }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#4F46E5', '#818CF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-5 pt-12 pb-6"
      >
        <Text className="text-2xl font-bold text-white text-center mb-4">
          Community Projects
        </Text>
        <View className="bg-white rounded-xl flex-row items-center px-4 py-2">
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search projects by name or ID"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </LinearGradient>

      {filteredProjects.length > 0 ? (
        <FlatList
          data={filteredProjects}
          renderItem={({ item }) => (
            <ProjectCard
              item={item}
              onPress={() => handleCardPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="search" size={48} color="#D1D5DB" />
          <Text className="text-gray-400 text-lg mt-4 text-center">
            No projects found matching your search
          </Text>
        </View>
      )}
    </View>
  );
}