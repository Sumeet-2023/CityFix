import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const CreateCommunityHeader = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white">
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View className="flex-1 items-center mx-4">
          <Text className="text-lg font-semibold text-gray-900">
            Start Your Community
          </Text>
        </View>

        <View className="w-10" />
      </View>
    </SafeAreaView>
  );
};

export default CreateCommunityHeader;