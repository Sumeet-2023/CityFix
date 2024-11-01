import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useStore from '../../../store';
import axios from 'axios';
import { serverurl } from '../../../../firebaseConfig';

const Feeds = () => {
  const { userdata } = useStore();
  const [searchIssue, setSearchIssue] = useState('');
  const [issuesData, setIssuesData] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(`${serverurl}/issues`);
      setIssuesData(response.data); // Store the fetched issues data
      setFilteredReports(response.data); // Initialize filtered reports with fetched data
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  useEffect(() => {
    fetchIssues()
  }, []);

  const handleSearchIssue = (reports) => {
    setSearchIssue(reports);
    if (reports.trim() === '') {
      setFilteredReports(issuesData); // Reset to all issues if search input is empty
    } else {
      const filtered = issuesData.filter((issue) => 
        issue.id.toString().toLowerCase().includes(reports.toLowerCase()) ||
        issue.issueName.toLowerCase().includes(reports.toLowerCase())
      );
      setFilteredReports(filtered);
    }
  };

  const handleCardPress = (issueId) => {
    router.push(`/issue/${issueId}`);
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
              <TouchableOpacity key={issue.id} onPress={() => handleCardPress(issue.id)}>
                <View className="bg-white p-4 rounded-xl mb-4 shadow-md">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-lg font-bold text-gray-800">#{issue.issueNumber}</Text>
                    <Text className="text-sm text-blue-500 uppercase">{issue.status}</Text>
                  </View>
                  <Text className="text-xl font-semibold text-black mb-3">{issue.issueName}</Text>
                  <View className="flex-row items-center mb-2">
                    <MaterialIcons name="person" size={16} color="#555" />
                    <Text className="ml-2 text-base text-gray-600">Reported by: {issue.user.username}</Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <MaterialIcons name="event" size={16} color="#555" />
                    <Text className="ml-2 text-base text-gray-600">Date Reported: {new Date(issue.reportedDate).toLocaleDateString()}</Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <MaterialIcons name="location-on" size={16} color="#555" />
                    <Text className="ml-2 text-base text-gray-600">Location: {issue.location.city}, {issue.location.state}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialIcons name="update" size={16} color="#555" />
                    <Text className="ml-2 text-base text-gray-600">Last Updated: {new Date(issue.lastUpdated).toLocaleDateString()}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-5">No report issues found with that name</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Feeds;
