import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { serverurl } from '../../../../../firebaseConfig';
import { useAuthStore } from '../../../../store';
import { Ionicons } from '@expo/vector-icons';

const CommunityMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, communityId } = useAuthStore();
  const [userRole, setUserRole] = useState('MEMBER');
  const userId = user.id;

  useEffect(() => {
    fetchCommunityMembers();
  }, [communityId]);

  useEffect(() => {
    const fetchRole = async () => {
      const res = await axios.post(`${serverurl}/community/fetchUserRole/${communityId}`, { userId });
      setUserRole(res.data.userRole);
    };
    fetchRole();
  }, []);

  const fetchCommunityMembers = async () => {
    try {
      const response = await axios.get(`${serverurl}/community/members/${communityId}`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching community members:', error);
    }
  };

  const promoteMember = async (memberId) => {
    try {
      setIsLoading(true);
      await axios.patch(`${serverurl}/community/${communityId}/promote`, {
        userId: memberId,
      });
      fetchCommunityMembers();
    } catch (error) {
      console.error('Error promoting member to coordinator:', error);
      Alert.alert('Error', 'Failed to promote member to coordinator. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoteMember = async (memberId) => {
    try {
      setIsLoading(true);
      const res = await axios.patch(`${serverurl}/community/${communityId}/demote`, {
        userId: memberId,
      });
      if (res.status === 404) {
        console.log(res.message);
      }
      fetchCommunityMembers();
    } catch (error) {
      console.error('Error promoting member to coordinator:', error);
      Alert.alert('Error', 'Failed to promote/demote member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // no need for now, integrated automatic delete if user is member
  // const kickOutMember = async (memberId) => {
  //   try {
  //     setIsLoading(true);
  //     await axios.delete(`${serverurl}/community/${communityId}/members`, {
  //       data: { userId: memberId },
  //     });
  //     fetchCommunityMembers();
  //   } catch (error) {
  //     console.error('Error kicking out member:', error);
  //     Alert.alert('Error', 'Failed to kick out member. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const renderMemberItem = ({ item }) => (
    <View className="flex-row justify-between items-center bg-white rounded-lg px-4 py-3 mb-3">
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mr-3">
          <Ionicons name="person-outline" size={20} color="#4F46E5" />
        </View>
        <View>
          <Text className="text-gray-800 font-semibold">{item.user.username}</Text>
          <Text className="text-gray-500">
            {item.role === 'MEMBER' ? 'Member' : item.role === 'COORDINATOR' ? 'Coordinator' : 'Creator'}
          </Text>
        </View>
      </View>
      <View className="flex-row">
        {(item.role === 'MEMBER' && (userRole === 'CREATOR' || userRole === 'COORDINATOR')) && (
          <TouchableOpacity
            className="bg-green-600 px-4 py-2 rounded-lg mr-2"
            onPress={() => promoteMember(item.user.id)}
          >
            <View className="flex-row justify-center items-center">
              <Ionicons name="arrow-up-outline" color="#FFF" />
              {/* <Text className="text-white font-bold ml-2">Promote</Text> */}
            </View>
          </TouchableOpacity>
        )}
        {((item.role === 'COORDINATOR' && userRole === 'CREATOR')) && (
          <TouchableOpacity
            className="bg-red-600 px-4 py-2 rounded-lg mr-2"
            onPress={() => demoteMember(item.user.id)}
          >
            <View className="flex-row justify-center items-center">
              <Ionicons name="arrow-down-outline" color="#FFF" />
              {/* <Text className="text-white font-bold ml-2">Demote</Text> */}
            </View>
          </TouchableOpacity>
        )}
        {item.role === 'MEMBER' && (userRole === 'CREATOR' || userRole === 'COORDINATOR') && (
          <TouchableOpacity
            className="bg-red-600 px-4 py-2 rounded-lg"
            onPress={() => demoteMember(item.user.userId)}
          >
            <View className="flex-row justify-center items-center">
              <Ionicons name="trash-outline" color="#FFF" />
              {/* <Text className="text-white font-bold ml-2">Kick Out</Text> */}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-gray-800 font-bold text-2xl mb-4">Community Members</Text>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#4F46E5" size="large" />
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.user.id || item.id.toString()}
          renderItem={renderMemberItem}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default CommunityMembersPage;