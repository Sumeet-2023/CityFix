import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SolvedIssue = () => {
  // Hardcoded resolved issue data
  const solvedIssues = [
    {
      id: 123,
      status: 'Resolved',
      title: 'Pothole on Main Street',
      resolvedBy: 'Local Authority',
      resolvedOn: 'October 12, 2024',
      resolutionDetails: 'Repairs completed, pothole fixed.',
    },
    {
      id: 124,
      status: 'Closed',
      title: 'Overflowing Trash Bin',
      resolutionStatus: 'Issue doesn’t exist in that locale',
      lastUpdate: 'October 9, 2024',
    },
  ];

  return (
    <ScrollView>
      <View className="flex-1 px-5 py-3">
        {solvedIssues.map((issue, index) => (
          <View key={index} className="bg-white p-4 rounded-xl mb-4 shadow-md">
            <View className="flex-row justify-between mb-2">
              <Text className="text-lg font-bold text-gray-800">#{issue.id}</Text>
              <Text className="text-sm text-blue-500 uppercase">{issue.status}</Text>
            </View>
            <Text className="text-xl font-semibold text-black mb-3">{issue.title}</Text>
            
            {/* Resolved By */}
            {issue.resolvedBy && (
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="verified-user" size={16} color="#555" />
                <Text className="ml-2 text-base text-gray-600">Resolved by: {issue.resolvedBy}</Text>
              </View>
            )}

            {/* Resolved On */}
            {issue.resolvedOn && (
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="event-available" size={16} color="#555" />
                <Text className="ml-2 text-base text-gray-600">Resolved on: {issue.resolvedOn}</Text>
              </View>
            )}

            {/* Resolution Details */}
            {issue.resolutionDetails && (
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="description" size={16} color="#555" />
                <Text className="ml-2 text-base text-gray-600">Resolution: {issue.resolutionDetails}</Text>
              </View>
            )}

            {/* Last Update (for closed issue) */}
            {issue.lastUpdate && (
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="update" size={16} color="#555" />
                <Text className="ml-2 text-base text-gray-600">Last Update: {issue.lastUpdate}</Text>
              </View>
            )}

            {/* Resolution Status (for closed issue) */}
            {issue.resolutionStatus && (
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="info" size={16} color="#555" />
                <Text className="ml-2 text-base text-gray-600">Status: {issue.resolutionStatus}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default SolvedIssue;
