import { Stack } from 'expo-router';
import { Platform } from 'react-native';

const ChatLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
        contentStyle: {
          backgroundColor: '#F9FAFB'
        },
        // Prevent keyboard from pushing the header up on iOS
        headerMode: Platform.OS === 'ios' ? 'float' : 'screen',
        presentation: 'card'
      }}
    >
      <Stack.Screen
        name="chatRoom"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createCommunity"
        options={{
          headerShown: false,
          gestureEnabled: Platform.OS === 'ios',
          gestureDirection: 'horizontal',
          animation: 'slide_from_right'
        }}
      />
    </Stack>
  );
};

export default ChatLayout;