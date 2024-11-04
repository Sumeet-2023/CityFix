import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";

const Badge = ({ name, icon, reason }) => (
  <View className="flex-row items-center mb-2 p-2 bg-blue-100 rounded-xl shadow-sm">
    <FontAwesome5 name={icon} size={20} color="#3B82F6" />
    <Text className="text-primary font-bold ml-2">{name}</Text>
    <Text className="text-sm text-gray-500 ml-2 italic"> - {reason}</Text>
  </View>
);

export default Badge;