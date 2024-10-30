import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Searchbar, List } from 'react-native-paper';
import { debounce } from 'lodash';

const ClanSearch = ({ onClanSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchClans = debounce(async (query) => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/explore/clan?q=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching clans:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSelect = (clan) => {
    const [longitude, latitude] = clan.location.coordinates;
    onClanSelect({ 
      latitude,
      longitude,
      name: clan.name,
      description: clan.description
    });
    setSearchQuery(clan.name);
    setShowResults(false);
  };

  return (
    <View>
      <View className="bg-white rounded-lg shadow-lg">
        <Searchbar
          placeholder="Search clans..."
          onChangeText={(text) => {
            setSearchQuery(text);
            searchClans(text);
          }}
          value={searchQuery}
          className="rounded-lg"
          loading={loading}
        />
        
        {showResults && results.length > 0 && (
          <View className="mt-2 bg-white rounded-lg shadow-lg max-h-64">
            <List.Section>
              {results.map((clan, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(clan)}
                >
                  <List.Item
                    title={clan.name}
                    left={props => <List.Icon {...props} icon="hand-heart" />}
                  />
                </TouchableOpacity>
              ))}
            </List.Section>
          </View>
        )}
      </View>
    </View>
  );
};

export default ClanSearch;