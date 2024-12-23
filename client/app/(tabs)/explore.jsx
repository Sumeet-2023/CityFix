import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Linking } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { LocationAccuracy } from 'expo-location';
import { 
  FAB, 
  useTheme, 
  Text,
  Card,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FoldableLegend from '../../components/map/foldableLegend';
import ClanSearch from '../../components/map/clanSearch';
import { serverurl } from '../../firebaseConfig';

const MARKER_COLORS = {
  issue: '#1565C0',      // Darker blue
  crowdfunding: '#2196F3', // Medium blue
  community: '#64B5F6'    // Light blue
};

const CustomMarker = ({ type, size = 30 }) => {
  const icons = {
    issue: 'alert-circle',
    crowdfunding: 'hand-heart',
    community: 'account-group'
  };

  return (
    <View className="items-center">
      <View className="bg-white rounded-full p-1 shadow-lg">
        <MaterialCommunityIcons 
          name={icons[type]} 
          size={size} 
          color={MARKER_COLORS[type]} 
        />
      </View>
      {/* Pointed triangle below the marker */}
      <View 
        className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent"
        style={{ 
          borderTopColor: 'white',
          marginTop: -1 // Overlap slightly with the circle above
        }} 
      />
    </View>
  );
};

export default function Explore() {
  const theme = useTheme();
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

  const [searchLocation, setSearchLocation] = useState(null);
  const [searchLocationDetails, setSearchLocationDetails] = useState(null);
  
  const [radius, setRadius] = useState(400000);
  const [errorMsg, setErrorMsg] = useState('');
  const [nearbyLocations, setNearbyLocations] = useState({
    issues: [],
    clan: [],
    communities: []
  });
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const handleClanSelect = ({ latitude, longitude, name, description }) => {
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.02, // Zoom in closer when selecting a clan
      longitudeDelta: 0.02,
    };
    setMapRegion(newRegion);
    setSearchLocation({ latitude, longitude });
    setSearchLocationDetails({ name, description });
  };

  const fetchNearbyLocations = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `${serverurl}/explore?latitude=${latitude}&longitude=${longitude}&radius=${radius/1000}`
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

  const handleMarkerPress = (issue) => {
    setSelectedIssue(issue.issueNumber === selectedIssue ? null : issue.issueNumber);
  };

  return (
    <SafeAreaView className="flex-1">
      <ClanSearch onClanSelect={handleClanSelect} />
      <MapView 
        provider={PROVIDER_GOOGLE}
        className="flex-1" 
        region={mapRegion}
        customMapStyle={mapStyle}
      >
        {showUserLocation && currentLocation.latitude && (
          <Circle
            center={{ 
              latitude: currentLocation.latitude, 
              longitude: currentLocation.longitude 
            }}
            radius={radius}
            strokeColor="rgba(33, 150, 243, 0.5)"
            fillColor="rgba(33, 150, 243, 0.1)"
          />
        )}

        {searchLocation && searchLocationDetails &&  (
          <Marker
            coordinate={searchLocation}
            title={searchLocationDetails.name}
            description={searchLocationDetails.description}
          >
            <CustomMarker type="community" />
          </Marker>
        )}

        {nearbyLocations.issues.map((location) => (
          <Marker
            key={`issue-${location.issueNumber}`}
            coordinate={{ 
              latitude: location.location.coordinates[1], 
              longitude: location.location.coordinates[0] 
            }}
            onPress={() => handleMarkerPress(location)}
            title={location.issueName}
          >
            <CustomMarker type="issue" />
          </Marker>
        ))}

        {nearbyLocations.clan.map((location) => (
          <Marker
            key={`clan-${location.clanTag}`}
            coordinate={{ 
              latitude: location.location.coordinates[1], 
              longitude: location.location.coordinates[0] 
            }}
            onPress={() => handleMarkerPress(location)}
            title={location.clanName}
          >
            <CustomMarker type="crowdfunding" />
          </Marker>
        ))}

        {nearbyLocations.communities.map((community, index) => (
          <Marker
            key={`community-${community.id || index}`}
            coordinate={{ 
              latitude: community.location?.latitude || 0, 
              longitude: community.location?.longitude || 0 
            }}
            onPress={() => handleMarkerPress(location)}
            title={community.communityName}
          >
            <CustomMarker type="community" />
          </Marker>
        ))}
      </MapView>

      {/* Location FAB */}
      <FAB
        icon="crosshairs-gps"
        size='small'
        className="absolute bottom-16 right-4 bg-blue-600"
        onPress={userLocation}
        color="white"
      />

      {/* Control Panel */}
      <View className="absolute bottom-28 right-4 flex flex-col items-center gap-2">
        <FAB
          icon="plus"
          size="small"
          className="bg-blue-600 h-10 w-10"
          onPress={zoomIn}
          color="white"
        />
        <FAB
          icon="minus"
          size="small"
          className="bg-blue-600 h-10 w-10"
          onPress={zoomOut}
          color="white"
        />
      </View>

      {/* Legend */}
      <View className="absolute right-3 bottom-52">
        <FoldableLegend />
      </View>

      {errorMsg ? (
        <Card className="absolute bottom-20 left-4 right-4 bg-red-50">
          <Card.Content>
            <Text className="text-red-800">{errorMsg}</Text>
          </Card.Content>
        </Card>
      ) : null}
    </SafeAreaView>
  );
}

const mapStyle = [
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e9e9e9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];