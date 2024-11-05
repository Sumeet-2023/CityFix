import React, { useState } from 'react';
import { View, Text, Modal, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
  SegmentedButtons,
  Surface
} from 'react-native-paper';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { serverurl } from '../../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../store';
import CreateProjectHeader from '../../components/project/createProjectHeader';

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

const CreateProject = () => {
  const { user, communityId } = useAuthStore();
  // const {communityId} = useLocalSearchParams();
  const [projectData, setProjectData] = useState({
    projectName: '',
    projectTag: '',
    description: '',
    contactInfo: {
      email: '',
      number: ''
    },
  });

  const handleInputChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (!projectData.projectName.trim() || !projectData.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const submitData = {
        projectName: projectData.projectName,
        projectTag: projectData.projectTag,
        description: projectData.description,
        contactInfo: projectData.contactInfo,
        creatorID: user.id,
        communityId: communityId
      };

      const response = await axios.post(`${serverurl}/project`, submitData);
      
      if (response.status === 201) {
        Alert.alert('Success', 'Project Created Successfully!');
        router.push('home/community/projectpages/feeds');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      Alert.alert('Error', 'Failed to create project');
    }
  };

  const CardHeader = ({ title, subtitle }) => (
    <View className="mb-4">
      <Text className="text-xl font-bold text-gray-800">{title}</Text>
      {subtitle && <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>}
    </View>
  );

  return (
    <PaperProvider theme={enhancedTheme}>
      <SafeAreaView className="flex-1 bg-gray-50">
        <CreateProjectHeader />
        <ScrollView>
          <LinearGradient
            colors={['#4F46E5', '#818CF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-8 pt-12 pb-16 rounded-b-[40px] shadow-lg"
          >
            <View className="items-center">
              <Text className="text-4xl font-bold text-white text-center mb-3">
                Create Project
              </Text>
              <Text className="text-lg text-indigo-100 text-center opacity-90">
                Build a better project together
              </Text>
            </View>
          </LinearGradient>

          <View className="px-4 -mt-8">
            <Surface className="rounded-3xl p-6 mb-6 elevation-4 bg-white">
              <CardHeader 
                title="Project Details" 
                subtitle="Give your project a unique identity"
              />
              <TextInput
                mode="outlined"
                label="Project Name"
                value={projectData.projectName}
                onChangeText={(value) => handleInputChange('projectName', value)}
                className="bg-white mb-4"
                placeholder="Enter project name"
                outlineColor="#E2E8F0"
                activeOutlineColor="#4F46E5"
              />

              <TextInput
                mode="outlined"
                label="Project Tag"
                value={projectData.projectTag}
                onChangeText={(value) => handleInputChange('projectTag', value)}
                className="bg-white mb-4"
                placeholder="Enter project tag"
                outlineColor="#E2E8F0"
                activeOutlineColor="#4F46E5"
              />

              <TextInput
                mode="outlined"
                label="Description"
                value={projectData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={4}
                className="bg-white mb-4 h-32"
                placeholder="What makes your project special?"
                outlineColor="#E2E8F0"
                activeOutlineColor="#4F46E5"
              />
            </Surface>

            <Surface className="rounded-3xl p-6 mb-6 elevation-4 bg-white">
              <CardHeader 
                title="Contact Information" 
                subtitle="How can people reach you?"
              />
              <TextInput
                mode="outlined"
                label="Email"
                value={projectData.contactInfo.email}
                onChangeText={(value) => handleContactInfoChange('email', value)}
                className="bg-white mb-4"
                placeholder="Enter contact email"
                keyboardType="email-address"
                outlineColor="#E2E8F0"
                activeOutlineColor="#4F46E5"
              />

              <TextInput
                mode="outlined"
                label="Phone"
                value={projectData.contactInfo.number}
                onChangeText={(value) => handleContactInfoChange('number', value)}
                className="bg-white mb-4"
                placeholder="Enter contact phone"
                keyboardType="phone-pad"
                outlineColor="#E2E8F0"
                activeOutlineColor="#4F46E5"
              />
            </Surface>

            <Button
              mode="contained"
              onPress={handleSubmit}
              className="mb-6"
              contentStyle={{ height: 56 }}
              labelStyle={{ fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 }}
            >
              Create Project
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default CreateProject;