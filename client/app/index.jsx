import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ImageBackground, StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        // User is signed in, navigate to home
        router.push('/home/home');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    // Navigate to the signup screen
    router.push('/sign-up');
  };

  return (
    <ImageBackground
      source={require('../assets/images/SDG-11.webp')} // Replace with the path to your generated image
      className="flex-1 w-full h-full justify-center"
    >
      <SafeAreaView className="flex-1 justify-end items-center p-5">
        <StatusBar barStyle={'dark-content'} />
        <Text className="text-4xl font-bold text-center mb-2 text-black">
          Welcome to CityFix!
        </Text>
        <Text className="text-lg font-bold text-center text-[#0E0E0E] mb-8">
          Your journey towards a better community starts here.
        </Text>
        
        <TouchableOpacity
          className="bg-[#2E522E] py-4 px-12 rounded-lg mb-5 shadow-lg"
          onPress={handleGetStarted}
        >
          <Text className="text-white text-lg font-semibold">Get Started</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}