import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { serverurl } from '../../../../../firebaseConfig';
// import useStore from '../../../../store';
import { useAuthStore } from '../../../../store';

const CommunityChannels = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Your');
  const [communities, setCommunities] = useState(null);
  const {user} = useAuthStore();

  // Sample categories
  const categories = [
    'Your',
    'Explore',
    'Projects',
    'Support',
    'Events'
  ];

  // Sample channels data
  const channels = [
    {
      id: '1',
      name: 'Road Repairs',
      category: 'Issues',
      members: 156,
      lastActive: '2m ago',
      priority: 'high',
      icon: 'construct'
    },
    {
      id: '2',
      name: 'Community Garden',
      category: 'Projects',
      members: 89,
      lastActive: '5m ago',
      priority: 'medium',
      icon: 'leaf'
    },
    {
      id: '3',
      name: 'Mental Health Support',
      category: 'Support',
      members: 234,
      lastActive: 'Just now',
      priority: 'high',
      icon: 'people'
    },
    {
      id: '4',
      name: 'Street Cleaning',
      category: 'Issues',
      members: 67,
      lastActive: '1h ago',
      priority: 'medium',
      icon: 'brush'
    }
  ];

  const getIconName = (iconName) => {
    switch (iconName) {
      case 'construct':
        return 'construct-outline';
      case 'leaf':
        return 'leaf-outline';
      case 'people':
        return 'people-outline';
      case 'brush':
        return 'brush-outline';
      default:
        return 'alert-circle-outline';
    }
  };

  useEffect(() => {
    const fetchList = async () => {
      const list = await axios.get(`${serverurl}/community/communityList/${userData.id}`);
      setCommunities(list);
    }

    fetchList();
  }, [])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      default:
        return '#10B981';
    }
  };

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Your' || channel.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ padding: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>
            Community Channels
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
            Join channels to help and connect with your community
          </Text>
        </View>

        {/* Search Bar */}
        <View style={{ 
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2
        }}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search channels"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ marginLeft: 8, flex: 1, fontSize: 16 }}
          />
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setActiveCategory(category)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: activeCategory === category ? '#111827' : '#E5E7EB',
                marginRight: 8
              }}
            >
              <Text style={{
                color: activeCategory === category ? 'white' : '#4B5563',
                fontWeight: '500'
              }}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Channels List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredChannels.map((channel) => (
            <TouchableOpacity
              key={channel.id}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    backgroundColor: '#F3F4F6',
                    borderRadius: 8,
                    padding: 8,
                    marginRight: 12
                  }}>
                    <Ionicons name={getIconName(channel.icon)} size={24} color="#4B5563" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                      {channel.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <Ionicons name="people-outline" size={14} color="#6B7280" />
                      <Text style={{ marginLeft: 4, color: '#6B7280', fontSize: 12 }}>
                        {channel.members} members
                      </Text>
                      <View style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: '#D1D5DB',
                        marginHorizontal: 8
                      }} />
                      <Text style={{ color: '#6B7280', fontSize: 12 }}>
                        {channel.lastActive}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: getPriorityColor(channel.priority)
                }} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CommunityChannels;