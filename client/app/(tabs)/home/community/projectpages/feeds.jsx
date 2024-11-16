import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../../../store';
import { serverurl } from '../../../../../firebaseConfig';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ProjectCard from '../../../../../components/project/ProjectCard';
import FilterButton from '../../../../../components/project/FilterButton';
import FAB from '../../../../../components/FAB';

export default function Feeds() {
  // const { communityId } = useLocalSearchParams();
  const [role, setRole] = useState(null);
  const { user, communityId, setProjectId } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchProjects = useCallback(async (filterType) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${serverurl}/project/byCommunityWithFilter/${communityId}?filterType=${filterType}&userId=${user?.id}`
      );
      const rel = await axios.get(
        `${serverurl}/community/role/${communityId}/${user?.id}`
      );
      setProjects(response.data);
      setRole(rel.data.role);
    } catch (error) {
      console.error('Error fetching projects:', error);
      Alert.alert('Error', 'Failed to fetch projects. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [communityId, user?.id]);

  useEffect(() => {
    fetchProjects(activeFilter);
  }, [communityId, activeFilter, fetchProjects]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    return projects.filter((project) =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const handleCardPress = useCallback((item) => {
    setProjectId(item.id);
    router.push(`/project-details`);
  }, []);

  const handleFABPress = () => {
    router.push(`/(modals)/createProject`);
  };

  const filterButtons = useMemo(
    () => [
      { id: 'all', title: 'All', icon: 'grid-outline' },
      { id: 'userCreatedProjects', title: 'Created', icon: 'create-outline' },
      { id: 'userProjects', title: 'Joined', icon: 'people-outline' },
      { id: 'nonMemberProjects', title: 'Available', icon: 'add-circle-outline' },
    ],
    []
  );

  const getEmptyStateMessage = useCallback(() => {
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
  }, [activeFilter]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <LinearGradient
        colors={['#4F46E5', '#818CF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 20, paddingTop: 40, paddingBottom: 16 }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 16 }}>
          Community Projects
        </Text>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginBottom: 16,
          }}
        >
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            style={{ flex: 1, marginLeft: 8, color: '#374151' }}
            placeholder="Search projects"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
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

      <View style={{ flex: 1, paddingHorizontal: 16 }}>
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
                refreshProjects={() => fetchProjects(activeFilter)}
                role={role}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 16 }}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="search" size={48} color="#D1D5DB" />
            <Text style={{ color: '#9CA3AF', fontSize: 18, marginTop: 16, textAlign: 'center' }}>
              {getEmptyStateMessage()}
            </Text>
          </View>
        )}
      <FAB handlePress={handleFABPress} />
      </View>
    </View>
  );
}
