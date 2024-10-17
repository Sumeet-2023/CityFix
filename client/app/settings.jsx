import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const SettingsOption = ({ icon, text, onPress }) => (
    <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-300" onPress={onPress}>
        <Ionicons name={icon} size={24} color="black" />
        <Text className="text-xl font-medium ml-4">{text}</Text>
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
        router.push('/logout');
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-5">
            <Text className="text-xl pb-2 font-semibold">Account</Text>
            <SettingsOption icon="person-outline" text="Edit profile" onPress={handleEditProfile} />
            <SettingsOption icon="notifications-outline" text="Notifications" onPress={handleNotification} />
            <SettingsOption icon="log-out-outline" text="Log out" onPress={handleLogout} />
        </SafeAreaView>
    );
};

export default Setting;
