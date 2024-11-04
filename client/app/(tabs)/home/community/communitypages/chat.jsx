import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { serverurl } from '../../../../../firebaseConfig';
import { useAuthStore } from '../../../../store';
import { router } from 'expo-router';

const CommunityNotFound = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Text style={{ fontSize: 16, color: '#000' }}>
          No communities joined or created yet
        </Text>
      </View>
    </SafeAreaView>
  )
}

const CommunityChannels = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Your');
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const categories = [
    'Your',
    'Explore',
    'Projects',
    'Support',
    'Events'
  ];

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${serverurl}/community/communityJoined/${user.id}`);
        setCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, [user.id]);

  const getDefaultIcon = (communityName) => {
    // Generate an icon based on first letter of community name
    return communityName.charAt(0).toUpperCase();
  };

  const filteredCommunities = Array.isArray(communities)
  ? communities.filter(community =>
      community.communityName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

  // if (communities[0]?.id === undefined) {
  //   console.log('Community Not Found');
  //   return <CommunityNotFound />;
  // }

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
            placeholder="Search communities"
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

        {/* Communities List */}
        {communities[0]?.id !== undefined ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#111827" style={{ marginTop: 20 }} />
            ) : (
              filteredCommunities.map((community) => (
                <TouchableOpacity
                  key={community.id}
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
                  onPress={() => router.push({
                    pathname: "/(modals)/chatRoom",
                    params: {
                      id: community.id
                    }
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {community.communityPhotos && community.communityPhotos.length > 0 ? (
                        <Image
                          source={{ uri: community.communityPhotos[0] }}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            marginRight: 12
                          }}
                        />
                      ) : (
                        <View style={{
                          backgroundColor: '#F3F4F6',
                          borderRadius: 8,
                          padding: 12,
                          marginRight: 12,
                          width: 40,
                          height: 40,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Text style={{ fontSize: 16, fontWeight: '600', color: '#4B5563' }}>
                            {getDefaultIcon(community.communityName)}
                          </Text>
                        </View>
                      )}
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                          {community.communityName}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                          <Text style={{ color: '#6B7280', fontSize: 12 }}>
                            Community #{community.communityNumber}
                          </Text>
                          <View style={{
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: '#D1D5DB',
                            marginHorizontal: 8
                          }} />
                          <Text style={{ color: '#6B7280', fontSize: 12 }}>
                            {community.location.city}, {community.location.country}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        ):(
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 16, color: '#6B7280' }}>
              No communities joined or created yet
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CommunityChannels;