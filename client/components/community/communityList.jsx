import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { router } from "expo-router";
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CommunityList = ({ userId, serverUrl }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/community/communityJoined/${userId}`);
      setCommunities(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, [userId, serverUrl]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCommunities();
    setRefreshing(false);
  };

  const CommunityCard = ({ community }) => {
    // Format location string from the location object
    const locationString = community.location ? 
      `${community.location.city}, ${community.location.country}` : 
      'Location not available';

    return (
      <TouchableOpacity
        className="bg-white rounded-xl mb-4 shadow-sm overflow-hidden"
        onPress={() => router.push("/home/community/projectpages/feeds")}
        activeOpacity={0.7}
      >
        <View className="relative">
          <Image
            source={{
              uri: community.communityPhotos?.[0] || 'https://via.placeholder.com/400x200'
            }}
            className="w-full h-40 rounded-t-xl"
          />
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-black/30 px-4 pb-3 justify-end">
            <Text className="text-white text-xl font-bold">{community.communityName}</Text>
          </View>
        </View>
        
        <View className="p-4">
          <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
            {community.description}
          </Text>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text className="text-gray-500 text-xs ml-1">{locationString}</Text>
          </View>
          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons name="account-group" size={16} color="#666" />
            <Text className="text-gray-500 text-xs ml-1">
              {community.members?.length || 0} members
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <MaterialCommunityIcons name="alert-circle" size={48} color="#FF6B6B" />
        <Text className="text-gray-600 text-base mt-3 text-center">{error}</Text>
        <TouchableOpacity
          className="mt-4 px-6 py-3 bg-blue-600 rounded-lg"
          onPress={fetchCommunities}
        >
          <Text className="text-white text-base font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (communities.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <MaterialCommunityIcons name="account-group" size={48} color="#666" />
        <Text className="text-gray-600 text-lg font-semibold mt-3">
          No communities joined yet
        </Text>
        <Text className="text-gray-500 text-sm mt-2">
          Join some communities to get started!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={communities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CommunityCard community={item} />}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#0066CC"]}
        />
      }
    />
  );
};

export default CommunityList;