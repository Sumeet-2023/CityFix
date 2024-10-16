import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { router } from 'expo-router';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to Home Screen after successful sign-in
      router.push('/home');
    } catch (error) {
      console.error('Error signing in: ', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center p-5 bg-white">
      <Text className="text-4xl font-bold text-center mb-2">Sign In</Text>
      <Text className="text-lg text-center text-gray-500 mb-5">Enter your email and password</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="h-12 border border-gray-300 rounded-lg px-4 mb-4"
        placeholderTextColor="#999" 
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="h-12 border border-gray-300 rounded-lg px-4 mb-4"
        placeholderTextColor="#999" 
      />

      <TouchableOpacity onPress={() => { /* Handle forgot password */ }}>
        <Text className="text-[#FF6B6B] text-right mb-5">Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-black py-4 rounded-lg items-center mb-5 shadow-lg" onPress={handleSignIn}>
        <Text className="text-white text-lg">Log In</Text>
      </TouchableOpacity>

      <Text
        className="text-center text-gray-500 my-2"
        onPress={() => router.push('/sign-up')}
      >
        Don't have an account? <Text className="text-[#FF6B6B] font-bold">Sign up</Text>
      </Text>

      <View className="items-center mt-5">
        <Text className="text-base text-gray-600 mb-4">Sign In with</Text>
        <View className="flex-row space-x-5 my-4">
          <TouchableOpacity className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
            <Text className="text-lg font-bold">F</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
            <Text className="text-lg font-bold">In</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
            <Text className="text-lg font-bold">G</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}