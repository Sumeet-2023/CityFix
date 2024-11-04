import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../../../store';
import { serverurl } from '../../../../../firebaseConfig';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

const ProjectCard = ({ item, onPress, communityId, userId, filterType }) => {
  const formattedDate = format(new Date(item.createdAt), 'MMMM dd, yyyy');
  const [isLoading, setIsLoading] = useState(false);
  const isCreator = item.creatorID === userId;

  const handleJoinProject = async (projectId) => {
    try {
      setIsLoading(true);
      const data = {
        userId: userId,
        communityId: communityId,
        projectId: projectId
      }
      const res = await axios.post(`${serverurl}/project/join/communityProject`, data);
      Alert.alert('Success', 'Successfully joined the project!');
    } catch (error) {
      Alert.alert('Error', 'Failed to join project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleLeaveProject = async (projectId) => {
    Alert.alert(
      'Leave Project',
      'Are you sure you want to leave this project?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await axios.post(`${serverurl}/project/leave`, {
                userId: userId,
                projectId: projectId
              });
              Alert.alert('Success', 'Successfully left the project');
            } catch (error) {
              Alert.alert('Error', 'Failed to leave project. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  }

  const handleDeleteProject = async (projectId) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await axios.delete(`${serverurl}/project/${userId}/${projectId}`);
              Alert.alert('Success', 'Project successfully deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete project. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  }
  
  const renderActionButtons = () => {
    if (isLoading) {
      return (
        <View className="flex-row justify-center">
          <ActivityIndicator color="#4F46E5" />
        </View>
      );
    }

    switch (filterType) {
      case 'userCreatedProjects':
        return (
          <View className="flex-row justify-between">
            <TouchableOpacity 
              className="bg-indigo-600 px-6 py-3 rounded-xl flex-row items-center flex-1 mr-3" 
              onPress={() => onPress(item)}
            >
              <Ionicons name="settings-outline" size={18} color="white" />
              <Text className="text-white font-bold ml-2">Manage</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-red-100 px-6 py-3 rounded-xl flex-row items-center"
              onPress={() => handleDeleteProject(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
              <Text className="text-red-600 font-bold ml-2">Delete</Text>
            </TouchableOpacity>
          </View>
        );

      case 'userProjects':
        return (
          <View className="flex-row justify-between">
            <TouchableOpacity 
              className="bg-indigo-600 px-6 py-3 rounded-xl flex-row items-center" 
              onPress={() => onPress(item)}
            >
              <Ionicons name="eye-outline" size={18} color="white" />
              <Text className="text-white font-bold ml-2">View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-red-100 px-6 py-3 rounded-xl flex-row items-center"
              onPress={() => handleLeaveProject(item.id)}
            >
              <Ionicons name="exit-outline" size={18} color="#DC2626" />
              <Text className="text-red-600 font-bold ml-2">Leave</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'nonMemberProjects':
        return (
          <View className="flex-row justify-between">
            <TouchableOpacity 
              className="bg-indigo-600 px-6 py-3 rounded-xl flex-row items-center flex-1 mr-3"
              onPress={() => handleJoinProject(item.id)}
            >
              <Ionicons name="enter-outline" size={18} color="white" />
              <Text className="text-white font-bold ml-2">Join Project</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-gray-100 px-6 py-3 rounded-xl flex-row items-center"
              onPress={() => onPress(item)}
            >
              <Ionicons name="information-circle-outline" size={18} color="#4B5563" />
              <Text className="text-gray-700 font-bold ml-2">Info</Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        return (
          <View className="flex-row justify-between">
            <TouchableOpacity 
              className="bg-indigo-600 px-6 py-3 rounded-xl flex-row items-center flex-1 mr-3"
              onPress={() => onPress(item)}
            >
              <Ionicons name="eye-outline" size={18} color="white" />
              <Text className="text-white font-bold ml-2">View Details</Text>
            </TouchableOpacity>
            {isCreator ? (
              <TouchableOpacity 
                className="bg-red-100 px-6 py-3 rounded-xl flex-row items-center"
                onPress={() => handleDeleteProject(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
                <Text className="text-red-600 font-bold ml-2">Delete</Text>
              </TouchableOpacity>
            ) : !item.members?.some(member => member.userId === userId) ? (
              <TouchableOpacity 
                className="bg-gray-100 px-6 py-3 rounded-xl flex-row items-center"
                onPress={() => handleJoinProject(item.id)}
              >
                <Ionicons name="enter-outline" size={18} color="#4B5563" />
                <Text className="text-gray-700 font-bold ml-2">Join</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                className="bg-gray-100 px-6 py-3 rounded-xl flex-row items-center"
                onPress={() => handleLeaveProject(item.id)}
              >
                <Ionicons name="exit-outline" size={18} color="#4B5563" />
                <Text className="text-gray-700 font-bold ml-2">Leave</Text>
              </TouchableOpacity>
            )}
          </View>
        );
    }
  };

  return (
    <TouchableOpacity 
      onPress={() => onPress(item)}
      className="bg-white rounded-2xl mb-4 overflow-hidden shadow-lg"
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={
          filterType === 'userCreatedProjects' ? ['#7C3AED', '#A78BFA'] :
          filterType === 'userProjects' ? ['#4F46E5', '#818CF8'] : 
          filterType === 'nonMemberProjects' ? ['#6366F1', '#A5B4FC'] : 
          ['#4F46E5', '#818CF8']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="px-4 py-2"
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-bold text-lg">{item.projectName}</Text>
          <View className="flex-row items-center">
            {isCreator && (
              <View className="bg-white/20 px-2 py-1 rounded-full mr-2">
                <Text className="text-white text-xs">Creator</Text>
              </View>
            )}
            {filterType === 'userProjects' && (
              <View className="bg-white/20 px-2 py-1 rounded-full">
                <Text className="text-white text-xs">Member</Text>
              </View>
            )}
          </View>
        </View>
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
          <View className={`px-3 py-1 rounded-full ${
            item.status === 'active' ? 'bg-green-100' : 
            item.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
          }`}>
            <Text className={`font-medium ${
              item.status === 'active' ? 'text-green-600' : 
              item.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              {item.status}
            </Text>
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

        {renderActionButtons()}
      </View>
    </TouchableOpacity>
  );
};

const FilterButton = ({ title, active, onPress, icon }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center px-4 py-2 rounded-full mr-3 ${
      active ? 'bg-indigo-600' : 'bg-gray-200'
    }`}
  >
    <Ionicons name={icon} size={16} color={active ? 'white' : '#4B5563'} />
    <Text className={`ml-2 font-medium ${active ? 'text-white' : 'text-gray-700'}`}>
      {title}
    </Text>
  </TouchableOpacity>
);

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
    router.push({
      pathname: '/project-details',
      params: { itemno: item.id }
    });
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
        <Text className="text-2xl font-bold text-white text-center mb-4">
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
              onPress={handleCardPress}
              communityId={communityId}
              userId={user?.id}
              filterType={activeFilter}
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