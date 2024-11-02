import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, serverurl } from "../../firebaseConfig";
import { router } from 'expo-router';
import axios from 'axios';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with full name for email signups
      await updateProfile(user, {
        displayName: fullName
      });

      console.log('User profile updated with name:', fullName);
      const currentUserData = {
        email: email,
        username: fullName
      }
      await axios.post(`${serverurl}/user`, currentUserData);

      // Navigate to Home Screen after successful signup
      router.push('/home/home');
    } catch (error) {
      console.error("Error signing up: ", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center p-5">
      <Text className="text-4xl font-bold text-center mb-2">Sign up to CityFix!</Text>
      <Text className="text-lg text-center text-gray-500 mb-5">First create your account</Text>

      <TextInput
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
        className="h-12 border border-gray-300 rounded-lg px-4 mb-4"
        placeholderTextColor="#999"
      />

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

      <TextInput
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        className="h-12 border border-gray-300 rounded-lg px-4 mb-4"
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        className="bg-black py-4 rounded-lg items-center mb-5 shadow-lg"
        onPress={handleSignUp}
      >
        <Text className="text-white text-lg font-semibold">Sign Up</Text>
      </TouchableOpacity>

      <Text
        className="text-center text-gray-500 my-2"
        onPress={() => router.push('/sign-in')}
      >
        Already have an account? <Text className="text-[#FF6B6B] font-bold">Login</Text>
      </Text>

      <View className="items-center mt-5">
        <Text className="text-base text-gray-600 mb-4">Sign Up with</Text>
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

export default SignUp;
