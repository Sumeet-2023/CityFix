
import { router, Stack } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import { TouchableOpacity } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PaperProvider } from 'react-native-paper';

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}}/>
        <Stack.Screen name="(detail)" options={{headerShown: false}}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)" options={{ headerShown: false }} />
        <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
        <Stack.Screen name="rewards" options={{ headerShown: false }} />      
        <Stack.Screen name="data-dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ 
          headerShown: true,
          title: 'Settings',
          headerStyle: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
          headerTitleStyle: { fontSize: 18, fontWeight: '600', color: 'black' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 1 }}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ) }}
        />  
      </Stack>
    </PaperProvider>
  );
}
