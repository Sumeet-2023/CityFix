import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import { useAuthStore } from '../store'; // Import useAuthStore for user information
import axios from 'axios';
import { serverurl } from '../../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const NotificationScreen = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return; // Wait until the user is available
      try {
        const response = await axios.get(`${serverurl}/notification/user/${user.id}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [user]);

  const newNotifications = notifications.filter(notification => !notification.isRead);
  const oldNotifications = notifications.filter(notification => notification.isRead);

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold mb-4">Notifications</Text>

        {/* Check if there are any notifications */}
        {notifications.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-10">
            <MaterialIcons name="notifications-none" size={80} color="#ccc" />
            <Text className="text-lg text-gray-500 mt-4">You have no notifications yet</Text>
            <Text className="text-gray-400 mt-2">We'll keep you updated!</Text>
          </View>
        ) : (
          <>
            {/* New Notifications */}
            {newNotifications.length > 0 && (
              <>
                <Text className="text-xl font-bold mb-2">New</Text>
                {newNotifications.map(notification => (
                  <List.Item
                    key={notification._id}
                    title={
                      <View className="flex-row flex-wrap">
                        <Text className="font-bold">{user.username} </Text>
                        <Text className="flex-shrink">{notification.message}</Text>
                      </View>
                    }
                    description={new Date(notification.createdAt).toLocaleString()} // Format createdAt date
                    left={() => (
                      <Avatar.Image
                        size={40}
                        source={
                          notification.avatar
                            ? { uri: notification.avatar }
                            : require('../../assets/images/pothole.jpg')
                        }
                      />
                    )}
                    right={() => (
                      <View>
                        {!notification.isRead && (
                          <View className="w-2.5 h-2.5 rounded-full bg-blue-500 self-center" />
                        )}
                      </View>
                    )}
                    className="bg-white mb-2"
                  />
                ))}
              </>
            )}

            {/* Older Notifications */}
            {oldNotifications.length > 0 && (
              <>
                <Text className="text-xl font-bold mb-2">Today</Text>
                {oldNotifications.map(notification => (
                  <List.Item
                    key={notification._id}
                    title={
                      <View className="flex-row flex-wrap">
                        <Text className="font-bold">{user.username} </Text>
                        <Text className="flex-shrink">{notification.message}</Text>
                      </View>
                    }
                    description={new Date(notification.createdAt).toLocaleString()} // Format createdAt date
                    left={() => (
                      <Avatar.Image
                        size={40}
                        source={
                          notification.avatar
                            ? { uri: notification.avatar }
                            : require('../../assets/images/pothole.jpg')
                        }
                      />
                    )}
                    className="bg-white mb-2"
                  />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;