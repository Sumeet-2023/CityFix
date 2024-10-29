import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity,TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';


const issuesData = [
   // Hardcoded issue data
  {
    id: 123,
    status: 'Open',
    title: 'Pothole on Main Street',
    reportedBy: 'Username',
    dateReported: 'October 5, 2024',
    location: 'Near City Hall',
    lastUpdated: 'October 10, 2024',
    details: 'There is a large pothole on Main Street causing issues for vehicles. Needs fixing urgently.'
  },
  {
    id: 124,
    status: 'Resolved',
    title: 'Overflowing Trash Bin',
    reportedBy: 'AnotherUser',
    dateReported: 'October 3, 2024',
    location: 'Park Area',
    lastUpdated: 'October 9, 2024',
    details: 'Trash bin in the park has been overflowing for several days. Issue was resolved by clearing the bin.'
  },
];


const Feeds = () => {
  const [searchIssue,setSearchIssue] = useState('');
  const [filteredReports, setFilteredReports] = useState(issuesData);
 
  const handleSearchIssue = (reports) => {
    setSearchIssue(reports);
    if(reports.trim() === ''){
      setFilteredReports(issuesData); 
    }else{
      const filtered = issuesData.filter((issue) => 
        issue.id.toString().toLowerCase().includes(reports.toLowerCase()) ||
        issue.title.toLowerCase().includes(reports.toLowerCase())
      );
     setFilteredReports(filtered);
    }
  }

  const handleCardPress = (issue) => {
    // Navigate to the Details screen with the issue details
    router.push({ pathname: '/issue-details', params: { issue: JSON.stringify(issue) } });
  };

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-center mb-5">Search Issues</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 mb-5"
        placeholder="Enter report issue id or name"
        value={searchIssue}
        onChangeText={handleSearchIssue}
        placeholderTextColor="#999"
      />
      
      <ScrollView>
        <View className="flex-1 px-5 py-3">
          {filteredReports.length > 0 ? (
            filteredReports.map((issue) => (
              <TouchableOpacity key={issue.id} onPress={() => handleCardPress(issue)}>
                <View className="bg-white p-4 rounded-xl mb-4 shadow-md">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-lg font-bold text-gray-800">#{issue.id}</Text>
                    <Text className="text-sm text-blue-500 uppercase">{issue.status}</Text>
                  </View>
                  <Text className="text-xl font-semibold text-black mb-3">{issue.title}</Text>
                  <View className="flex-row items-center mb-2">
                    <MaterialIcons name="person" size={16} color="#555" />
                    <Text className="ml-2 text-base text-gray-600">Reported by: {issue.reportedBy}</Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <MaterialIcons name="event" size={16} color="#555" />
                    <Text className="ml-2 text-base text-gray-600">Date Reported: {issue.dateReported}</Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <MaterialIcons name="location-on" size={16} color="#555" />
                    <Text className="ml-2 text-base text-gray-600">Location: {issue.location}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialIcons name="update" size={16} color="#555" />
                    <Text className="ml-2 text-base text-gray-600">Last Updated: {issue.lastUpdated}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-5">No report Issue were found with that name</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Feeds;