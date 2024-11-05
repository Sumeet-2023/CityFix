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
import { Ionicons } from '@expo/vector-icons';

const CreateProjectHeader = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="bg-white">
      <StatusBar barStyle={'dark-content'} />
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={handleBackPress}
          className="p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View className="flex-1 items-center mx-4">
          <Text className="text-lg font-semibold text-gray-900">
            Create New Project
          </Text>
        </View>

        {/* Placeholder view to maintain layout balance */}
        <View style={{ width: 24 }} />
      </View>
    </SafeAreaView>
  );
};

export default CreateProjectHeader;