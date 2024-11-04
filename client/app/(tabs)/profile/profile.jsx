import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { auth } from "../../../firebaseConfig";
import { router } from "expo-router";
import { images } from "../../../constants";
import Badge from "../../../components/badge";
import { LinearGradient } from "expo-linear-gradient";

// Component for displaying user profile information
const ProfileHeader = ({ user }) => (
  <View className="flex items-center p-4 mt-4 bg-white rounded-2xl shadow-md">
    <Image
      source={user.photoURL ? { uri: user.photoURL } : images.defaultProfile}
      resizeMode="cover"
      className="w-36 h-36 rounded-full border-4 border-primary mb-4"
    />
    <Text className="text-2xl font-bold text-primary mb-1">
      {user.name || "Unknown User"}
    </Text>
    <View className="flex-row items-center mb-4">
      <MaterialIcons name="location-on" size={20} color="#3B82F6" />
      <Text className="text-sm text-gray-500 ml-1">{user.location}</Text>
    </View>
    {/* Separator Line */}
    <View className="w-3/4 h-[1px] bg-gray-300 my-2"></View>
    {/* Followers and Following Section */}
    <View className="flex-row justify-between items-center w-3/4">
      <View className="items-center">
        <Text className="text-2xl font-bold text-primary">{user.followers}</Text>
        <Text className="text-gray-600">Followers</Text>
      </View>
      {/* Vertical Separator Line */}
      <View className="h-12 w-[1px] bg-gray-300"></View>
      <View className="items-center">
        <Text className="text-2xl font-bold text-primary">{user.following}</Text>
        <Text className="text-gray-600">Following</Text>
      </View>
    </View>
  </View>
);

// Component for profile action buttons
const ProfileActions = ({ user }) => {
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out ${user.name}'s profile on our platform!`,
      });

      if (result.action === Share.sharedAction) {
        console.log("Shared successfully!");
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View className="flex-row justify-center space-x-4 mt-6 mb-4 px-4">
      <TouchableOpacity
        className="flex-row items-center justify-center flex-1 h-12 bg-blue-700 rounded-full shadow-lg"
        onPress={() => router.push("profile/editProfile")}
      >
        <FontAwesome5 name="edit" size={16} color="white" />
        <Text className="text-white font-bold ml-2">Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row items-center justify-center flex-1 h-12 bg-blue-700 rounded-full shadow-lg"
        onPress={handleShare}
      >
        <FontAwesome5 name="share-alt" size={16} color="white" />
        <Text className="text-white font-bold ml-2">Share Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

// Points Section Component with gradient background
const PointsSection = ({ points }) => (
  <LinearGradient
    colors={["#4882C4", "#123F72"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    className="my-4 mx-4 rounded-2xl shadow-lg p-6"
  >
    <View className="flex-row items-center justify-center mb-2">
      <FontAwesome5 name="star" size={30} color="#fff" />
      <Text className="text-lg font-bold text-white ml-4">Points Earned</Text>
    </View>
    <Text className="text-4xl font-bold text-white text-center">{points}</Text>
  </LinearGradient>
);

// Profile Badges Section Component
const ProfileBadges = ({ badges }) => (
  <View className="p-4 mt-4 bg-white rounded-2xl shadow-lg mx-4">
    <Text className="text-xl font-bold text-primary mb-4">Badges</Text>
    {badges.length > 0 ? (
      badges.map((badge) => (
        <Badge
          key={badge.id}
          name={badge.name}
          icon={badge.icon}
          reason={badge.reason}
        />
      ))
    ) : (
      <Text className="text-gray-500">No badges yet</Text>
    )}
  </View>
);

// Main Profile component
const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    location: "Mumbai, India",
    followers: 15,
    following: 20,
    points: 250,
    photoURL: null,
    badges: [
      {
        id: 1,
        name: "Contributor",
        icon: "trophy",
        reason: "Contributed to 10 issues",
      },
      {
        id: 2,
        name: "Helper",
        icon: "hands-helping",
        reason: "Helped resolve 5 issues",
      },
    ],
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser((prev) => ({
        ...prev,
        name: currentUser.displayName || "Unknown User",
        photoURL: currentUser.photoURL || null,
      }));
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <ProfileHeader user={user} />
        <ProfileActions user={user} />
        <PointsSection points={user.points} />
        <ProfileBadges badges={user.badges} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;