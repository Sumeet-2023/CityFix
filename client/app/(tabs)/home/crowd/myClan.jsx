import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Switch, ActivityIndicator, RefreshControl } from 'react-native';
import { styled } from 'nativewind';
import { serverurl } from '../../../../firebaseConfig';
import { useAuthStore } from '../../../store';
import axios from 'axios'
import { isArray } from 'lodash';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const MyClan = () => {
  // // Sample data, replace with your state or API response data
  // const clanData = {
  //   name: "#1 Team USA Yes",
  //   description: "Hello welcome to our Clan",
  //   type: "Invite Only",
  //   YBOJ",
  //   members: [location: "United States",
  //   clanTag: "#LOG
  //     { id: '1', name: 'kingofthenorth', role: 'Member', paid: false },
  //     { id: '2', name: 'Th0RR', role: 'Co-leader', paid: false },
  //     // Add more members here
  //   ]
  // };
  const [myClan, setMyClan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const {user} = useAuthStore();

  const fetchClan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverurl}/clan/joinedClan/${user?.id}`);
      console.log(response.data);
      setMyClan(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load Clan');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClan();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchClan();
  }, [])

  //delete  a clan
  const handleLeave = async (clanId) => {
    try {
      console.log(clanId)
      const data = {
        userId: user?.id,
      };
      console.log(data);
      await axios.post(`${serverurl}/clan/${clanId}/leave`, data);
      setMyClan((prevClans) => prevClans.filter((clan) => clan.id !== clanId));
    } catch (error) {
      console.error('Failed to Leave clan:', error);
    }
  };

  // State to manage toggle status for each member
  // const [memberStatus, setMemberStatus] = useState(
  //   myClan.members?.reduce((acc, member) => {
  //     acc[member.id] = member.paid; // Initialize with existing paid status
  //     return acc;
  //   }, {})
  // );

  // Toggle the paid status of a member
  // const togglePaidStatus = (memberId) => {
  //   setMemberStatus((prevStatus) => ({
  //     ...prevStatus,
  //     [memberId]: !prevStatus[memberId],
  //   }));
  // };

  if (loading) {
    return (
      <StyledSafeAreaView className="flex-1 p-4 bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
      </StyledSafeAreaView>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1 p-4 bg-gray-100 m-2">
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />} >
        {/* Clan Info Section */}
        { myClan && (
        <>
        <StyledView className="bg-blue-500 p-2 rounded-lg mb-4">
          <StyledView className="flex-row items-center mb-4 space-x-2">
          <StyledText className="px-2">
            {myClan?.badge?.icon ? (
              <Image source={{ uri: myClan.badge.icon }} style={{ width: 32, height: 32 }} />
            ) : (
              <Image source={{ uri: 'https://via.placeholder.com/40' }} style={{ width: 32, height: 32 }} />
            )}
          </StyledText>
            <StyledText className="text-white text-3xl font-bold">{myClan.clanName}</StyledText>
          </StyledView>
          <StyledText className="text-white text-base">Clan Description: {myClan.description}</StyledText>
          <StyledText className="text-white text-base">Type: {myClan.type}</StyledText>
          <StyledText className="text-white text-base">Location: {myClan.location?.city}, {myClan.location?.country}</StyledText>
          <StyledText className="text-white text-base">Clan Tag: {myClan.clanTag}</StyledText>
          <StyledText className="text-white text-base">Members: {myClan.members?.length}/50</StyledText>

          {/* Buttons Section */}
          <StyledView className="flex-row justify-between mt-4">
            <StyledTouchableOpacity className="flex-1 bg-white py-2 mr-2 rounded-md">
              <StyledText className="text-center text-blue-600 font-semibold">Message</StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity onPress={() => handleLeave(myClan.id)} className="flex-1 bg-red-500 py-2 ml-2 rounded-md">
              <StyledText className="text-center text-white font-semibold">Leave</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {/* Invite to Clan Button */}
        <StyledTouchableOpacity className="bg-yellow-400 py-3 rounded-lg mb-4">
          <StyledText className="text-center text-black font-semibold text-lg">Invite to Clan</StyledText>
        </StyledTouchableOpacity>

        {/* Members Section */}
        <StyledText className="text-xl font-bold mb-2">Members ({myClan.members?.length}/50)</StyledText>
        <StyledView className="bg-white rounded-lg shadow-sm p-4">
          {Array.isArray(myClan.members) ? (myClan.members.map((member, index) => (
            <StyledView key={index} className="flex-row items-center justify-between py-3 border-b border-gray-200">
              <StyledView className="flex-row items-center">
                <Image
                  source={{ uri: 'https://via.placeholder.com/40' }} // Replace with member profile image
                  className="w-10 h-10 rounded-full mr-4"
                />
                <StyledText className="text-lg font-medium">{member.name}</StyledText>
              </StyledView>

              {/* Toggle Paid/Unpaid Switch */}
              {/* <StyledView className="flex-row items-center">
                <StyledText className="text-base mr-2">{memberStatus[member.id] ? 'Paid' : 'Unpaid'}</StyledText>
                <Switch
                  value={memberStatus[member.id]}
                  onValueChange={() => togglePaidStatus(member.id)}
                  thumbColor={memberStatus[member.id] ? "#34D399" : "#D1D5DB"}
                  trackColor={{ false: "#D1D5DB", true: "#34D399" }}
                />
              </StyledView> */}
            </StyledView>
          ))) : (
            <Text>
              Members not found
            </Text>
          )  }
        </StyledView>
        </>
        )}
      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default MyClan;
