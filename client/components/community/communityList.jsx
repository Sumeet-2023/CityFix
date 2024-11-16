import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import CommunityCard from './communityCard';

const CommunityList = ({ userId, serverUrl }) => {  // Ensure userId is correctly passed as a prop
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
      keyExtractor={(item) => item.id.toString()}  // Ensure the ID is a string for the key
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