import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { router } from 'expo-router';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

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

  const startIncrementing = (callback) => {
    callback();
    const interval = setInterval(callback, 100); // Adjust the speed here (100 ms)
    setIncrementInterval(interval);
  };

  const stopIncrementing = () => {
    if (incrementInterval) {
      clearInterval(incrementInterval);
      setIncrementInterval(null);
    }
  };

  return (
    <StyledView className="flex-1 bg-gray-100 p-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <StyledText className="text-3xl font-bold text-center mb-5 text-blue-600">Create Your Clan</StyledText>

        <StyledView className="bg-white p-5 rounded-xl shadow-md mb-5">
          {/* Clan Name Section */}
          <StyledText className="text-lg font-semibold mb-2 text-blue-800">Clan Name</StyledText>
          <StyledTextInput
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-base"
            placeholder="Enter Clan Name"
            value={clanName}
            onChangeText={setClanName}
            placeholderTextColor="#999"
          />

          {/* Badge Section */}
          <StyledText className="text-lg font-semibold mb-2 text-blue-800">Clan Badge</StyledText>
          <StyledView className="flex-row items-center mb-4">
            <StyledTouchableOpacity className="bg-blue-500 p-3 rounded-lg flex-row items-center">
              <MaterialIcons name="image" size={24} color="white" />
              <StyledText className="text-white font-bold ml-2">Upload Badge</StyledText>
            </StyledTouchableOpacity>
            {badge && (
              <Image source={{ uri: badge }} className="ml-4 w-10 h-10 rounded-full" />
            )}
          </StyledView>

          {/* Description Section */}
          <StyledText className="text-lg font-semibold mb-2 text-blue-800">Clan Description</StyledText>
          <StyledTextInput
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-base"
            placeholder="Enter Clan Description"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#999"
            multiline
          />

          {/* Clan Type Section */}
          <StyledText className="text-lg font-semibold mb-2 text-blue-800">Clan Type</StyledText>
          <StyledView className="flex-row items-center justify-between mb-4 bg-gray-200 rounded-lg py-3 px-4">
            <StyledTouchableOpacity onPress={toggleType}>
              <MaterialIcons name="chevron-left" size={24} color="#666" />
            </StyledTouchableOpacity>
            <StyledText className="font-semibold text-lg">{type}</StyledText>
            <StyledTouchableOpacity onPress={toggleType}>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </StyledTouchableOpacity>
          </StyledView>

          {/* Required Members Section */}
          <StyledText className="text-lg font-semibold mb-2 text-blue-800">Required Members</StyledText>
          <StyledView className="flex-row items-center justify-between mb-4 bg-gray-200 rounded-lg py-3 px-4">
            <StyledTouchableOpacity
              onPressIn={() => startIncrementing(decrementMembers)}
              onPressOut={stopIncrementing}
            >
              <MaterialIcons name="remove-circle-outline" size={30} color="#666" />
            </StyledTouchableOpacity>
            <StyledText className="font-semibold text-xl">{requiredMembers}</StyledText>
            <StyledTouchableOpacity
              onPressIn={() => startIncrementing(incrementMembers)}
              onPressOut={stopIncrementing}
            >
              <MaterialIcons name="add-circle-outline" size={30} color="#666" />
            </StyledTouchableOpacity>
          </StyledView>

          {/* Location Section */}
          <StyledText className="text-lg font-semibold mb-2 text-blue-800">Location</StyledText>
          <StyledTextInput
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-base"
            placeholder="Enter Location"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#999"
          />

          {/* Create Clan Button */}
          <StyledTouchableOpacity
            className="w-full bg-blue-600 p-4 rounded-lg items-center mt-6"
            onPress={handleCreateClan}
          >
            <StyledText className="text-white font-bold text-lg">Create Clan</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </ScrollView>
    </StyledView>
  );
};

export default CreateClan;