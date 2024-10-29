import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useMemo } from 'react';
import { View, Linking, Image } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { LocationAccuracy } from 'expo-location';
import { Button, FAB, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FoodBankMarker = () => {
  return (
    <View>
      <Image
        source={require('../../assets/icons/food-bank-icon.png')}
        style={{ width: 30, height: 30 }}
      />
    </View>
  );
};

export default function Explore() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.3006927,
    longitude: 72.8462192,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState('');
  const theme = useTheme();

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission Denied to access location');
      return;
    }
    let location = await Location.getCurrentPositionAsync({ accuracy: LocationAccuracy.BestForNavigation });
    setMapRegion((prevRegion) => ({
      ...prevRegion,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }));
  };

  useEffect(() => {
    userLocation();
  }, []);

  const zoomIn = () => {
    setMapRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 0.5,
      longitudeDelta: prevRegion.longitudeDelta * 0.5,
    }));
  };

  const zoomOut = () => {
    setMapRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  // Memoize projectLocations based on mapRegion
  const projectLocations = useMemo(() => [
    { id: 1, latitude: mapRegion.latitude + 0.001, longitude: mapRegion.longitude - 0.002, title: 'Project 1' },
    { id: 2, latitude: mapRegion.latitude + 0.002, longitude: mapRegion.longitude + 0.003, title: 'Project 2' },
    { id: 3, latitude: mapRegion.latitude - 0.001, longitude: mapRegion.longitude - 0.001, title: 'Project 3' },
    { id: 4, latitude: mapRegion.latitude + 0.003, longitude: mapRegion.longitude - 0.001, title: 'Project 4' },
    { id: 5, latitude: mapRegion.latitude - 0.002, longitude: mapRegion.longitude + 0.002, title: 'Project 5' },
  ], [mapRegion]); // Only re-compute when mapRegion changes

  const openNavigation = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <MapView style={{ flex: 1 }} region={mapRegion}>
        {/* Display the circular region around the user's location */}
        <Circle
          center={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }}
          radius={800} // Radius in meters
          strokeColor="rgba(255, 0, 0, 0.5)" // Border color
          fillColor="rgba(255, 0, 0, 0.2)" // Fill color
        />

        {projectLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={location.title}
            onPress={() => openNavigation(location.latitude, location.longitude)}
          >
            <FoodBankMarker />
          </Marker>
        ))}
      </MapView>

      {/* Buttons for zoom control and getting location */}
      <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-around' }}>
        <FAB
          style={{ backgroundColor: 'blue' }}
          small
          icon={() => <MaterialCommunityIcons name="plus" size={24} color="white" />}
          onPress={zoomIn}
        />
        <FAB
          style={{ backgroundColor: 'blue' }}
          small
          icon={() => <MaterialCommunityIcons name="minus" size={24} color="white" />}
          onPress={zoomOut}
        />
        <Button
          mode="contained"
          style={{ backgroundColor: 'green', borderRadius: 8 }}
          onPress={userLocation}
          icon={() => <MaterialCommunityIcons name="crosshairs-gps" size={24} color="white" />}
        >
          Get Location
        </Button>
      </View>
    </SafeAreaView>
  )
}