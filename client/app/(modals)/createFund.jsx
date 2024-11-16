import React, { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../store';
import EventHeader from '../../components/event/eventHeader';
import { serverurl } from '../../firebaseConfig';
import { router } from 'expo-router';

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

const CreateFund = () => {
  const { user, projectId, communityId, currency } = useAuthStore();
  const [goalDescription, setGoalDescription] = useState('');
  const [amountRequired, setAmountRequired] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const amount = parseFloat(amountRequired);
    if (!amountRequired || isNaN(amount) || amount <= 0) {
      newErrors.amountRequired = 'Please enter a valid amount';
    }

    if (!goalDescription.trim()) {
      newErrors.goalDescription = 'Goal description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check the form for errors');
      return;
    }

    try {
      const fundData = {
        type: 'PROJECT',
        goalDescription: goalDescription,
        amountRequired: parseFloat(amountRequired),
        amountRaised: 0,
        dateCreated: new Date(),
        projectId: projectId,
        currency: currency ?? null
      };
      const response =  await axios.post(`${serverurl}/funding/`, fundData);

      if (response.status === 201) {
        console.log('Fund Created');
      }
      Alert.alert(
        'Success',
        'Funding campaign created successfully',
        [
          {
            text: 'View Campaign',
            onPress: () => router.push('/home/community/manageproject/funds')
          },
          {
            text: 'Create Another',
            onPress: () => {
              setGoalDescription('');
              setAmountRequired('');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create funding campaign');
      console.error('Create fund error:', error);
    }
  };

  return (
    <PaperProvider theme={enhancedTheme}>
      <SafeAreaView className="flex-1 bg-gray-50">
        <EventHeader Heading={'Create Funding Campaign'} />
        <ScrollView>
          <LinearGradient
            colors={['#4F46E5', '#818CF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-8 pt-12 pb-16 rounded-b-[40px] shadow-lg"
          >
            <View className="items-center">
              <Text className="text-4xl font-bold text-white text-center mb-3">Create Funding Campaign</Text>
              <Text className="text-lg text-indigo-100 text-center opacity-90">
                Organize your funds with ease
              </Text>
            </View>
          </LinearGradient>

          <View className="px-4 -mt-8">
            <Surface className="rounded-3xl p-6 mb-6 elevation-4 bg-white">
              <Text className="text-lg font-semibold text-gray-800 mb-2">Amount Required</Text>
              <View className="flex flex-row items-center border border-gray-300 rounded-lg bg-white mb-4 shadow-sm">
                <Text className="px-4 text-xl text-gray-600">$</Text>
                <TextInput
                  className="flex-1 text-lg"
                  keyboardType="numeric"
                  value={amountRequired}
                  onChangeText={(text) => setAmountRequired(text)}
                  placeholder="Enter amount"
                  mode="outlined"
                  theme={{ colors: { primary: '#4F46E5', placeholder: '#64748B' }}}
                />
              </View>
              {errors.amountRequired && <Text className="text-sm text-red-500">{errors.amountRequired}</Text>}

              {/* Goal Description Section */}
              <Text className="text-lg font-semibold text-gray-800 mb-2">Goal Description</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-lg bg-white mb-4 shadow-sm"
                multiline
                numberOfLines={4}
                value={goalDescription}
                onChangeText={(text) => setGoalDescription(text)}
                placeholder="Describe your funding goal..."
                mode="outlined"
                theme={{ colors: { primary: '#4F46E5', placeholder: '#64748B' }}}
              />
              {errors.goalDescription && <Text className="text-sm text-red-500">{errors.goalDescription}</Text>}
            </Surface>

            <View className="mb-12">
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={{ width: "80%", alignSelf: 'center' }}
                contentStyle={{ height: 50 }}
              >
                Create Funding Campaign
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default CreateFund;