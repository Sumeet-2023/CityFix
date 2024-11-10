import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl, Modal, Image, Alert, Share } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore, useFeedsStore, useMyIssuesStore } from '../../../store';
import axios from 'axios';
import { serverurl } from '../../../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

const Feeds = () => {
  const { user } = useAuthStore();
  const { feeds, isLoading, fetchFeeds } = useFeedsStore();
  const [searchIssue, setSearchIssue] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposalImage, setProposalImage] = useState(null);

  useEffect(() => {
    fetchFeeds();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchFeeds();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleSearchIssue = (reports) => {
    setSearchIssue(reports);
    if (reports.trim() === '') {
      setFilteredReports(feeds);
    } else {
      const filtered = feeds.filter((issue) => 
        issue.id.toString().toLowerCase().includes(reports.toLowerCase()) ||
        issue.issueName.toLowerCase().includes(reports.toLowerCase())
      );
      setFilteredReports(filtered);
    }
  };

  const handleCardPress = (issueId) => {
    router.push(`/issue/${issueId}`);
  };

  const handleSolvePress = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setProposalImage(result.assets[0].uri);
    }
  };

  const handleSubmitProposal = async () => {
    try {
      if (!proposalDescription) {
        Alert.alert("Error", "Please provide a description.");
        return;
      }
  
      // Prepare the proposal data to send to backend
      const proposalData = {
        proposalDescription,
        resolverType: "USER", // Assuming user for now
        userId: user.id,  // Use the logged-in user's ID
      };
  
      const response = await axios.post(`${serverurl}/issues/proposals/${selectedIssue.id}`, proposalData);
      if (response.status === 201) {
        console.log(response.data);
        Alert.alert("Success", "Proposal Submitted!");
        setShowModal(false);
        setProposalDescription('');
        const { user } = useAuthStore.getState();
        useFeedsStore.getState().fetchFeeds();
        useMyIssuesStore.getState().fetchMyIssues(user.id);
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      Alert.alert("Error", "Failed to submit the proposal");
    }
  };

  const handleShare = async (issue) => {
    try {
      const result = await Share.share({
        message: `Check out ${issue.username}'s profile on our platform!`,
      });
    } catch (error) {
      alert(error.message);
    }
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
      
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4F46E5"]} // Change this color to match your app's theme
            tintColor="#4F46E5"  // For iOS
          />
        }
      >
        <View className="flex-1 px-5 py-3">
          {feeds.length > 0 ? (
            feeds.map((issue) => (
              <View key={issue.id} className="bg-white p-4 rounded-xl mb-4 shadow-md">
                <TouchableOpacity onPress={() => handleCardPress(issue.id)}>
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
                  <View className="flex-row items-center mb-2">
                    <MaterialIcons name="update" size={16} color="#555" />
                    <Text className="ml-2 text-base text-gray-600">Last Updated: {new Date(issue.lastUpdated).toLocaleDateString()}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialIcons name="update" size={16} color="#555" />
                    <Text className="ml-2 text-base text-gray-600">Local Authority Involvement: {issue.authorityNeeds}</Text>
                  </View>
                </TouchableOpacity>
                {/* Share and Solve buttons */}
                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity
                    onPress={handleShare}
                    className="flex-1 bg-blue-500 rounded-lg py-3 mr-2 items-center"
                  >
                    <Text className="text-white font-bold">Share</Text>
                  </TouchableOpacity>
                  {issue.authorityNeeds === 'Not needed' && ( 
                    <TouchableOpacity
                      onPress={() => handleSolvePress(issue)}
                      className="flex-1 bg-green-500 rounded-lg py-3 ml-2 items-center"
                    >
                      <Text className="text-white font-bold">Solve</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-5">No report issues found with that name</Text>
          )}
        </View>
      </ScrollView>

      {/* Solve Issue Modal */}
      {selectedIssue && (
        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center bg-slate-400 bg-opacity-50">
            <View className="bg-white p-6 rounded-lg w-11/12">
              <Text className="text-lg font-bold mb-4">Propose a Solution for: {selectedIssue.issueName}</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Enter proposal description"
                value={proposalDescription}
                onChangeText={setProposalDescription}
                placeholderTextColor="#999" 
              />
              {proposalImage && (
                <Image source={{ uri: proposalImage }} className="w-full h-40 rounded-lg mb-4" />
              )}
              <TouchableOpacity
                onPress={handleImagePick}
                className="bg-blue-500 rounded-lg py-3 mb-4 items-center"
              >
                <Text className="text-white font-bold">Upload Image</Text>
              </TouchableOpacity>
              <View className="flex-row justify-end">
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  className="bg-gray-300 rounded-lg py-3 px-4 mr-2"
                >
                  <Text className="text-black font-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmitProposal}
                  className="bg-green-500 rounded-lg py-3 px-4"
                >
                  <Text className="text-white font-bold">Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Feeds;