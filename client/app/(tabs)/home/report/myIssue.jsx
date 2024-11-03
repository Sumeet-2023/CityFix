import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, Pressable, RefreshControl, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { serverurl } from '../../../../firebaseConfig';
import useStore from '../../../store';

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

const IssueCard = ({ issue, onViewProposals, onEdit, onDelete }) => {
  const isResolved = issue.status === 'RESOLVED' || issue.status === 'CLOSED';
  const statusColors = {
    'OPEN': '#eab308',
    'IN_PROGRESS': '#3b82f6',
    'RESOLVED': '#22c55e',
    'CLOSED': '#64748b'
  };

  return (
    <View className="bg-white mx-4 my-2 rounded-xl shadow-md overflow-hidden">
      {/* Header Section */}
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center space-x-2">
            <Text className="font-bold text-gray-600">#{issue.issueNumber}</Text>
            <View className="px-2 py-1 bg-gray-100 rounded-full">
              <Text className="text-sm text-gray-600">{issue.issueTag}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="fiber-manual-record" size={12} color={statusColors[issue.status]} />
            <Text className="ml-1 text-sm font-medium" style={{ color: statusColors[issue.status] }}>
              {issue.status}
            </Text>
          </View>
        </View>
        
        <Text className="text-xl font-bold text-gray-800 mb-2">{issue.issueName}</Text>
        <Text className="text-gray-600 leading-6">{issue.issueDescription}</Text>
      </View>

      {/* Location Section */}
      <View className="px-4 py-3 bg-gray-50">
        <View className="flex-row items-center space-x-2">
          <MaterialIcons name="location-on" size={18} color="#4b5563" />
          <View>
            <Text className="text-sm text-gray-800">
              {issue.location?.city}, {issue.location?.state}
            </Text>
            <Text className="text-xs text-gray-500">
              {formatCoordinates(issue.location?.coordinates)}
            </Text>
          </View>
        </View>
      </View>

      {/* Reporter Info */}
      <View className="px-4 py-3 border-t border-gray-100">
        <View className="flex-row items-center space-x-2">
          <MaterialIcons name="person" size={18} color="#4b5563" />
          <View>
            <Text className="text-sm font-medium text-gray-800">
              {issue.user?.firstname} {issue.user?.lastname}
            </Text>
            <Text className="text-xs text-gray-500">@{issue.user?.username}</Text>
          </View>
        </View>
      </View>

      {/* Dates Section */}
      <View className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <View className="space-y-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialIcons name="event" size={16} color="#4b5563" />
              <Text className="ml-2 text-sm text-gray-600">Reported:</Text>
            </View>
            <Text className="text-sm text-gray-800">{formatDate(issue.reportedDate)}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialIcons name="update" size={16} color="#4b5563" />
              <Text className="ml-2 text-sm text-gray-600">Last Updated:</Text>
            </View>
            <Text className="text-sm text-gray-800">{formatDate(issue.lastUpdated)}</Text>
          </View>
        </View>
      </View>

      {/* Resolution Section - Only shown for resolved issues */}
      {issue.resolution && (
        <View className="px-4 py-3 bg-green-50 border-t border-gray-100">
          <Text className="font-medium text-green-800 mb-2">Resolution Details</Text>
          <View className="space-y-2">
            <View className="flex-row items-start">
              <MaterialIcons name="check-circle" size={16} color="#15803d" />
              <Text className="ml-2 text-sm text-green-700 flex-1">
                {issue.resolution.description}
              </Text>
            </View>
            <Text className="text-xs text-green-600">
              Resolved on {formatDate(issue.resolution.dateAccepted)}
            </Text>
          </View>
        </View>
      )}

      {/* Actions Section */}
      <View className="p-4 border-t border-gray-100">
        <View className="flex-col space-y-2">
          {/* Proposals Button */}
          <TouchableOpacity 
            onPress={() => onViewProposals(issue.id)}
            className="bg-gray-100 rounded-lg overflow-hidden"
          >
            <View className="px-4 py-3 flex-row items-center justify-center">
              <MaterialIcons name="description" size={18} color="#4b5563" />
              <Text className="ml-2 font-medium text-gray-700">
                View Proposals ({issue._count?.proposals || 0})
              </Text>
            </View>
          </TouchableOpacity>

          {/* Edit and Delete Buttons */}
          {!isResolved && (
            <View className="flex-row space-x-2">
              <TouchableOpacity 
                onPress={() => onEdit(issue.id)}
                className="flex-1 bg-blue-500 rounded-lg overflow-hidden"
              >
                <View className="px-4 py-3 flex-row items-center justify-center">
                  <MaterialIcons name="edit" size={18} color="white" />
                  <Text className="ml-2 font-medium text-white">Edit</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => onDelete(issue.id)}
                className="flex-1 bg-red-500 rounded-lg overflow-hidden"
              >
                <View className="px-4 py-3 flex-row items-center justify-center">
                  <MaterialIcons name="delete" size={18} color="white" />
                  <Text className="ml-2 font-medium text-white">Delete</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Photos Section - If there are any */}
      {issue.issuePhotos && issue.issuePhotos.length > 0 && (
        <View className="px-4 py-3 border-t border-gray-100">
          <View className="flex-row items-center space-x-2">
            <MaterialIcons name="photo-library" size={18} color="#4b5563" />
            <Text className="text-sm text-gray-600">
              {issue.issuePhotos.length} photo{issue.issuePhotos.length !== 1 ? 's' : ''} attached
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const MyIssue = () => {
  const params = useLocalSearchParams();
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing
  const [error, setError] = useState(null);
  const [update, setUpdate] = useState(params.update === 'true' || false);
  const { userdata } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProposals, setSelectedProposals] = useState([]);
  const [proposalUser, setProposalUser] = useState(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setRefreshing(true); // Set refreshing to true when starting fetch
      const response = await axios.get(`${serverurl}/issues/user/${userdata.id}`);
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
      setRefreshing(false); // Reset refreshing when done
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (params.update === 'true') {
        fetchIssues();
      }
    }, [params.update])
  );

  const handleViewProposals = async (issueId) => {
    try {
      // Fetch the proposals for the selected issue using the issue ID
      const response = await axios.get(`${serverurl}/issues/${issueId}/proposals`);
      const proposals = response.data;
      
      setSelectedProposals(proposals);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      Alert.alert('Error', 'Failed to fetch proposals for the issue');
    }
  };
  
  const handleAcceptProposal = async (proposal) => {
    try {
      const response = await axios.post(`${serverurl}/issues/proposals/accept/${proposal.id}`, {
        description: proposal.proposalDescription,
        resolverType: proposal.resolverType,
        userId: userdata.id,
      });
  
      if (response.status === 201) {
        Alert.alert("Success", "Issue has been resolved successfully");
        // Optionally, refetch issues to update the UI
        fetchIssues();
      }
    } catch (error) {
      console.error('Error accepting proposal:', error);
      Alert.alert('Error', 'Failed to accept the proposal');
    }
  };  
  
  const handleEdit = (id) => {
    console.log(`Edit issue with ID: ${id}`);
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

  // Proposals Modal Component
  const ProposalsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-white border-b border-gray-200">
          <View className="flex-row justify-between items-center px-4 py-4">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Proposals</Text>
              <Text className="text-sm text-gray-500 mt-1">
                {selectedProposals.length} {selectedProposals.length === 1 ? 'proposal' : 'proposals'} available
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              className="rounded-full p-2 bg-gray-100"
            >
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
  
        {/* Content */}
        <ScrollView className="flex-1 bg-gray-50">
          {selectedProposals.length > 0 ? (
            selectedProposals.map((proposal, index) => (
              <View key={index} className="bg-white mb-3 mx-4 rounded-xl shadow-sm">
                <View className="p-4">
                  {/* Proposer Info */}
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center">
                      <MaterialIcons name="person" size={20} color="#3b82f6" />
                    </View>
                    <View className="ml-3">
                      <Text className="font-semibold text-gray-800">
                        {proposal.user?.username || 'Anonymous'}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        Proposed on: {formatDate(proposal.proposedDate)}
                      </Text>
                    </View>
                  </View>
  
                  {/* Proposal Content */}
                  <View className="bg-gray-50 p-4 rounded-lg">
                    <View className="flex-row items-start">
                      <MaterialIcons name="description" size={18} color="#6b7280" className="mt-1" />
                      <Text className="text-gray-600 ml-2 flex-1 leading-6">
                        {proposal.proposalDescription}
                      </Text>
                    </View>
                  </View>

                  {/* Display Proposal Images if Available */}
                  {proposal.images && proposal.images.length > 0 && (
                    <View className="mt-3">
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {proposal.images.map((image, i) => (
                          <Image
                            key={i}
                            source={{ uri: image }}
                            style={{ width: 100, height: 100, marginRight: 10 }}
                            className="rounded-lg"
                          />
                        ))}
                      </ScrollView>
                    </View>
                  )}
  
                  {/* Additional Info or Tags if needed */}
                  <View className="flex-row mt-3 space-x-2">
                    <View className="bg-blue-50 px-3 py-1 rounded-full">
                      <Text className="text-blue-600 text-xs">Proposal #{index + 1}</Text>
                    </View>
                    <View className="bg-green-50 px-3 py-1 rounded-full">
                      <Text className="text-green-600 text-xs">
                        {proposal.status || 'Pending'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between mt-4">
                    <TouchableOpacity
                      className="flex-1 bg-green-500 rounded-lg mr-2 overflow-hidden"
                      onPress={() => handleAcceptProposal(proposal)}
                    >
                      <View className="px-4 py-3 flex-row items-center justify-center">
                        <MaterialIcons name="check-circle" size={18} color="white" />
                        <Text className="ml-2 font-medium text-white">Accept</Text>
                      </View>
                    </TouchableOpacity>
  
                    <TouchableOpacity
                      className="flex-1 bg-red-500 rounded-lg ml-2 overflow-hidden"
                      onPress={() => {
                        // Placeholder action for deny button
                        Alert.alert("Proposal Denied", "You have denied this proposal.");
                      }}
                    >
                      <View className="px-4 py-3 flex-row items-center justify-center">
                        <MaterialIcons name="cancel" size={18} color="white" />
                        <Text className="ml-2 font-medium text-white">Deny</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <View className="bg-gray-100 rounded-full p-4 mb-4">
                <MaterialIcons name="inbox" size={32} color="#9ca3af" />
              </View>
              <Text className="text-gray-500 text-lg font-medium">No proposals yet</Text>
              <Text className="text-gray-400 text-sm mt-1 text-center px-4">
                When someone proposes a solution, it will appear here
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

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
    <ScrollView 
      className="flex-1 bg-gray-100" 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchIssues} />
      }
    >
      <ProposalsModal />
      {myIssues && myIssues.length > 0 ? (
        myIssues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onViewProposals={() => handleViewProposals(issue.id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <View className="flex-1 justify-center items-center py-20">
          <MaterialIcons name="inbox" size={48} color="#9ca3af" />
          <Text className="text-gray-500 text-lg mt-4">No issues reported yet</Text>
        </View>
      )}
    </ScrollView>
  );  
};

export default MyIssue;