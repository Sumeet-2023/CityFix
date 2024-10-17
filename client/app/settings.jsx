import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const SettingsOption = ({ icon, text, onPress }) => (
    <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-300" onPress={onPress}>
        <View className="flex-row items-center">
            <MaterialIcons name={icon} size={24} color="black" />
            <Text className="text-lg ml-4 text-black">{text}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="gray" />
    </TouchableOpacity>
);

const Setting = () => {
    const handleEditProfile = () => {
        router.push("/editprofile");
    };

    const handleNotification = () => {
        router.push('/notification');
    };

    const handleLogout = () => {
        router.push('/sign-in');
    };

    return (
        <View className="flex-1 bg-white px-5">
            <Text className="text-2xl pb-4 font-semibold text-black">Account</Text>
            <SettingsOption icon="person" text="Edit profile" onPress={handleEditProfile} />
            <SettingsOption icon="notifications" text="Notifications" onPress={handleNotification} />
            <SettingsOption icon="logout" text="Log out" onPress={handleLogout} />
        </View>
    );
};

export default Setting;