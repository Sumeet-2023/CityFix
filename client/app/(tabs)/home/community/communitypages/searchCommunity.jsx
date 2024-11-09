import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Button, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { serverurl } from '../../../../../firebaseConfig';

const SearchCommunity = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNearbyCommunities = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverurl}/community/nearbyCommunities`, {
        params: {
          latitude,
          longitude,
        },
      });
      setCommunities(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const getLocationAndFetchCommunities = async () => {
    setLoading(true);
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        Alert.alert('Permission denied', 'Please enable location services to find nearby communities.');
        setLoading(false);
        return;
      }

      // Get user's current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Fetch nearby communities based on location
      fetchNearbyCommunities(latitude, longitude);
    } catch (error) {
      console.error(error);
      setError('Unable to retrieve location');
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationAndFetchCommunities();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Nearby Communities</Text>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>}
        {communities.length > 0 ? (
          communities.map((community) => (
            <View key={community._id} style={{ marginBottom: 16, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{community.communityName}</Text>
              <Text>{community.description}</Text>
            </View>
          ))
        ) : (
          !loading && <Text>No communities found nearby.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchCommunity;
