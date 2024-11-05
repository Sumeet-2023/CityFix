import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { router } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../app/store';

const CommunityCard = ({ community }) => {
    const {setCommunityId} = useAuthStore();
    // Format location string from the location object
    const locationString = community.location ? 
      `${community.location.city}, ${community.location.country}` : 
      'Location not available';

    const onCardPress = () => {
      router.push('/home/community/projectpages/feeds');
      setCommunityId(community.id);
    }

    return (
      <TouchableOpacity
        className="bg-white rounded-xl mb-4 shadow-sm overflow-hidden"
        onPress={onCardPress}
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

export default CommunityCard;