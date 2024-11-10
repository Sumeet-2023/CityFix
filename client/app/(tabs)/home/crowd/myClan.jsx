import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { styled } from 'nativewind';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const MyClan = () => {
  // Sample data, replace with your state or API response data
  const clanData = {
    name: "#1 Team USA Yes",
    description: "Hello welcome to our Clan",
    type: "Invite Only",
    location: "United States",
    clanTag: "#LOGYBOJ",
    members: [
      { id: '1', name: 'kingofthenorth', role: 'Member', paid: false },
      { id: '2', name: 'Th0RR', role: 'Co-leader', paid: false },
      // Add more members here
    ]
  };

  // State to manage toggle status for each member
  const [memberStatus, setMemberStatus] = useState(
    clanData.members.reduce((acc, member) => {
      acc[member.id] = member.paid; // Initialize with existing paid status
      return acc;
    }, {})
  );

  // Toggle the paid status of a member
  const togglePaidStatus = (memberId) => {
    setMemberStatus((prevStatus) => ({
      ...prevStatus,
      [memberId]: !prevStatus[memberId],
    }));
  };

  return (
    <StyledSafeAreaView className="flex-1 p-4 bg-gray-100 m-2">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Clan Info Section */}
        <StyledView className="bg-blue-500 p-4 rounded-lg mb-4">
          <StyledView className="flex-row items-center mb-4">
            <Image
              source={{ uri: 'https://via.placeholder.com/80' }} // Replace with your clan image
              className="w-20 h-20 rounded-full mr-4"
            />
            <StyledText className="text-white text-3xl font-bold">{clanData.name}</StyledText>
          </StyledView>
          <StyledText className="text-white text-base">Clan Description: {clanData.description}</StyledText>
          <StyledText className="text-white text-base">Type: {clanData.type}</StyledText>
          <StyledText className="text-white text-base">Location: {clanData.location}</StyledText>
          <StyledText className="text-white text-base">Clan Tag: {clanData.clanTag}</StyledText>
          <StyledText className="text-white text-base">Members: {clanData.members.length}/50</StyledText>

          {/* Buttons Section */}
          <StyledView className="flex-row justify-between mt-4">
            <StyledTouchableOpacity className="flex-1 bg-white py-2 mr-2 rounded-md">
              <StyledText className="text-center text-blue-600 font-semibold">Message</StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity className="flex-1 bg-red-500 py-2 ml-2 rounded-md">
              <StyledText className="text-center text-white font-semibold">Leave</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {/* Invite to Clan Button */}
        <StyledTouchableOpacity className="bg-yellow-400 py-3 rounded-lg mb-4">
          <StyledText className="text-center text-black font-semibold text-lg">Invite to Clan</StyledText>
        </StyledTouchableOpacity>

        {/* Members Section */}
        <StyledText className="text-xl font-bold mb-2">Members ({clanData.members.length}/50)</StyledText>
        <StyledView className="bg-white rounded-lg shadow-sm p-4">
          {clanData.members.map((member, index) => (
            <StyledView key={member.id} className="flex-row items-center justify-between py-3 border-b border-gray-200">
              <StyledView className="flex-row items-center">
                <Image
                  source={{ uri: 'https://via.placeholder.com/40' }} // Replace with member profile image
                  className="w-10 h-10 rounded-full mr-4"
                />
                <StyledText className="text-lg font-medium">{member.name}</StyledText>
              </StyledView>

              {/* Toggle Paid/Unpaid Switch */}
              <StyledView className="flex-row items-center">
                <StyledText className="text-base mr-2">{memberStatus[member.id] ? 'Paid' : 'Unpaid'}</StyledText>
                <Switch
                  value={memberStatus[member.id]}
                  onValueChange={() => togglePaidStatus(member.id)}
                  thumbColor={memberStatus[member.id] ? "#34D399" : "#D1D5DB"}
                  trackColor={{ false: "#D1D5DB", true: "#34D399" }}
                />
              </StyledView>
            </StyledView>
          ))}
        </StyledView>
      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default MyClan;