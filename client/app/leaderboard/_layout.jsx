import React from 'react';
import { Stack } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const BoardLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="board"
        options={{
          headerShown: true,
          title: 'Leaderboard',
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

export default BoardLayout;