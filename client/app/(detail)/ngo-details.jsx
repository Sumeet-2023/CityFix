import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const ngosDetails = () => {
    const {ngo} = useLocalSearchParams();
    const ngosDetails = JSON.parse(ngo);


    const handleSubmit = (pay) => {
        Alert.alert("Thank you for your generosity!", "Your donation helps support our cause.");
    }
    return (
        <View className="flex-1 bg-white p-5">
            <ScrollView>
                <Image source={ngosDetails.image} className="w-full h-40 mb-3 rounded-md" />
                <Text className="text-2xl font-bold mb-2">{ngosDetails.name}</Text>
                <Text className="text-lg text-gray-600 mb-4">Type: {ngosDetails.type}</Text>
                <Text className="text-lg mb-2">Work: {ngosDetails.description || 'No description available.'}</Text>

                <Text className="text-lg font-semibold mb-2">Contact Information:</Text>
                <Text className="text-lg">Email: {ngosDetails.contact.email}</Text>
                <Text className="text-lg">Phone: {ngosDetails.contact.phone}</Text>
                <TouchableOpacity className="mt-3 flex-1 items-center" onPress={(handleSubmit)}>
                    <Text className="text-xl px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md">Donate</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )

}

export default ngosDetails;