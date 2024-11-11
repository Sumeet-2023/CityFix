import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { auth, serverurl } from "../../../firebaseConfig";
import axios from "axios";
import { useAuthStore } from "../../store";

const Home = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const [suggestedUsers, setSuggestedUsers] = useState([]); // Initialize with an empty array
  const [followedUsers, setFollowedUsers] = useState([]); // State to track followed users
  const { user } = useAuthStore();

  useEffect(() => {
    const getUser = async () => {
      const email = auth.currentUser.email;
      try {
        const res = await axios.get(`${serverurl}/user/email/${email}`);
        await setUser({
          id: res.data.id,
          email: email,
          username: res.data.username,
          profileUrl: res.data.profileUrl,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchSuggestedUsers = async () => {
      try {
        if (!user?.id) return; // Only fetch if user ID is available
        const response = await axios.get(`${serverurl}/user/suggested/${user.id}`);
        setSuggestedUsers(response.data);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    // Call getUser first, then fetch suggested users if user is available
    const timer = setTimeout(async () => {
      await getUser();
      if (user?.id) {
        fetchSuggestedUsers();
      }
    }, 2000); // Delay fetching user data by 2 seconds

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [user?.id]); // Add dependency on user.id

  const handleFollow = async (userIdToFollow) => {
    try {
      await axios.post(`${serverurl}/user/${user.id}/follow`, {
        targetUserId: userIdToFollow,
      });
      alert("Followed successfully!");
      // Update the state to indicate that the user has been followed
      setFollowedUsers((prev) => [...prev, userIdToFollow]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleCloseSuggestion = (userId) => {
    setSuggestedUsers((prev) => prev.filter((item) => item.id !== userId));
  };

  const menuItems = [
    { title: "Report Issue", icon: "report-problem", route: "/home/report/feeds" },
    { title: "Community Project", icon: "group-work", route: "/home/community/communitypages/myCommunity" },
    { title: "Crowdsourced Funding", icon: "attach-money", route: "home/crowd/myClan" },
    { title: "Data Dashboard", icon: "bar-chart", route: "/data-dashboard" },
    { title: "Leaderboard", icon: "emoji-events", route: "/leaderboard" },
    { title: "Rewards for Engagements", icon: "star", route: "/rewards" },
  ];

  const handleMenuItemPress = (route) => {
    router.push(route);
  };

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <StatusBar barStyle={"dark-content"} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-4xl font-bold">Home</Text>
          <TouchableOpacity onPress={handleSettingsPress}>
            <MaterialIcons name="settings" size={28} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center bg-gray-200 rounded-lg px-4 py-3 mb-5">
          <MaterialIcons name="search" size={24} color="gray" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#999"
            className="ml-3 flex-1 text-lg"
          />
        </View>

        <Text className="text-xl font-bold mb-3">My Dashboard</Text>
        <View className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center justify-between p-4"
              onPress={() => handleMenuItemPress(item.route)}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-4">
                  <MaterialIcons name={item.icon} size={24} color="black" />
                </View>
                <Text className="text-lg text-black">{item.title}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="gray" />
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-xl font-bold m-4">Suggested for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
          {suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.map((suggestedUser) => (
              <View
                key={suggestedUser.id}
                className="mr-4 bg-white rounded-lg p-3 shadow-lg w-48"
              >
                {/* User Profile Image */}
                <Image
                  source={{ uri: suggestedUser.profileUrl || "https://via.placeholder.com/150" }}
                  style={{ width: 80, height: 80, borderRadius: 40, alignSelf: "center" }}
                />

                {/* Username */}
                <Text className="text-lg font-bold mt-3 text-center">
                  {suggestedUser.username}
                </Text>

                {/* Follow Button */}
                {followedUsers.includes(suggestedUser.id) ? (
                  <TouchableOpacity
                    className="bg-gray-500 mt-4 rounded-lg py-2"
                    disabled
                  >
                    <Text className="text-white text-center font-semibold">Followed</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="bg-blue-500 mt-4 rounded-lg py-2"
                    onPress={() => handleFollow(suggestedUser.id)}
                  >
                    <Text className="text-white text-center font-semibold">Follow</Text>
                  </TouchableOpacity>
                )}

                {/* Close Button */}
                <TouchableOpacity
                  className="absolute top-2 right-2"
                  onPress={() => handleCloseSuggestion(suggestedUser.id)}
                >
                  <AntDesign name="close" size={20} color="gray" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-5">No suggested users found</Text>
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;