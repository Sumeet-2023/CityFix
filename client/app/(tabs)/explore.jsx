import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Linking } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { LocationAccuracy } from 'expo-location';
import { Button, FAB, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Custom marker components remain the same
const IssueMarker = () => (
  <View>
    <MaterialCommunityIcons name="alert-circle" size={30} color="red" />
  </View>
);

const CrowdfundingMarker = () => (
  <View>
    <MaterialCommunityIcons name="hand-heart" size={30} color="green" />
  </View>
);

const CommunityMarker = () => (
  <View>
    <MaterialCommunityIcons name="account-group" size={30} color="blue" />
  </View>
);

export default function Explore() {
  // State declarations remain the same
  const [mapRegion, setMapRegion] = useState({
    latitude: 19.304790,
    longitude: 72.848490,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 19.304790,
    longitude: 72.848490,
    accuracy: null,
    timestamp: null
  });
  
  const [radius, setRadius] = useState(2000);
  const [errorMsg, setErrorMsg] = useState('');
  const [nearbyLocations, setNearbyLocations] = useState({
    issues: [],
    crowd: [],
    communities: []
  });
  const [showUserLocation, setShowUserLocation] = useState(false);
  const theme = useTheme();

  // fetchNearbyLocations function remains the same
  const fetchNearbyLocations = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://30rm3zfj-3000.inc1.devtunnels.ms/explore?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setNearbyLocations(data);
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
      setErrorMsg('Failed to fetch nearby locations');
    }
  };

  // userLocation function remains the same
  const userLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission Denied to access location');
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({ 
        accuracy: LocationAccuracy.Balanced
      });
      
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      });
      
      const newRegion = {
        ...mapRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setMapRegion(newRegion);
      setShowUserLocation(true);
      fetchNearbyLocations(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Failed to get location');
    }
  };

  // Zoom functions remain the same
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

  // Updated openNavigation function
  const openNavigation = (latitude, longitude) => {
    let urlParams = new URLSearchParams({
      api: '1',
      destination: `${latitude},${longitude}`
    });

    if (currentLocation.latitude && currentLocation.longitude) {
      urlParams.append('origin', `${currentLocation.latitude},${currentLocation.longitude}`);
    }

    const url = `https://www.google.com/maps/dir/?${urlParams.toString()}`;
    Linking.openURL(url).catch(err => console.error('Error opening navigation:', err));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <MapView 
        style={{ flex: 1 }} 
        region={mapRegion}
      >
        {showUserLocation && currentLocation.latitude && (
          <Circle
            center={{ 
              latitude: currentLocation.latitude, 
              longitude: currentLocation.longitude 
            }}
            radius={radius || 800}
            strokeColor="rgba(255, 0, 0, 0.5)"
            fillColor="rgba(255, 0, 0, 0.2)"
          />
        )}

        {nearbyLocations.issues[0] && nearbyLocations.issues.map((location) => (
          <Marker
            key={`issue-${location.issueNumber}`}
            coordinate={{ 
              latitude: location.location.coordinates[1], 
              longitude: location.location.coordinates[0] 
            }}
            title={location.issueName}
            description={location.issueDescription}
            onPress={() => openNavigation(
              location.location.coordinates[1], 
              location.location.coordinates[0]
            )}
          >
            <IssueMarker />
          </Marker>
        ))}

        {nearbyLocations.crowd[0] && nearbyLocations.crowd.map((location) => (
          <Marker
            key={`crowd-${location.clanTag}`}
            coordinate={{ 
              latitude: location.location.coordinates[1], 
              longitude: location.location.coordinates[0] 
            }}
            title={location.clanName}
            description={location.description}
            onPress={() => openNavigation(
              location.location.coordinates[1], 
              location.location.coordinates[0]
            )}
          >
            <CrowdfundingMarker />
          </Marker>
        ))}

        {nearbyLocations.communities[0] && nearbyLocations.communities.map((location) => (
          <Marker
            key={`community-${location.projectNumber}`}
            coordinate={{ 
              latitude: location.location?.latitude || 0, 
              longitude: location.location?.longitude || 0 
            }}
            title={location.projectName}
            description={location.projectDescription}
            onPress={() => openNavigation(
              location.location?.latitude, 
              location.location?.longitude
            )}
          >
            <CommunityMarker />
          </Marker>
        ))}
      </MapView>

      <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-around' }}>
        <FAB
          style={{ backgroundColor: theme.colors.primary }}
          small
          icon={() => <MaterialCommunityIcons name="plus" size={24} color="white" />}
          onPress={zoomIn}
        />
        <FAB
          style={{ backgroundColor: theme.colors.primary }}
          small
          icon={() => <MaterialCommunityIcons name="minus" size={24} color="white" />}
          onPress={zoomOut}
        />
        <Button
          mode="contained"
          style={{ backgroundColor: theme.colors.primary, borderRadius: 8 }}
          onPress={userLocation}
          icon={() => <MaterialCommunityIcons name="crosshairs-gps" size={24} color="white" />}
        >
          Get Location
        </Button>
      </View>
    </SafeAreaView>
  );
}