import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import axios from 'axios';
import { serverurl } from '../../firebaseConfig';
import { useAuthStore } from '../store';

const EditProject = () => {
  const { projectId, user } = useAuthStore();
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    locationCity: '',
    locationState: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${serverurl}/project/${projectId}`);
        setProjectDetails(response.data);
        setFormData({
          projectName: response.data.projectName,
          description: response.data.description,
        //   locationCity: response.data.community?.location.city,
        //   locationState: response.data.community?.location.state,
        //   status: response.data.status,
          contactEmail: response.data.contactInfo.email,
          contactPhone: response.data.contactInfo.number
        });
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [projectId]);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${serverurl}/project/${projectId}`, formData);
      Alert.alert('Success', 'Project details updated successfully');
    } catch (error) {
      console.error('Error updating project details:', error);
      Alert.alert('Error', 'Something went wrong while updating the project');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-xl font-medium">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!projectDetails) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-xl font-medium">Project not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="py-4">
          {/* Project Details */}
          <View className="bg-white p-5 rounded-2xl shadow-lg mb-6">
            <Text className="text-2xl font-bold text-blue-600 mb-4">Edit Project</Text>
            
            <TextInput
              style={{ height: 40 }}
              placeholder="Project Name"
              value={formData.projectName}
              onChangeText={(text) => handleInputChange('projectName', text)}
              className="bg-gray-100 p-2 rounded-lg mb-4"
            />
            
            <TextInput
              style={{ height: 80 }}
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline
              className="bg-gray-100 p-2 rounded-lg mb-4"
            />

            {/* <TextInput
              style={{ height: 40 }}
              placeholder="City"
              value={formData.locationCity}
              onChangeText={(text) => handleInputChange('locationCity', text)}
              className="bg-gray-100 p-2 rounded-lg mb-4"
            /> */}

            {/* <TextInput
              style={{ height: 40 }}
              placeholder="State"
              value={formData.locationState}
              onChangeText={(text) => handleInputChange('locationState', text)}
              className="bg-gray-100 p-2 rounded-lg mb-4"
            /> */}

            <TextInput
              style={{ height: 40 }}
              placeholder="Contact Email"
              value={formData.contactEmail}
              onChangeText={(text) => handleInputChange('contactEmail', text)}
              className="bg-gray-100 p-2 rounded-lg mb-4"
            />

            <TextInput
              style={{ height: 40 }}
              placeholder="Contact Phone"
              value={formData.contactPhone}
              onChangeText={(text) => handleInputChange('contactPhone', text)}
              className="bg-gray-100 p-2 rounded-lg mb-4"
            />

            {/* Status Selector */}
            {/* <View className="mb-4">
              <Text className="text-base font-medium text-gray-700 mb-2">Status</Text>
              <TouchableOpacity
                onPress={() => handleInputChange('status', 'VOTING')}
                className={`py-2 px-4 rounded-lg mb-2 ${formData.status === 'VOTING' ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <Text className={`text-white ${formData.status === 'VOTING' ? 'font-semibold' : ''}`}>Voting</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleInputChange('status', 'ONGOING')}
                className={`py-2 px-4 rounded-lg ${formData.status === 'ONGOING' ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <Text className={`text-white ${formData.status === 'ONGOING' ? 'font-semibold' : ''}`}>Ongoing</Text>
              </TouchableOpacity>
            </View> */}
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            onPress={handleSave}
            className="bg-blue-500 py-4 px-8 rounded-lg flex-row items-center shadow-lg"
          >
            <MaterialIcons name="save" size={20} color="#FFFFFF" />
            <Text className="text-white font-bold ml-2">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProject;
