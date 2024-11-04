import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../../../store';
import { serverurl } from '../../../../../firebaseConfig';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import ProjectCard from '../../../../../components/project/ProjectCard';
import FilterButton from '../../../../../components/project/FilterButton';

export default function Feeds() {
  const { communityId } = useLocalSearchParams();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchProjects = async (filterType) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${serverurl}/project/byCommunityWithFilter/${communityId}?filterType=${filterType}&userId=${user?.id}`
      );
      setProjects(response.data);
      setFilteredProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      Alert.alert('Error', 'Failed to fetch projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshProjects = () => {
    fetchProjects(activeFilter);
  };

  useEffect(() => {
    fetchProjects(activeFilter);
  }, [communityId, activeFilter]);

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
    router.push(`/project/${item}`);
  };

  const filterButtons = [
    { id: 'all', title: 'All Projects', icon: 'grid-outline' },
    { id: 'userCreatedProjects', title: 'Created', icon: 'create-outline' },
    { id: 'userProjects', title: 'Joined', icon: 'person-outline' },
    { id: 'nonMemberProjects', title: 'Available', icon: 'add-circle-outline' }
  ];

  const getEmptyStateMessage = () => {
    switch (activeFilter) {
      case 'userCreatedProjects':
        return "You haven't created any projects yet";
      case 'userProjects':
        return "You haven't joined any projects yet";
      case 'nonMemberProjects':
        return "No available projects to join at the moment";
      default:
        return "No projects found matching your search";
    }
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
        <Text className="text-xl font-bold text-white text-center mb-4">
          Community Projects
        </Text>
        <View className="bg-white rounded-xl flex-row items-center px-4 py-2 mb-4">
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search projects by name or ID"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-2"
        >
          {filterButtons.map((button) => (
            <FilterButton
              key={button.id}
              title={button.title}
              icon={button.icon}
              active={activeFilter === button.id}
              onPress={() => setActiveFilter(button.id)}
            />
          ))}
        </ScrollView>
      </LinearGradient>

      {filteredProjects.length > 0 ? (
        <FlatList
          data={filteredProjects}
          renderItem={({ item }) => (
            <ProjectCard
              item={item}
              onPress={() => handleCardPress(item.id)}
              communityId={communityId}
              userId={user?.id}
              filterType={activeFilter}
              refreshProjects={refreshProjects}
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
            {getEmptyStateMessage()}
          </Text>
        </View>
      )}
    </View>
  );
}