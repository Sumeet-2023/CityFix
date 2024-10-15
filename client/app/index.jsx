import { Redirect } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Index() {

  const handleGetStarted = () => {
    // Navigate to the signup screen
    router.push('/sign-up');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to the Hello!</Text>
      <TouchableOpacity 
      onPress={handleGetStarted} >
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
