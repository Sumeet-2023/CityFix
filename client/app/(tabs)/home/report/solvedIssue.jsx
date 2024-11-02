import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { serverurl } from '../../../../firebaseConfig';

const SolvedIssue = () => {
  const [solvedIssues, setSolvedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for managing refresh control

  // Custom date formatter
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${month} ${day}, ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Fetch solved issues from the server
  const fetchSolvedIssues = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await fetch(`${serverurl}/issues/filter/condition?status=CLOSED&status=RESOLVED`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSolvedIssues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing after fetching
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSolvedIssues();
  }, []);

  // Handle refresh action
  const onRefresh = () => {
    setRefreshing(true);
    fetchSolvedIssues();
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'RESOLVED':
        return '#10B981';
      case 'CLOSED':
        return '#6366F1';
      default:
        return '#6B7280';
    }
  };

  const renderResolutionDetails = (issue) => {
    const resolution = issue.resolution;
    if (!resolution) return null;

    return (
      <View className="mt-3 bg-gray-50 p-3 rounded-lg">
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="check-circle" size={16} color="#059669" />
          <Text className="ml-2 font-semibold text-emerald-700">Resolution Details</Text>
        </View>

        <View className="space-y-2">
          {/* Resolver Information */}
          <View className="flex-row items-center">
            <MaterialIcons name="person" size={16} color="#6B7280" />
            <Text className="ml-2 text-gray-600">
              Resolved by: {resolution.user?.firstname} {resolution.user?.lastname}
              {resolution.resolverType === 'COMMUNITY' && ' (Community)'}
            </Text>
          </View>

          {/* Resolution Date */}
          <View className="flex-row items-center">
            <MaterialIcons name="event" size={16} color="#6B7280" />
            <Text className="ml-2 text-gray-600">
              Resolved on: {formatDate(resolution.dateAccepted)}
            </Text>
          </View>

          {/* Resolution Description */}
          <View className="flex-row items-start">
            <MaterialIcons name="description" size={16} color="#6B7280" style={{ marginTop: 3 }} />
            <Text className="ml-2 text-gray-600 flex-1">
              {resolution.description}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderIssueCard = (issue) => (
    <View key={issue.id} className="bg-white p-4 rounded-xl mb-4 shadow-lg">
      {/* Header Section */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-gray-800">#{issue.issueNumber}</Text>
          <View className="ml-2 px-3 py-1 rounded-full" style={{ backgroundColor: getStatusColor(issue.status) + '20' }}>
            <Text style={{ color: getStatusColor(issue.status) }} className="font-semibold">
              {issue.status}
            </Text>
          </View>
        </View>
        <Text className="text-sm text-gray-500">{formatDate(issue.reportedDate)}</Text>
      </View>

      {/* Issue Details */}
      <View className="mb-3">
        <Text className="text-xl font-semibold text-gray-900 mb-2">{issue.issueName}</Text>
        <Text className="text-gray-600">{issue.issueDescription}</Text>
      </View>

      {/* Location Info */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="location-sharp" size={16} color="#6B7280" />
        <Text className="ml-2 text-gray-600">
          {issue.location.city}, {issue.location.state}
        </Text>
      </View>

      {/* Issue Tag */}
      <View className="flex-row items-center mb-3">
        <MaterialIcons name="label" size={16} color="#6B7280" />
        <Text className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-gray-600">
          {issue.issueTag}
        </Text>
      </View>

      {/* Photos Grid (if any) */}
      {issue.issuePhotos && issue.issuePhotos.length > 0 && (
        <View className="flex-row flex-wrap mb-3">
          {issue.issuePhotos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              className="w-24 h-24 rounded-lg mr-2 mb-2"
            />
          ))}
        </View>
      )}

      {/* Reporter Info */}
      <TouchableOpacity className="flex-row items-center mb-3">
        <MaterialIcons name="person" size={16} color="#6B7280" />
        <Text className="ml-2 text-gray-600">
          Reported by: {issue.user.firstname} {issue.user.lastname}
        </Text>
      </TouchableOpacity>

      {/* Resolution Details Section */}
      {renderResolutionDetails(issue)}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text className="text-red-500 text-lg mt-2">{error}</Text>
        <TouchableOpacity 
          className="mt-4 bg-indigo-500 px-4 py-2 rounded-lg"
          onPress={fetchSolvedIssues} // Directly call the fetch function to retry
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 py-3">
        {solvedIssues.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <MaterialIcons name="done-all" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-2">No resolved issues yet</Text>
          </View>
        ) : (
          solvedIssues.map(renderIssueCard)
        )}
      </View>
    </ScrollView>
  );
};

export default SolvedIssue;
