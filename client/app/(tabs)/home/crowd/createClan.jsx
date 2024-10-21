import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const CreateClan = () => {
  const [clanName, setClanName] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState(null);
  const [requiredMembers, setRequiredMembers] = useState(0);
  const [type, setType] = useState('Open');
  const [location, setLocation] = useState('International');
  const [incrementInterval, setIncrementInterval] = useState(null);

  const handleCreateClan = () => {
    alert('Clan Created Successfully!');
    router.push('home/crowd/myClan');
  };

  const toggleType = () => {
    setType((prev) => (prev === 'Open' ? 'Invite Only' : 'Open'));
  };

  const incrementMembers = () => {
    setRequiredMembers((prev) => prev + 1);
  };

  const decrementMembers = () => {
    if (requiredMembers > 0) {
      setRequiredMembers((prev) => prev - 1);
    }
  };

  // Long Press Start Function
  const startIncrementing = (callback) => {
    callback();
    const interval = setInterval(callback, 100); // Adjust the speed here (100 ms)
    setIncrementInterval(interval);
  };

  // Long Press Stop Function
  const stopIncrementing = () => {
    if (incrementInterval) {
      clearInterval(incrementInterval);
      setIncrementInterval(null);
    }
  };

  return (
    <View className="flex-1 bg-white p-5">
      <ScrollView>
      <Text className="text-2xl font-bold text-center mb-5">Create your own Clan</Text>
      <View className="bg-gray-100 p-4 rounded-xl shadow-md">

        {/* Clan Name */}
        <Text className="text-lg font-semibold mb-2">Clan Name</Text>
        <TextInput
          className="w-full border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="Enter clan name"
          value={clanName}
          onChangeText={setClanName}
        />

        {/* Badge */}
        <Text className="text-lg font-semibold mb-2">Badge</Text>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity className="flex-row items-center bg-blue-500 p-3 rounded-lg">
            <Text className="text-white font-bold mr-2">Browse</Text>
            {badge && <Image source={{ uri: badge }} className="w-6 h-6" />}
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text className="text-lg font-semibold mb-2">Description</Text>
        <TextInput
          className="w-full border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="Enter clan description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Type */}
        <Text className="text-lg font-semibold mb-2">Type</Text>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={toggleType}>
            <MaterialIcons name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="font-semibold text-lg">{type}</Text>
          <TouchableOpacity onPress={toggleType}>
            <MaterialIcons name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Required Members */}
        <Text className="text-lg font-semibold mb-2">Required Members</Text>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPressIn={() => startIncrementing(decrementMembers)}
            onPressOut={stopIncrementing}
          >
            <MaterialIcons name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="font-semibold text-lg">{requiredMembers}</Text>
          <TouchableOpacity
            onPressIn={() => startIncrementing(incrementMembers)}
            onPressOut={stopIncrementing}
          >
            <MaterialIcons name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <Text className="text-lg font-semibold mb-2">Location</Text>
        <TextInput
          className="w-full border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
        />

        {/* Create Clan Button */}
        <TouchableOpacity
          className="w-full bg-blue-500 p-4 rounded-lg mt-5 items-center"
          onPress={handleCreateClan}
        >
          <Text className="text-white font-bold">Create Clan</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

export default CreateClan;