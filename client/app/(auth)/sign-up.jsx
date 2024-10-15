import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {createUserWithEmailAndPassword} from "firebase/auth"
import {auth} from "../../firebaseConfig"
import { router } from 'expo-router'

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async () => {
      if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return;
      }
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
        <Text style={styles.subTitle}>First create your account</Text>

        <TextInput
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        placeholderTextColor="#999" 
      />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#999" 
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#999" 
        />

        <TextInput
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#999" 
       />

        <TouchableOpacity style={styles.button} onPress={handleSignUp} >
             <Text style={styles.buttonText}>
            Sign Up
            </Text>
        </TouchableOpacity>
        <Text
        style={styles.switchText}
        onPress={() => router.push('/sign-in')}
      >
        Already have an account? <Text style={styles.linkText}>Login</Text>
      </Text>
        <View style={styles.socialLoginContainer}>
        <Text style={styles.orText}>Sign Up with</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>F</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>G</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  switchText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#777',
  },
  linkText: {
    color: '#FF6B6B',
  },
  socialLoginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  orText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ececec',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  });

export default SignUp
