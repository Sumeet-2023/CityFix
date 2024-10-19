import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const Home = () => {
  const menuItems = [
    { title: "Report Issue", icon: "report-problem", route: "/home/report/feeds" },
    { title: "Community Project", icon: "group-work", route: "/home/community/feeds" },
    { title: "Crowdsourced Funding", icon: "attach-money", route: "/crowdsourced-funding" },
    { title: "Data Dashboard", icon: "bar-chart", route: "/data-dashboard" },
    { title: "Leaderboard", icon: "emoji-events", route: "/leaderboard" },
    { title: "Rewards for Engagements", icon: "star", route: "/rewards" },
  ];

  const handleMenuItemPress = (route) => {
    router.push(route);
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <StatusBar barStyle={'dark-content'} />
      <ScrollView>
        
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

        <Text className="text-xl font-bold mb-3">My DashBoard</Text>
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

      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;