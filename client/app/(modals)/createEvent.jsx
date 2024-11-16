import React, { useState } from 'react';
import { View, Text, Modal, Alert, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme, Surface, List, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../store';
import EventHeader from '../../components/event/eventHeader';
import { DatePickerModal, TimePickerModal, en, registerTranslation } from 'react-native-paper-dates';
import { Minus } from 'lucide-react-native';
import { serverurl, openroutekey } from '../../firebaseConfig';
import { router } from 'expo-router';

registerTranslation("en", en);

const enhancedTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4F46E5',
    accent: '#818CF8',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1E293B',
    placeholder: '#64748B',
  },
  roundness: 16,
};

const CreateEvent = () => {
    const { user, projectId, communityId } = useAuthStore();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [range, setRange] = useState({ startDate: undefined, endDate: undefined });
    const [showRangePicker, setShowRangePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [startDateTime, setStartDateTime] = useState(new Date());
    const [endDateTime, setEndDateTime] = useState(new Date());
    const [location, setLocation] = useState({
      type: 'Point',
      coordinates: [-118.2437, 34.0522],
      city: 'Los Angeles',
      country: 'USA',
    });
    const [locationQuery, setLocationQuery] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showMap, setShowMap] = useState(false);

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const fetchLocationSuggestions = async () => {
        if (locationQuery.trim().length === 0) {
        setLocationSuggestions([]);
        return;
        }
        try {
        const response = await axios.get(
            `https://api.openrouteservice.org/geocode/autocomplete?api_key=${openroutekey}&text=${locationQuery}`
        );
        setLocationSuggestions(response.data.features || []);
        } catch (error) {
        console.error('Error fetching location suggestions:', error.message);
        }
    };

    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation({
        ...location,
        type: 'Point',
        coordinates: [longitude, latitude],
        });
    };

    const handleMarkerDrag = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation({
        ...location,
        type: 'Point',
        coordinates: [longitude, latitude],
        });
        setLocationQuery('');
    };

    const handleMapClose = async () => {
        setShowMap(false);
        try {
        const res = await axios.get(
            `https://api.openrouteservice.org/geocode/reverse?api_key=${openroutekey}&point.lon=${location.coordinates[0]}&point.lat=${location.coordinates[1]}`
        );
        const locationData = res.data.features[0].properties;
        setLocation({
            ...location,
            country: locationData.country || '',
            city: locationData.locality || '',
            state: locationData.region || '',
        });
        } catch (error) {
        console.error('Error fetching reverse geocode:', error.message);
        }
    };

    const handleRangeChange = (date) => {
        setShowRangePicker(false);
        setRange(date);
        setStartDateTime(date.startDate);
        setEndDateTime(date.endDate);
    };

    const handleStartTimeChange = (time) => {
        setShowStartTimePicker(false);
        const newDate = new Date(startDateTime);
        newDate.setHours(time.hours);
        newDate.setMinutes(time.minutes);
        setStartDateTime(newDate);
    };

    const handleEndTimeChange = (time) => {
        setShowEndTimePicker(false);
        const newDate = new Date(endDateTime);
        newDate.setHours(time.hours);
        newDate.setMinutes(time.minutes);
        setEndDateTime(newDate);
    };

    const handleSubmit = async () => {
        if (!name.trim() || !description.trim() || !startDateTime || !endDateTime) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
        }

        try {
        const eventData = {
            eventName: name,
            userId: user.id,
            description,
            startDateTime,
            endDateTime,
            location,
        };
        const response = await axios.post(`${serverurl}/event/project/${projectId}`, eventData);

        if (response.status === 201) {
            Alert.alert('Success', 'Event Created Successfully!');
            router.push('/home/community/manageproject/events');
        }
        } catch (error) {
        console.error('Error creating event:', error.message);
        Alert.alert('Error', 'Failed to create an event');
        }
    };

    return (
        <PaperProvider theme={enhancedTheme}>
        <SafeAreaView className="flex-1 bg-gray-50">
            <EventHeader Heading={'Create Event'}/>
            <ScrollView>
            <LinearGradient
                colors={['#4F46E5', '#818CF8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-8 pt-12 pb-16 rounded-b-[40px] shadow-lg"
            >
                <View className="items-center">
                <Text className="text-4xl font-bold text-white text-center mb-3">Create Event</Text>
                <Text className="text-lg text-indigo-100 text-center opacity-90">
                    Organize your event with ease
                </Text>
                </View>
            </LinearGradient>

            <View className="px-4 -mt-8">
                <Surface className="rounded-3xl p-6 mb-6 elevation-4 bg-white">
                    <TextInput
                        mode="outlined"
                        label="Event Name"
                        value={name}
                        onChangeText={setName}
                        className="bg-white mb-4"
                        placeholder="Enter a memorable event name"
                        outlineColor="#E2E8F0"
                        activeOutlineColor="#4F46E5"
                    />

                    <TextInput
                        mode="outlined"
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        className="bg-white mb-4 h-32"
                        placeholder="Describe your event"
                        outlineColor="#E2E8F0"
                        activeOutlineColor="#4F46E5"
                    />

                    <View className="mb-4">
                    {/* Date Range and Time Picker Icons */}
                        <View className="flex-row items-center justify-end space-x-2">
                            <IconButton
                                mode="outlined"
                                onPress={() => setShowRangePicker(true)}
                                icon={'calendar'}
                                size={24}
                            />
                            <View className="flex-row items-center">
                                <IconButton
                                    mode="outlined"
                                    onPress={() => setShowStartTimePicker(true)}
                                    icon={'clock-outline'}
                                    size={24}
                                />
                                <View className="mx-2">
                                    <Minus size={20} color="#64748B" />
                                </View>
                                <IconButton
                                    mode="outlined"
                                    onPress={() => setShowEndTimePicker(true)}
                                    icon={'clock-outline'}
                                    size={24}
                                />
                            </View>
                        </View>
                        
                        {/* Date and Time Display */}
                        <View className="mt-2">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-sm text-gray-600">Start:</Text>
                                <Text className="text-sm font-medium text-gray-800">
                                    {formatDateTime(startDateTime)}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm text-gray-600">End:</Text>
                                <Text className="text-sm font-medium text-gray-800">
                                    {formatDateTime(endDateTime)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Surface>

                <Surface className="rounded-3xl p-6 mb-6 elevation-4 bg-white">
                <Button
                    mode="contained"
                    icon="map-marker"
                    onPress={() => setShowMap(true)}
                    className="mb-3"
                    contentStyle={{ height: 50 }}
                    labelStyle={{ fontSize: 16, fontWeight: '600' }}
                >
                    Select Location
                </Button>
                <Text className="text-center text-gray-600">
                    {location.city ? `📍 ${location.city}, ${location.country}` : 'Location not set'}
                </Text>
                </Surface>

                <View className="mb-12">
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={{width: "80%", alignSelf: 'center'}}
                    contentStyle={{ height: 50 }}
                >
                    Create Event
                </Button>
                </View>
            </View>
            </ScrollView>

            
            {/* Date Range Picker Modal */}
            <DatePickerModal
            locale='en'
            mode="range"
            visible={showRangePicker}
            onDismiss={() => setShowRangePicker(false)}
            startDate={range.startDate}
            endDate={range.endDate}
            onConfirm={handleRangeChange}
            />

            {/* Start Time Picker Modal */}
            <TimePickerModal
            visible={showStartTimePicker}
            onDismiss={() => setShowStartTimePicker(false)}
            onConfirm={handleStartTimeChange}
            hours={startDateTime.getHours()}
            minutes={startDateTime.getMinutes()}
            />

            {/* End Time Picker Modal */}
            <TimePickerModal
            visible={showEndTimePicker}
            onDismiss={() => setShowEndTimePicker(false)}
            onConfirm={handleEndTimeChange}
            hours={endDateTime.getHours()}
            minutes={endDateTime.getMinutes()}
            />

            {/* Map Modal */}
            <Modal visible={showMap} animationType="slide">
                <View className="flex-1 bg-white">
                <View className="p-4">
                    <TextInput
                    mode="outlined"
                    value={locationQuery}
                    onChangeText={setLocationQuery}
                    placeholder="Search location"
                    onEndEditing={fetchLocationSuggestions}
                    className="bg-white mb-0"
                    />
                </View>

                {locationSuggestions.length > 0 && (
                    <View className="mx-4 max-h-36 bg-white shadow rounded-lg">
                    <FlatList
                        data={locationSuggestions}
                        keyExtractor={(item) => item.properties.id}
                        renderItem={({ item }) => (
                        <List.Item
                            onPress={() => {
                            setLocation({
                                ...location,
                                type: 'Point',
                                coordinates: [
                                item.geometry.coordinates[0],
                                item.geometry.coordinates[1],
                                ],
                            });
                            setLocationQuery(item.properties.label);
                            setLocationSuggestions([]);
                            }}
                            title={item.properties.label}
                            titleNumberOfLines={2}
                            className="border-b border-gray-100"
                        />
                        )}
                    />
                    </View>
                )}

                <MapView
                    className="flex-1"
                    region={{
                    latitude: location.coordinates[1],
                    longitude: location.coordinates[0],
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                    }}
                    provider={PROVIDER_GOOGLE}
                    onPress={handleMapPress}
                >
                    <Marker
                    coordinate={{
                        latitude: location.coordinates[1],
                        longitude: location.coordinates[0],
                    }}
                    title="Community Location"
                    draggable={true}
                    onDragEnd={handleMarkerDrag}
                    />
                </MapView>

                <Button
                    mode="contained"
                    onPress={handleMapClose}
                    className="m-4"
                    contentStyle={{ height: 50 }}
                    labelStyle={{ fontSize: 16, fontWeight: '600' }}
                >
                    Confirm Location
                </Button>
                </View>
            </Modal>
        </SafeAreaView>
        </PaperProvider>
    );
};

export default CreateEvent;