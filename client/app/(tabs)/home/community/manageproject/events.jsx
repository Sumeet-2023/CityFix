import React, { useEffect, useState } from "react";
import { View, FlatList, Share, Linking, Platform, RefreshControl } from "react-native";
import { Card, Text, Button, Dialog, Portal, Paragraph  } from "react-native-paper";
import FAB from "../../../../../components/FAB";
import { useAuthStore } from "../../../../store";
import { serverurl } from "../../../../../firebaseConfig";
import { router } from "expo-router";
import { Chip, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import EventDetailsModal from "../../../../../components/event/details";
import * as Location from 'expo-location';
import { LocationAccuracy } from 'expo-location';
import axios from "axios";
import * as Calendar from "expo-calendar";
import * as Notifications from 'expo-notifications';

export default function ManageEventsScreen() {
    const { user, communityId, projectId } = useAuthStore();
    const [events, setEvents] = useState(null);
    const [currentLocation, setCurrentLocation] = useState({
        latitude: 19.304790,
        longitude: 72.848490,
        accuracy: null,
        timestamp: null
    });

    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchEvents = async () => {
        try {
            setRefreshing(true);
            const res = await axios.get(`${serverurl}/event/project/${projectId}`);
            setEvents(res.data);
            setRefreshing(false);
        } catch (error) {
            console.log(`Error fetching events for this project: ${error}`);
            setRefreshing(false);
        }
    };

    const shareEvent = async (event) => {
        try {
            await Share.share({
                message: `Check out this event: ${event.eventName}\n\nDetails:\n${event.description}\nLocation: ${event.location.city}, ${event.location.state}, ${event.location.country}\n\nStarts: ${new Date(event.startDateTime).toLocaleString()}\nEnds: ${new Date(event.endDateTime).toLocaleString()}`,
            });
        } catch (error) {
            console.error("Error sharing event:", error);
        }
    };

    const saveEventToCalendar = async (event) => {
        try {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === "granted") {
                const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

                if (!calendars || calendars.length === 0) {
                    alert("No calendars found on this device.");
                    return;
                }

                const writableCalendar = calendars.find((cal) => cal.allowsModifications) || calendars[0];

                if (!writableCalendar) {
                    alert("No writable calendar found.");
                    return;
                }

                const eventId = await Calendar.createEventAsync(writableCalendar.id, {
                    title: event.eventName,
                    startDate: new Date(event.startDateTime),
                    endDate: new Date(event.endDateTime),
                    location: `${event.location.city}, ${event.location.state}, ${event.location.country}`,
                    notes: event.description,
                });

                if (eventId) {
                    alert("Event added to your calendar!");
                    const {status: existingStatus} = await Notifications.getPermissionsAsync();
                    let finalStatus = existingStatus;
                    if (existingStatus !== 'granted') {
                        const { status } = await Notifications.requestPermissionsAsync();
                        finalStatus = status;
                    }
                    if (finalStatus !== 'granted') {
                        alert('Failed to get push token for push notification!');
                        return;
                    }

                    const reminderTime = new Date(event.startDateTime).getTime() - 30 * 60 * 1000;
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: `Reminder: ${event.eventName}`,
                            body: `Don't forget about the event at ${event.location.city}, ${event.location.state}`,
                        },
                        trigger: {
                            seconds: (reminderTime - Date.now()) / 1000,
                        },
                    });

                    // const eventURL = Platform.OS === "ios"
                    //     ? `calshow:${new Date(event.startDateTime).getTime() / 1000}`
                    //     : `content://com.android.calendar/events/${eventId}`;

                    // Linking.openURL(eventURL).catch((error) =>
                    //     console.error("Error opening calendar:", error)
                    // );
                }
            } else {
                alert("Calendar permissions are required to add events.");
            }
        } catch (error) {
            console.error("Error saving event to calendar:", error);
        }
    };

    const openNavigation = (location) => {
        const { latitude, longitude } = location.coordinates ? { latitude: location.coordinates[1], longitude: location.coordinates[0] } : {};
        if (latitude && longitude) {
            let urlParams = new URLSearchParams({
                api: '1',
                destination: `${latitude},${longitude}`
            });

            if (currentLocation.latitude && currentLocation.longitude) {
                urlParams.append('origin', `${currentLocation.latitude},${currentLocation.longitude}`);
            }

            const url = `https://www.google.com/maps/dir/?${urlParams.toString()}`;
            Linking.openURL(url).catch((error) =>
                console.error("Error opening navigation:", error)
            );
        } else {
            alert("Location not available for navigation.");
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
        } catch (error) {
            console.error('Error getting location:', error);
            setErrorMsg('Failed to get location');
        }
    };

    useEffect(() => {
        fetchEvents();
        userLocation();
    }, []);

    const handleViewEvent = (event) => {
        setSelectedEvent(event);
        setViewModalVisible(true);
    };

    const showDeleteDialog = (event) => {
        setEventToDelete(event);
        setDeleteDialogVisible(true);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
        setEventToDelete(null);
    };

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`${serverurl}/event/${eventToDelete.id}`);
            if (res.status === 201) {
                fetchEvents();
            } else {
                console.log('Error deleting event');
            }
        } catch (error) {
            console.log(`Error deleting event: ${error}`);
        }
        hideDeleteDialog();
    };

    const renderEvent = ({ item }) => {
        const { location, status, eventName, description, startDateTime, endDateTime } = item;

        const locationDisplay = location
            ? `${location.city}, ${location.state}, ${location.country}`
            : "No location provided";

        const formattedStartDate = new Date(startDateTime).toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        const formattedEndDate = new Date(endDateTime).toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const statusColor =
            status === "ONGOING" ? "green" : status === "SCHEDULED" ? "blue" : "gray";

        return (
            <Card className="my-2 mx-4 shadow-md rounded-lg overflow-hidden">
                <Card.Content className="bg-white py-3 px-4">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-semibold text-gray-800">{eventName}</Text>
                        <Chip
                            textStyle={{ color: "white", fontWeight: "bold" }}
                            style={{
                                backgroundColor: statusColor,
                                marginLeft: 8,
                            }}
                        >
                            {status}
                        </Chip>
                    </View>
                    <Text className="text-sm mt-2 text-gray-600">{description}</Text>
                </Card.Content>

                <Divider />
                <Card.Content className="bg-gray-50 py-3 px-4">
                    <View className="flex-row items-center mb-2">
                        <MaterialIcons name="place" size={20} color="#4F46E5" />
                        <Text className="text-sm text-gray-500">
                        Location: {locationDisplay}
                        </Text>
                    </View>
                    <View className="flex-row items-center mb-2">
                        <MaterialIcons name="event" size={20} color="#4F46E5" />
                        <Text className="ml-2 text-sm text-gray-700 font-semibold">Event Date:</Text>
                        <Text className="ml-1 text-sm text-gray-600">{formattedStartDate.split(",")[0]} - {formattedEndDate.split(",")[0]}</Text>
                    </View>

                    <View className="flex-row items-center">
                        <MaterialIcons name="access-time" size={20} color="#4F46E5" />
                        <Text className="ml-2 text-sm text-gray-700 font-semibold">Event Time:</Text>
                        <Text className="ml-1 text-sm text-gray-600">
                            {formattedStartDate.split(",")[1].trim()} - {formattedEndDate.split(",")[1].trim()}
                        </Text>
                    </View>
                </Card.Content>

                <Divider />
                <Card.Actions style={{ backgroundColor: 'white', flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 8 }}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
                        <View style={{ width: "33%", padding: 4 }}>
                            <Button mode="contained" buttonColor="#4F46E5" textColor="white" icon="eye" onPress={() => handleViewEvent(item)}>
                                View
                            </Button>
                        </View>
                        <View style={{ width: "33%", padding: 4 }}>
                            <Button mode="contained" buttonColor="#0284C7" textColor="white" icon="pencil" onPress={() => router.push(`/(modals)/editEvent?id=${item?.id}`)}>
                                Edit
                            </Button>
                        </View>
                        <View style={{ width: "33%", padding: 4 }}>
                            <Button mode="contained" buttonColor="#EF4444" textColor="white" icon="delete" onPress={() => showDeleteDialog(item)}>
                                Delete
                            </Button>
                        </View>

                        <View style={{ width: "33%", padding: 4 }}>
                            <Button mode="contained" buttonColor="#10B981" textColor="white" icon="share-variant" onPress={() => shareEvent(item)}>
                                Share
                            </Button>
                        </View>
                        <View style={{ width: "33%", padding: 4 }}>
                            <Button mode="outlined" textColor="#2563EB" icon="calendar" onPress={() => saveEventToCalendar(item)}>
                                Save
                            </Button>
                        </View>
                        <View style={{ width: "33%", padding: 4 }}>
                            <Button mode="outlined" textColor="#16A34A" icon="navigation" onPress={() => openNavigation(location)}>
                                Go
                            </Button>
                        </View>
                    </View>
                </Card.Actions>
            </Card>
        );
    };

    return (
        <View className="flex-1 bg-gray-200">
            {events && (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={renderEvent}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={fetchEvents}/>
                    }
                />
            )}

            <Portal>
                <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog}>
                    <Dialog.Title>Delete Event</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Are you sure you want to delete "{eventToDelete?.eventName}"? This action cannot be undone.
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDeleteDialog}>Cancel</Button>
                        <Button onPress={handleDelete} textColor="#EF4444">Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <EventDetailsModal 
                visible={viewModalVisible}
                onDismiss={() => {
                    setViewModalVisible(false);
                    setSelectedEvent(null);
                }}
                event={selectedEvent}
            />

            <FAB handlePress={() => router.push('/(modals)/createEvent')}/>
        </View>
    );
}