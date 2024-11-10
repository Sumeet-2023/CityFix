import { View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { images } from '../../../../constants';
import { router } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Importing icons for visual enhancement

export default function Ngo() {
  const ngosData = [
    {
      id: '1',
      name: 'Seva foundation',
      type: 'Social',
      image: images.ngo1,
      description: 'Seva Foundation works to uplift marginalized communities through various social initiatives.',
      contact: {
        email: 'contact@sevafoundation.org',
        phone: '+1-800-1234',
      },
    },
    {
      id: '2',
      name: 'Govt foundation',
      type: 'Environmental',
      image: images.ngo2,
      description: 'Govt Foundation works on various environmental initiatives.',
      contact: {
        email: 'contact@govtfoundation.org',
        phone: '+1-800-1234',
      },
    },
    // More NGOs...
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNgos, setFilteredNgos] = useState(ngosData);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredNgos(ngosData);
    } else {
      const filtered = ngosData.filter((ngo) =>
        ngo.name.toLowerCase().includes(query.toLowerCase()) ||
        ngo.type.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNgos(filtered);
    }
  };

  const handleCardPress = (ngo) => {
    router.push({ pathname: '/ngo-details', params: { ngo: JSON.stringify(ngo) } });
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-3xl font-bold text-center mb-5 text-blue-600">Explore NGOs</Text>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-4 py-3 mb-5">
        <MaterialIcons name="search" size={24} color="#999" />
        <TextInput
          className="flex-1 ml-3 text-lg"
          placeholder="Enter NGO's name or type"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Scroll View for NGOs */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredNgos.length > 0 ? (
          filteredNgos.map((ngo) => (
            <TouchableOpacity key={ngo.id} onPress={() => handleCardPress(ngo)}>
              <View className="bg-white rounded-lg p-5 mb-5 shadow-lg">
                {/* NGO Image */}
                <Image source={ngo.image} className="w-full h-40 mb-3 rounded-md" resizeMode="cover" />

                {/* NGO Name and Type */}
                <View className="flex-row items-center mb-2">
                  <FontAwesome5 name="hands-helping" size={20} color="#4b5563" />
                  <Text className="text-2xl font-bold text-blue-600 ml-2">{ngo.name}</Text>
                </View>
                
                {/* NGO Description */}
                <Text className="text-gray-700 mb-3">{ngo.description}</Text>

                {/* Contact Information */}
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <MaterialIcons name="email" size={18} color="gray" />
                    <Text className="ml-2 text-gray-600">{ngo.contact.email}</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <MaterialIcons name="phone" size={18} color="gray" />
                    <Text className="ml-2 text-gray-600">{ngo.contact.phone}</Text>
                  </View>
                </View>

                {/* Contact Button */}
                <TouchableOpacity className="bg-blue-500 py-3 rounded-md mt-2">
                  <Text className="text-center text-white font-bold">Contact NGO</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-center text-gray-500 mt-10 text-lg">
            No NGOs found with that name. Please try another search.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}