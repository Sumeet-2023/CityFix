import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MyIssue = () => {
  // Hardcoded issue data
  const myIssues = [
    {
      id: 69,
      status: 'Open',
      title: 'Pothole on Main Street',
      dateReported: 'October 5, 2024',
      location: 'Near City Hall',
      lastUpdated: 'October 10, 2024',
    },
    {
      id: 96,
      status: 'Resolved',
      title: 'Overflowing Trash Bin',
      dateReported: 'October 3, 2024',
      location: 'Park Area',
      lastUpdated: 'October 9, 2024',
    },
  ];

  const handleEdit = (id) => {
    console.log(`Edit issue with ID: ${id}`);
    // Handle edit action, perhaps navigating to an edit screen
  };

  const handleDelete = (id) => {
    console.log(`Delete issue with ID: ${id}`);
    // Handle delete action, showing a confirmation dialog maybe
    alert(`Issue ${id} deleted successfully`);
  };

  return (
    <ScrollView>
      <View className="flex-1 px-5 py-3">
        {myIssues.map((issue, index) => (
          <View key={index} className="bg-white p-4 rounded-xl mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-lg font-bold text-gray-800">#{issue.id}</Text>
              <Text className="text-sm text-blue-500 uppercase">{issue.status}</Text>
            </View>
            <Text className="text-xl font-semibold text-black mb-3">{issue.title}</Text>
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="event" size={16} color="#555" />
              <Text className="ml-2 text-base text-gray-600">Date Reported: {issue.dateReported}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="location-on" size={16} color="#555" />
              <Text className="ml-2 text-base text-gray-600">Location: {issue.location}</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="update" size={16} color="#555" />
              <Text className="ml-2 text-base text-gray-600">Last Updated: {issue.lastUpdated}</Text>
            </View>

            {/* Action Buttons for Edit and Delete */}
            <View className="flex-row justify-between mt-3">
              <TouchableOpacity
                className="flex-row items-center bg-blue-500 py-2 px-4 rounded"
                onPress={() => handleEdit(issue.id)}
              >
                <MaterialIcons name="edit" size={20} color="white" />
                <Text className="text-white ml-2">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center bg-red-500 py-2 px-4 rounded"
                onPress={() => handleDelete(issue.id)}
              >
                <MaterialIcons name="delete" size={20} color="white" />
                <Text className="text-white ml-2">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default MyIssue;
