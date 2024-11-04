import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const ChatHeader = ({ channel }) => {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white">
      <View className={`${Platform.OS === 'android' ? `pt-[${StatusBar.currentHeight}px]` : ''}`}>
        <View className="h-16 flex-row items-center justify-between px-2 border-b border-gray-200 bg-white">
          {/* Left Section: Back Button and Channel Icon */}
          <View className="flex-row items-center flex-1">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="p-2"
            >
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </TouchableOpacity>
            
            {channel?.communityPhotos && channel.communityPhotos.length > 0 ? (
              <Image 
                source={{ uri: channel.communityPhotos[0] }}
                className="w-9 h-9 rounded-full ml-1"
              />
            ) : (
              <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center ml-1">
                <Text className="text-base font-semibold text-gray-600">
                  {channel?.communityName?.[0]?.toUpperCase() || '#'}
                </Text>
              </View>
            )}
          </View>

          {/* Center Section: Channel Info */}
          <View className="flex-3 mx-3">
            <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
              {channel?.communityName || 'Channel Name'}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
              {channel?.members?.length || 0} members • {channel?.location?.city || 'Location'}
            </Text>
          </View>

          {/* Right Section: Action Buttons */}
          <View className="flex-row items-center flex-1 justify-end">
            <TouchableOpacity className="p-2">
              <Ionicons name="call-outline" size={22} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <Ionicons name="videocam-outline" size={22} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <Ionicons name="ellipsis-vertical" size={22} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatHeader;