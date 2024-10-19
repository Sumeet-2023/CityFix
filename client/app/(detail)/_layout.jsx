import React from 'react'
import { Stack } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const DetailLayout = () => {
  return (
    <Stack>
     <Stack.Screen name="project-details" 
      options={{
        headerShown: true,
        title: 'Project Details',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}/>

     <Stack.Screen name="issue-details" 
      options={{
        headerShown: true,
        title: 'Issue Details',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}/>
    </Stack>
  
  )
}

export default DetailLayout