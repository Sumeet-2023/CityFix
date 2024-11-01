import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
// import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { serverurl } from '../../../../firebaseConfig';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCoordinates = (coordinates) => {
  if (!coordinates || coordinates.length !== 2) return 'Location unavailable';
  return `${coordinates[1].toFixed(4)}°N, ${coordinates[0].toFixed(4)}°W`;
};

const MyIssue = () => {
  const params = useLocalSearchParams();
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [update, setUpdate] = useState(params.update === 'true' || false);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverurl}/issues`);
      setMyIssues(response.data);
      setError(null);
      setUpdate(false);
      params.update = false;
    } catch (error) {
      console.error("Error fetching issues:", error);
      setError("Failed to fetch issues");
      Alert.alert("Error", "Failed to fetch issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Effect to handle update prop changes
  useFocusEffect(
    React.useCallback(() => {
      if (params.update === 'true') {
        fetchIssues();
      }
    }, [params.update])
  );

  const handleEdit = (id) => {
    console.log(`Edit issue with ID: ${id}`);
    // Handle edit action
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Issue",
      "Are you sure you want to delete this issue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${serverurl}/issues/${id}`);
              Alert.alert("Success", "Issue deleted successfully");
              // Refresh the issues list after successful deletion
              fetchIssues();
            } catch (error) {
              console.error("Error deleting issue:", error);
              Alert.alert("Error", "Failed to delete issue");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
        <TouchableOpacity 
          onPress={fetchIssues}
          className="mt-4 bg-blue-500 px-4 py-2 rounded-md"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {myIssues && myIssues.length > 0 ? (
        myIssues.map((issue) => (
          <View key={issue.id} className="bg-white m-2 p-4 rounded-lg shadow">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <Text className="font-bold">#{issue.issueNumber}</Text>
                <Text className="ml-2 px-2 py-1 bg-gray-200 rounded">
                  {issue.issueTag}
                </Text>
              </View>
              <MaterialIcons 
                name="fiber-manual-record" 
                size={16} 
                color={issue.status === 'resolved' ? '#22c55e' : '#eab308'} 
              />
            </View>
            
            <Text className="text-lg font-semibold mb-2">{issue.issueName}</Text>
            
            <View className="space-y-2">
              <Text className="text-gray-600">{issue.issueDescription}</Text>
              
              <View className="bg-gray-50 p-2 rounded">
                <Text className="text-sm font-medium">Location:</Text>
                <Text className="text-sm text-gray-600">
                  {formatCoordinates(issue.location?.coordinates)}
                </Text>
              </View>

              <View className="flex-row justify-between text-sm text-gray-500">
                <Text>Reported: {formatDate(issue.reportedDate)}</Text>
                <Text>Updated: {formatDate(issue.lastUpdated)}</Text>
              </View>
            </View>

            {issue.issuePhoto && (
              <View className="mt-2 bg-gray-100 rounded-md p-2">
                <Text className="text-sm text-gray-500 mb-1">Photo attached</Text>
                {/* Add Image component here if needed */}
              </View>
            )}

            <View className="flex-row justify-end mt-4 space-x-2">
              <TouchableOpacity 
                onPress={() => handleEdit(issue.id)}
                className="bg-blue-500 px-4 py-2 rounded-md flex-row items-center"
              >
                <MaterialIcons name="edit" size={16} color="white" />
                <Text className="text-white ml-1">Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => handleDelete(issue.id)}
                className="bg-red-500 px-4 py-2 rounded-md flex-row items-center"
              >
                <MaterialIcons name="delete" size={16} color="white" />
                <Text className="text-white ml-1">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-500">No issues found</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default MyIssue;