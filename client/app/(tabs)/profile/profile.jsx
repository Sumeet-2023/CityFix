import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { TabView, TabBar } from "react-native-tab-view";
import { COLORS, images, FONTS, SIZES } from "../../../constants";
import { photos } from "../../../constants/data";
import { router } from "expo-router";
import { auth } from "../../../firebaseConfig";

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
const ProfileActions = () => (
  <View style={styles.buttons}>
    <TouchableOpacity style={styles.button} onPress={() => router.push('profile/editProfile')}>
      <Text style={styles.buttonText}>Edit Profile</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Share Profile</Text>
    </TouchableOpacity>
  </View>
);

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

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser((prev) => ({
        ...prev,
        name: currentUser.displayName || 'Unknown User',
        photoURL: currentUser.photoURL || null,
      }));
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.black} />
      <ScrollView>
        <View style={styles.header}>
          <Image source={images.cover} resizeMode="cover" style={styles.coverImage} />
        </View>
        <ProfileHeader user={user} />
        <ProfileActions />
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
  },
  profileInfo: {
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    width: '100%',
    maxWidth: 600,
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
  },
  buttonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  tabsContainer: {
    width: '100%',
    maxWidth: 800,
    height: 500,
  },
  tabBar: {
    backgroundColor: COLORS.white,
    height: 44,
  },
  tabIndicator: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    color: '#4A4A4A',
    ...FONTS.body4,
  },
  tabLabelFocused: {
    color: COLORS.black,
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
    padding: 2,
  },
  photo: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    borderRadius: 12,
  },
  likeItem: {
    // Style for like item
  },
});

export default Profile;
