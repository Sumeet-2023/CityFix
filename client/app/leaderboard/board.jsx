import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Dummy function to mimic fetching sorted leaderboard data from the backend
const fetchLeaderboardData = (tab) => {
  if (tab === 'Friends') {
    return [
      { id: 'A', name: 'Eren Yeager', points: 8000 },
      { id: 'P', name: 'peter parker', points: 5000 },
      { id: 'M', name: 'Mathew mend', points: 4000 },
      { id: 'S', name: 'Sunny sharma', points: 3000 },
    ];
  }
  if (tab === 'Global') {
    return [
      { id: 'A', name: 'Eren Yeager', points: 8000 },
      { id: 'S', name: 'Sunny sharma', points: 7000 },
      { id: 'P', name: 'peter parker', points: 6000 },
      { id: 'M', name: 'Mathew mend', points: 5000 },
    ];
  }
  if (tab === 'Local') {
    return [
      { id: 'S', name: 'Sunny sharma', points: 9000 },
      { id: 'A', name: 'Eren Yeager', points: 8000 },
      { id: 'P', name: 'peter parker', points: 5000 },
      { id: 'M', name: 'Mathew mend', points: 4000 },
    ];
  }
  return [];
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('Friends');
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Fetch the data for the current tab
    const data = fetchLeaderboardData(activeTab);
    setLeaderboardData(data);
  }, [activeTab]);

  return (
    <View className="flex-1 px-5 py-5 bg-white">
      {/* Tabs for Friends, Global, Local */}
      <View className="flex-row justify-around mb-5">
        {['Friends', 'Global', 'Local'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full ${
              activeTab === tab ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <Text className={`text-lg font-semibold ${
              activeTab === tab ? 'text-white' : 'text-gray-700'
            }`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>

      {leaderboardData.length > 0 && (
        <View className="bg-white p-5 rounded-xl mb-5 shadow-md">
         <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center">
             <Text className="text-white font-bold text-lg">
                {leaderboardData[0].id}
             </Text>
            </View>
            <Text className="ml-3 font-semibold text-lg">{leaderboardData[0].name}</Text>
        </View>
        <Text className="text-base text-gray-800">
            Rank: #1
        </Text>
        <Text className="text-base text-gray-800">
         {leaderboardData[0].points} points
         </Text>
        <View className="flex-row justify-between mt-3">
            <Text className="text-gray-700 text-sm">
             Top 1% out of 100
            </Text>
            <MaterialIcons name="emoji-events" size={24} color="black" />
        </View>
        </View>
        )}


        {/* Leaderboard List */}
        {leaderboardData.slice(1).map((user, index) => (
          <View
            key={user.id}
            className="bg-white p-3 rounded-xl mb-3 border border-gray-300"
          >
            <View className="flex-row items-center">
              <View className="bg-gray-300 w-8 h-8 rounded-full items-center justify-center">
                <Text className="font-bold">{user.id}</Text>
              </View>
              <Text className="ml-3 text-lg font-semibold text-gray-800">
                {user.name}
              </Text>
              <Text className="ml-auto text-lg text-gray-800">{user.points}pt</Text>
            </View>
          </View>
        ))}

        {/* Show More Button */}
        <TouchableOpacity className="mt-5 items-center">
          <Text className="text-blue-500 font-bold">Show more</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Leaderboard;