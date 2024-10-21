import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="home/home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={32} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notification',
          tabBarIcon: ({ color }) => <MaterialIcons name="notifications-on" size={28} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile/profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile/editProfile"
        options={{
          headerTitle: 'Edit Profile',
          tabBarButton: () => null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('profile/profile')} style={{ marginLeft: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/settings')} style={{ marginRight: 10 }}>
              <MaterialIcons name="settings" size={24} color="black" />
            </TouchableOpacity>
          ),
          
        }}
      />
      <Tabs.Screen
        name="home/report"
        options={{
          headerTitle: 'Report Issue',
          tabBarButton: () => null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/settings')} style={{ marginRight: 10 }}>
              <MaterialIcons name="settings" size={24} color="black" />
            </TouchableOpacity>
          ),
          
        }}
      />
      <Tabs.Screen
        name="home/community"
        options={{
          headerTitle: 'Community Project',
          tabBarButton: () => null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/settings')} style={{ marginRight: 10 }}>
              <MaterialIcons name="settings" size={24} color="black" />
            </TouchableOpacity>
          ),
          
        }}
      />
      <Tabs.Screen
        name="home/crowd"
        options={{
          headerTitle: 'Crowdsourced Fund',
          tabBarButton: () => null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/settings')} style={{ marginRight: 10 }}>
              <MaterialIcons name="settings" size={24} color="black" />
            </TouchableOpacity>
          ),
          
        }}
      />
    </Tabs>
  );
}