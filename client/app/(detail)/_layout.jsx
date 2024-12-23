import React from 'react';
import { Stack } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const DetailLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="issue/[id]" 
        options={{
          headerShown: true,
          title: 'Issue Details',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
          headerTitleStyle: { fontSize: 18, fontWeight: '600', color: 'black' },
        }}
      />
      <Stack.Screen 
        name="project-details" 
        options={{
          headerShown: true,
          title: 'Project Details',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
          headerTitleStyle: { fontSize: 18, fontWeight: '600', color: 'black' },
        }}
      />

      <Stack.Screen 
        name="ngo-details" 
        options={{
          headerShown: true,
          title: 'Ngo Details',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
          headerTitleStyle: { fontSize: 18, fontWeight: '600', color: 'black' },
        }}
      />
    </Stack>
    
  );
}

export default DetailLayout;