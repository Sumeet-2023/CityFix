import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from "expo-router";
import CommunityList from '../../../../../components/community/communityList';
import { serverurl } from '../../../../../firebaseConfig';
import { useAuthStore } from '../../../../store';
import { AntDesign } from '@expo/vector-icons';

const MyCommunities = () => {
  const {user} = useAuthStore();

  const handleCreateCommunity = () => {
    router.push('/(modals)/createCommunity');
  };

  return (
    <View style={styles.container}>
      <CommunityList serverUrl={serverurl} userId={user?.id}/>
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleCreateCommunity}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MyCommunities;