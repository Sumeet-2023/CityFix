import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {createUserWithEmailAndPassword} from "firebase/auth"
import {auth} from "../../firebaseConfig"
import { router } from 'expo-router'

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSignUp = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // Navigate to Home Screen after successful signup
        router.push('/home');
      } catch (error) {
        console.error("Error signing up: ", error.message);
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Sign up to CityFix</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSignUp} >
             <Text>
            Sign Up
            </Text>
        </TouchableOpacity>
        <Text
          style={styles.link}
          onPress={() => router.push('/sign-in')}
        >
          Have an account already? Sign In
        </Text>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    link: {
      marginTop: 20,
      color: '#007bff',
      textAlign: 'center',
    },
  });

export default SignUp
