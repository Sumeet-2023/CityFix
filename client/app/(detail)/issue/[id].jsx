import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import axios from "axios";
import { serverurl } from "../../../firebaseConfig";
// import useStore from "../../store";
import { useAuthStore } from "../../store";

const IssueDetails = () => {
  const { id } = useLocalSearchParams();
  const [issueDetails, setIssueDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [rotateAnim] = useState(new Animated.Value(0));
  const { user } = useAuthStore();
  useEffect(() => {
    fetchIssueDetails();
    
  }, [id]);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: showComments ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showComments]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const fetchIssueDetails = async () => {
    try {
      const response = await axios.get(`${serverurl}/issues/${id}`);
      setIssueDetails(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load issue details");
      console.error("Error fetching issue details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await axios.post(`${serverurl}/issues/${id}/comments`, {
        content: newComment,
        userId: user.id, // Pass the userId if you want to associate the comment with a user
      });

      console.log("Comment posted successfully:", response.data);
      setNewComment(""); // Clear the input after posting
      Alert.alert("Comment posted successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to post comment"
      );
    }
  };

  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status?.toLowerCase()) {
        case "open":
          return { bg: "#EEF2FF", text: "#4F46E5" };
        case "in progress":
          return { bg: "#FEF3C7", text: "#D97706" };
        case "resolved":
          return { bg: "#D1FAE5", text: "#059669" };
        default:
          return { bg: "#F3F4F6", text: "#4B5563" };
      }
    };
    const colors = getStatusColor();
    return (
      <View
        style={{ backgroundColor: colors.bg }}
        className="px-4 py-1 rounded-full"
      >
        <Text style={{ color: colors.text }} className="font-medium text-sm">
          {status || "Unknown"}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-gray-50">
        <Feather name="alert-circle" size={48} color="#EF4444" />
        <Text className="text-red-500 text-lg text-center mt-4">{error}</Text>
        <TouchableOpacity
          onPress={fetchIssueDetails}
          className="mt-6 bg-indigo-600 px-8 py-3 rounded-xl shadow-sm"
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!issueDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Feather name="file-minus" size={48} color="#6B7280" />
        <Text className="text-lg text-gray-600 mt-4">Issue not found</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-5 py-6">
        {/* Header Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                #{issueDetails.issueNumber} {issueDetails.issueName}
              </Text>
              <View className="flex-row items-center space-x-3">
                <StatusBadge status={issueDetails.status} />
                <View className="bg-indigo-50 px-3 py-1 rounded-full">
                  <Text className="text-indigo-600 font-medium">
                    {issueDetails.issueTag}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Issue Details Grid */}
          <View className="bg-gray-50 rounded-xl p-4 space-y-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
                <MaterialIcons name="person" size={20} color="#4F46E5" />
              </View>
              <View className="ml-3">
                <Text className="text-sm text-gray-500">Reported by</Text>
                <Text className="text-gray-900 font-medium">
                  {issueDetails.user.username}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
                <MaterialIcons name="event" size={20} color="#4F46E5" />
              </View>
              <View className="ml-3">
                <Text className="text-sm text-gray-500">Date Reported</Text>
                <Text className="text-gray-900 font-medium">
                  {formatDate(issueDetails.reportedDate)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
                <MaterialIcons name="location-on" size={20} color="#4F46E5" />
              </View>
              <View className="ml-3">
                <Text className="text-sm text-gray-500">Location</Text>
                <Text className="text-gray-900 font-medium">
                  {issueDetails.location.city
                    ? issueDetails.location.city
                    : issueDetails.location.coordinates[1].toFixed(4)}
                  ,
                  {issueDetails.location.country
                    ? issueDetails.location.country
                    : issueDetails.location.coordinates[0].toFixed(4)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
                <MaterialIcons name="update" size={20} color="#4F46E5" />
              </View>
              <View className="ml-3">
                <Text className="text-sm text-gray-500">Last Updated</Text>
                <Text className="text-gray-900 font-medium">
                  {formatDate(issueDetails.lastUpdated)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Description
          </Text>
          <Text className="text-gray-700 leading-relaxed">
            {issueDetails.issueDescription}
          </Text>
        </View>

        {/* Photos Section */}
        {issueDetails.issuePhotos?.length > 0 && (
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Photos
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {issueDetails.issuePhotos.map((photoUrl, index) => (
                <View
                  key={index}
                  className="mr-3 rounded-xl overflow-hidden shadow-sm"
                >
                  <Image
                    source={{ uri: photoUrl }}
                    className="w-48 h-48"
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Comments Section */}
        <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <TouchableOpacity
            className="flex-row items-center justify-between p-6"
            onPress={() => setShowComments(!showComments)}
          >
            <Text className="text-lg font-semibold text-gray-900">
              Comments
            </Text>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="#4B5563"
              />
            </Animated.View>
          </TouchableOpacity>

          {showComments && (
            <View className="px-6 pb-6">
              {/* Add Comment Input */}
              <View className="bg-gray-50 rounded-xl p-4 mb-6">
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
                  placeholder="Add a comment..."
                  multiline
                  value={newComment}
                  onChangeText={setNewComment}
                  style={{ minHeight: 100 }}
                />
                <TouchableOpacity
                  className="bg-indigo-600 py-3 rounded-xl"
                  onPress={handlePostComment}
                >
                  <Text className="text-white text-center font-semibold">
                    Post Comment
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Comments List */}
              {issueDetails.comments?.map((comment, index) => (
                <View key={index} className="bg-gray-50 rounded-xl p-4 mb-4">
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 rounded-full bg-indigo-100 justify-center items-center">
                      <Text className="font-bold text-indigo-600">
                        {comment.user?.username?.charAt(0) ?? "A"}
                      </Text>
                    </View>
                    <View className="ml-3">
                      <Text className="font-semibold text-gray-900">
                        {comment.user.username}
                      </Text>
                      <Text className="text-sm text-gray-500">2 hours ago</Text>
                    </View>
                  </View>
                  <Text className="text-gray-700 leading-relaxed">
                    {comment.content}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default IssueDetails;
