import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthStore } from '../../store';
import axios from 'axios';
import { serverurl } from '../../../firebaseConfig';

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const { updateUser, user: currentUser } = useAuthStore();

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhoto(user.photoURL);
      setFirstName(currentUser?.firstname || '');
      setLastName(currentUser?.lastname || '');
      setProfession(currentUser?.profession || ''); // Set profession from current user
    }
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = ref(storage, `profilePhotos/${user.uid}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async () => {
    try {
      let photoURL = photo;
      if (photo && photo !== user.photoURL) {
        photoURL = await uploadImage(photo);
      }

      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });

      const updateData = {
        profileUrl: photoURL,
        username: displayName,
        firstname: firstName,
        lastname: lastName,
        location,
        profession,
      };

      await axios.patch(`${serverurl}/user/${currentUser.id}`, updateData);

      updateUser({
        profileUrl: photoURL,
        username: displayName,
        firstname: firstName,
        lastname: lastName,
        location,
        profession,
      });

      if (newPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }

      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <TouchableOpacity className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center self-center mb-4" onPress={pickImage}>
          {photo ? (
            <Image source={{ uri: photo }} className="w-24 h-24 rounded-full" />
          ) : (
            <MaterialIcons name="add-a-photo" size={40} color="#3B82F6" />
          )}
        </TouchableOpacity>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">First Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Enter your first name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">Last Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Enter your last name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">Profession</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Enter your profession"
            placeholderTextColor="#9CA3AF"
            value={profession}
            onChangeText={setProfession}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">Location</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Enter your location"
            placeholderTextColor="#9CA3AF"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">New Password (optional)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Enter new password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        {newPassword ? (
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-1">Current Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="Enter current password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>
        ) : null}

        <TouchableOpacity className="bg-blue-600 rounded-lg p-4 mt-4 items-center" onPress={handleSave}>
          <Text className="text-white font-bold">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;