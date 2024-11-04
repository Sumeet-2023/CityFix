import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  ScrollView,
  Share
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { TabView, TabBar } from "react-native-tab-view";
import { COLORS, images, FONTS, SIZES } from "../../../constants";
import { photos } from "../../../constants/data";
import { router } from "expo-router";
import { auth } from "../../../firebaseConfig";
import { useAuthStore } from "../../store";

// Component for displaying user profile information
const ProfileHeader = ({ user }) => (
  <View style={styles.profileInfo}>
    <Image
      source={user.photoURL ? { uri: user.photoURL } : images.defaultProfile}
      resizeMode="cover"
      style={styles.profileImage}
    />
    <Text style={styles.name}>{user.name || 'Unknown User'}</Text>
    <Text style={styles.profession}>{user.profession}</Text>
    <View style={styles.location}>
      <MaterialIcons name="location-on" size={24} color={COLORS.primary} />
      <Text style={styles.locationText}>{user.location}</Text>
    </View>
    <View style={styles.stats}>
      {["followers", "following", "likes"].map((key) => (
        <View key={key} style={styles.statItem}>
          <Text style={styles.statNumber}>
            {key === "likes" ? user.likes.toLocaleString() : user[key]}
          </Text>
          <Text style={styles.statLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
        </View>
      ))}
    </View>
  </View>
);

// Component for profile action buttons
const ProfileActions = ({user}) => {
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out ${user.name}'s profile on our platform!`,
      });

      if (result && result.action) {
        if (result.action === Share.sharedAction) {
          console.log('Shared successfully!');
        } else if (result.action === Share.dismissedAction) {
          console.log('Share dismissed');
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.buttons}>
      <TouchableOpacity style={styles.button} onPress={() => router.push('profile/editProfile')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Share Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

// Component for TabView
const TabViewContainer = ({ index, setIndex, layout }) => {
  const routes = useMemo(
    () => [
      { key: 'photos', title: 'Photos' },
      { key: 'likes', title: 'Likes' },
    ],
    []
  );

  const renderScene = ({ route }) => {
    if (route.key === 'photos') {
      return (
        <ScrollView contentContainerStyle={styles.photoScrollContainer}>
          <View style={styles.photosContainer}>
            {photos.map((item, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={item} style={styles.photo} />
              </View>
            ))}
          </View>
        </ScrollView>
      );
    } else if (route.key === 'likes') {
      return (
        <View style={styles.likeItem}>
          {/* Implement your like rendering logic */}
        </View>
      );
    }
    return null;
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={styles.tabIndicator}
          style={styles.tabBar}
          renderLabel={({ focused, route }) => (
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
              {route.title}
            </Text>
          )}
          tabStyle={styles.tabStyle} // Add custom tabStyle
        />
      )}
    />
  );
};

// Main Profile component
const Profile = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState({
    name: '',
    profession: 'Interior Design',
    location: 'Lagos, Nigeria',
    followers: 10,
    following: 10,
    likes: 100,
    photoURL: null,
  });

  const {user: currentUser} = useAuthStore();
  useEffect(() => {
    if (currentUser) {
      setUser((prev) => ({
        ...prev,
        name: currentUser.username || 'Unknown User',
        photoURL: currentUser.profileUrl || null,
      }));
      console.log(currentUser);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={images.cover} resizeMode="cover" style={styles.coverImage} />
        </View>
        <ProfileHeader user={user} />
        <ProfileActions user={user}/>
        <View style={styles.tabsContainer}>
          <TabViewContainer index={index} setIndex={setIndex} layout={layout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    width: "100%",
  },
  coverImage: {
    height: 228,
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  profileInfo: {
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    width: '100%',
    maxWidth: 600,
    marginTop: -50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly translucent background
    borderRadius: 15,
    elevation: 2, // Add shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignSelf: 'center', // Center the profile info
  },
  profileImage: {
    height: 155,
    width: 155,
    borderRadius: 999,
    borderColor: COLORS.primary,
    borderWidth: 2,
    marginTop: -77,
  },
  name: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginVertical: 8,
  },
  profession: {
    ...FONTS.body4,
    color: COLORS.black,
  },
  location: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "center",
  },
  locationText: {
    ...FONTS.body4,
    marginLeft: 4,
    color: COLORS.primary,
  },
  stats: {
    flexDirection: "row",
    paddingVertical: 8,
    justifyContent: 'center',
    width: '100%',
  },
  statItem: {
    alignItems: "center",
    marginHorizontal: SIZES.padding,
  },
  statNumber: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: 'center',
    width: '100%',
    marginVertical: SIZES.padding,
  },
  button: {
    width: 124,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginHorizontal: SIZES.padding,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  tabsContainer: {
    width: '100%',
    maxWidth: 800,
    height: 500,
    alignSelf: 'center', // Center the TabView container
  },
  tabBar: {
    backgroundColor: COLORS.white,
    height: 44,
    elevation: 2,
  },
  tabStyle: {
    flex: 1, // Allow tabs to take up equal space
    justifyContent: 'center', // Center the label vertically
  },
  tabIndicator: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    color: '#4A4A4A',
    ...FONTS.body4,
    textAlign: 'center', // Center align text
    width: 50,
  },
  tabLabelFocused: {
    color: COLORS.black,
    fontWeight: 'bold', // Emphasize the focused tab
  },
  photoScrollContainer: {
    padding: 10,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  photoItem: {
    width: '33.3%', // Adjust width based on the number of columns
    padding: 5, // Adjust padding for spacing between photos
  },
  photo: {
    width: "100%",
    height: 100, // Set a fixed height to make it square
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray, // Optional border color for aesthetics
  },
  likeItem: {
    // Style for like item
  },
});

export default Profile;
