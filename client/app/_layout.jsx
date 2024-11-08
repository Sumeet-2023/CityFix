
import { Stack } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
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
        <Stack.Screen name="data-dashboard" options={{ headerShown: false }} />   
      </Stack>
    </PaperProvider>
  );
}
