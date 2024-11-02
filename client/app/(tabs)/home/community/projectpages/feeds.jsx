import React,{useState} from 'react';
import { View, Text, TouchableOpacity, Image, FlatList,ScrollView, TextInput } from 'react-native';
import { auth } from '../../../../../firebaseConfig';
import { router } from 'expo-router';


const FeedCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="bg-white rounded-lg p-4 mb-2 shadow-md">
      <View className="flex-row items-center mb-2">
        <Image 
          source={{ uri: item.profilePicture }} 
          className="w-10 h-10 rounded-full mr-2"
        />
        <Text className="text-gray-500">{item.username}</Text>
      </View>
      <Text className="font-bold mb-2">No. of people joined: {item.peopleJoined}</Text>
      <Text className="font-bold mb-1">Project Title:</Text>
      <Text className="mb-2">"{item.projectTitle}"</Text>
      <Text className="mb-1">Date: {item.date}</Text>
      <Text className="mb-1">Time: {item.time}</Text>
      <Text className="mb-4">Location: {item.location}</Text>
      <View className="flex-row justify-between">
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded">
          <Text className="text-white font-bold">JOIN</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded">
          <Text className="text-gray-700 font-bold">Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function Feeds() {
  const user = auth.currentUser;

  const feedData = [
    // Sample data array for demonstration
  {
    id: '1',
    projectTitle: "Tree Planting Drive",
    date: "October 20, 2024",
    time: "10:00 AM - 2:00 PM",
    location: "City Park",
    peopleJoined: 29,
    description: "Join us for a day of environmental conservation...",
    profilePicture: user.photoURL,
    username: user.displayName || "username",
  },
  
];

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFeedData, setFilteredFeedData] = useState(feedData);

 
 
  const handleSearchIssue = (query) => {
    setSearchQuery(query);
    if(query.trim() === ''){
      setFilteredFeedData(feedData); 
    }else{
      const filtered = feedData.filter((feed) => 
        feed.id.toString().toLowerCase().includes(query.toLowerCase()) ||
        feed.projectTitle.toLowerCase().includes(query.toLowerCase())
      );
     setFilteredFeedData(filtered);
    }
  }


  const handleCardPress = (item) => {
    // Pass only the item id
    router.push({
      pathname: '/project-details',
      params: { itemno: item.id }
    });
  };

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-center mb-5">Search Project</Text>
    <TextInput
      className="w-full border border-gray-300 rounded-lg p-3 mb-5"
      placeholder="Enter community project id or name"
      value={searchQuery}
      onChangeText={handleSearchIssue}
      placeholderTextColor="#999"
    />
      {filteredFeedData.length > 0 ? (
        <FlatList
          data={filteredFeedData}
          renderItem={({ item }) => (
            <FeedCard 
              item={item} 
              onPress={() => handleCardPress(item)} 
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <Text className="text-center text-gray-500 mt-5">No community issues found with that name</Text>
      )}
  </View>
  )
}
