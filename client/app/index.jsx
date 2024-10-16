import { Text, View, TouchableOpacity, StyleSheet,ImageBackground } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import React, { useEffect, useState } from 'react';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      
      setIsLoading(false);
      if (user) {
        // User is signed in, navigate to home
        router.push('/home');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const handleGetStarted = () => {
    // Navigate to the signup screen
    router.push('/sign-up');
  };

  return (
    <ImageBackground
      source={require('../assets/images/SDG-11.webp')} // Replace with the path to your generated image
      style={styles.backgroundImage}
    >
    <SafeAreaView style={styles.container}>
       
      <Text style={styles.title}>Welcome to CityFix!</Text>
      <Text style={styles.subTitle}>Your journey towards a better community starts here.</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000000', // White to make it visible against the background
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0E0E0E',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2E522E',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  skipText: {
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 30,
    fontSize: 16,
  },
  linkText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});