import { View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { images } from '../../../../constants';
import { router } from 'expo-router';

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
  {
    id: '3',
    name: 'Mitro foundation',
    type: 'Campaigning NGO',
    image: images.ngo3,
    description: 'Mitro Foundation works on various environmental initiatives.',
    contact: {
      email: 'contact@mitrofoundation.org',
      phone: '+1-800-1234',
    },
  },
  {
    id: '4',
    name: 'Hope foundation',
    type: 'Pollution',
    image: images.ngo4,
    description: 'Hope Foundation works on various environmental initiatives.',
    contact: {
      email: 'contact@hopefoundation.org',
      phone: '+1-800-1234',
    },
  },
  {
    id: '5',
    name: 'Children foundation',
    type: 'Environmental Protection',
    image: images.ngo5,
    description: 'Children Foundation works on various environmental initiatives.',
    contact: {
      email: 'contact@childrenfoundation.org',
      phone: '+1-800-1234',
    },
  },
];

export default function Ngo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNgos, setFilteredNgos] = useState(ngosData);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredNgos(ngosData);
    } else {
      const filtered = ngosData.filter((ngos) =>
        ngos.name.toLowerCase().includes(query.toLowerCase()) ||
        ngos.type.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNgos(filtered);
    }
  };

  const handleCardPress = (ngo) => {
    router.push({ pathname: '/ngo-details', params: { ngo: JSON.stringify(ngo) } });
  };

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-center mb-5">Search NGOs</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 mb-5"
        placeholder="Enter NGO's name or type"
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor="#999"
      />

      <ScrollView>
        {filteredNgos.length > 0 ? (
          filteredNgos.map((ngos) => (
            <TouchableOpacity key={ngos.id} onPress={() => handleCardPress(ngos)}>
              <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow-md">
                <Image source={ngos.image} className="w-full h-28 mb-3 rounded-md" />
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-lg font-bold">{ngos.name}</Text>
                    <Text className="text-base text-gray-700">Type: {ngos.type}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-center text-gray-500 mt-5">No NGOs found with that name</Text>
        )}
      </ScrollView>
    </View>
  );
}
