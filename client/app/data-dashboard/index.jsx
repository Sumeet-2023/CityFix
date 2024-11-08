import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, Alert, ScrollView } from 'react-native';
import { Provider as PaperProvider, Appbar, Menu, Button, Card } from 'react-native-paper';
import * as Location from 'expo-location';
import axios from 'axios';
import { styled } from "nativewind";

const StyledButton = styled(Button);
const StyledCard = styled(Card);

const preferences = ["weather", "air_quality"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad"]; // add more cities as needed

export default function App() {
  const [selectedPreference, setSelectedPreference] = useState(preferences[0]);
  const [selectedCity, setSelectedCity] = useState('');
  const [cityInfo, setCityInfo] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [cityMenuVisible, setCityMenuVisible] = useState(false);

  // Get the user's location if no city is selected
  useEffect(() => {
    if (!selectedCity) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission denied", "Allow location access to get your current city.");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        fetchCityFromCoordinates(latitude, longitude);
      })();
    }
  }, [selectedCity]);

  const fetchCityFromCoordinates = async (lat, lon) => {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      const data = await response.json();
      setSelectedCity(data.city || 'Unknown City');
    } catch (error) {
      console.error("Error fetching city name:", error);
    }
  };

  const fetchCityInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/dashboard/${selectedCity.toLowerCase()}/preference/${selectedPreference.toLowerCase()}`
      );
      setCityInfo(response.data);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(`Error fetching data for ${selectedPreference} in ${selectedCity}:`, error);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      fetchCityInfo();
    }
  }, [selectedCity, selectedPreference]);

  const renderWeatherInfo = () => (
    <View className="space-y-2">
      <Text className="text-lg font-semibold">Weather in {cityInfo.city}, {cityInfo.country}</Text>
      <Text>Temperature: {cityInfo.temperature}°C</Text>
      <Text>Feels Like: {cityInfo.feels_like}°C</Text>
      <Text>Min Temp: {cityInfo.temp_min}°C</Text>
      <Text>Max Temp: {cityInfo.temp_max}°C</Text>
      <Text>Humidity: {cityInfo.humidity}%</Text>
      <Text>Pressure: {cityInfo.pressure} hPa</Text>
      <Text>Visibility: {cityInfo.visibility} meters</Text>
      <Text>Wind Speed: {cityInfo.wind_speed} m/s</Text>
      <Text>Sunrise: {cityInfo.sunrise}</Text>
      <Text>Sunset: {cityInfo.sunset}</Text>
      <Text>Description: {cityInfo.description}</Text>
      {cityInfo.icon && <Image source={{ uri: cityInfo.icon }} style={{ width: 50, height: 50 }} />}
    </View>
  );

  const renderAirQualityInfo = () => (
    <View className="space-y-2">
      <Text className="text-lg font-semibold">Air Quality in {cityInfo.city}</Text>
      <Text>AQI: {cityInfo.aqi}</Text>
      <Text>Dominant Pollutant: {cityInfo.dominantPollutant}</Text>
    </View>
  );

  return (
    <PaperProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        <Appbar.Header className="bg-blue-600">
          <Appbar.Content title="City Preferences" titleStyle={{ color: '#FFFFFF' }} />
        </Appbar.Header>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <StyledButton mode="outlined" onPress={() => setMenuVisible(true)} className="mb-4">
                Preference: {selectedPreference}
              </StyledButton>
            }
          >
            {preferences.map((preference, index) => (
              <Menu.Item
                key={index}
                onPress={() => {
                  setSelectedPreference(preference);
                  setMenuVisible(false);
                }}
                title={preference.charAt(0).toUpperCase() + preference.slice(1)}
              />
            ))}
          </Menu>

          <Menu
            visible={cityMenuVisible}
            onDismiss={() => setCityMenuVisible(false)}
            anchor={
              <StyledButton mode="outlined" onPress={() => setCityMenuVisible(true)} className="mb-4">
                City: {selectedCity || "Fetching..."}
              </StyledButton>
            }
          >
            {cities.map((city, index) => (
              <Menu.Item
                key={index}
                onPress={() => {
                  setSelectedCity(city);
                  setCityMenuVisible(false);
                }}
                title={city}
              />
            ))}
          </Menu>

          <StyledCard className="p-4 rounded-lg bg-blue-100">
            {selectedCity && cityInfo ? (
              selectedPreference === 'weather' ? renderWeatherInfo() : renderAirQualityInfo()
            ) : (
              <Text className="text-center text-lg">Select a preference and city to see information.</Text>
            )}
          </StyledCard>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}
