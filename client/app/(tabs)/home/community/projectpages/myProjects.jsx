import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MyProject = () => {
  const [myProjects, setMyProjects] = useState([
    {
      id: 1,
      status: 'Ongoing',
      title: 'Community Cleanup Day',
      dateInitiated: 'October 5, 2024',
      location: 'City Park',
      lastUpdated: 'October 10, 2024',
      description: 'Join us for a community cleanup to beautify the park and remove litter.',
      volunteers: 15,
    },
    {
      id: 2,
      status: 'Completed',
      title: 'Tree Planting Initiative',
      dateInitiated: 'October 3, 2024',
      location: 'Main Street',
      lastUpdated: 'October 9, 2024',
      description: 'A successful tree planting event to promote greenery in our city.',
      volunteers: 25,
    },
    {
      id: 3,
      status: 'Upcoming',
      title: 'Food Drive for the Homeless',
      dateInitiated: 'October 20, 2024',
      location: 'Community Center',
      lastUpdated: 'October 15, 2024',
      description: 'Help us gather food donations to support the local homeless community.',
      volunteers: 0,
    },
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [editedVolunteers, setEditedVolunteers] = useState('');

  const handleEdit = (project) => {
    setEditedTitle(project.title);
    setEditedDescription(project.description);
    setEditedLocation(project.location);
    setEditedDate(project.dateInitiated);
    setEditedVolunteers(project.volunteers.toString());
    setSelectedProject(project);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedProject) {
      const updatedProjects = myProjects.map((project) => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            title: editedTitle,
            description: editedDescription,
            location: editedLocation,
            dateInitiated: editedDate,
            volunteers: parseInt(editedVolunteers) || 0,
          };
        }
        return project;
      });
      setMyProjects(updatedProjects);
      setIsEditing(false);
      setSelectedProject(null);
    }
  };

  const handleDeregister = (id) => {
    console.log(`Deregister from project with ID: ${id}`);
    alert(`Successfully deregistered from project ${id}`);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsEditing(false);
  };

  const handleBack = () => {
    setSelectedProject(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedProject(null);
  };

  return (
    <ScrollView className="bg-gray-100 flex-1">
      {!selectedProject ? (
        <View className="p-5">
          {myProjects.map((project, index) => (
            <TouchableOpacity key={index} onPress={() => handleProjectClick(project)}>
              <View className="bg-white p-4 rounded-lg shadow-lg mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-lg font-bold text-gray-800">#{project.id}</Text>
                  <Text className="text-sm text-blue-600 uppercase">{project.status}</Text>
                </View>
                <Text className="text-xl font-semibold text-gray-900 mb-2">{project.title}</Text>
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="event" size={16} color="#555" />
                  <Text className="ml-1 text-sm text-gray-600">Date Initiated: {project.dateInitiated}</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="location-on" size={16} color="#555" />
                  <Text className="ml-1 text-sm text-gray-600">Location: {project.location}</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="update" size={16} color="#555" />
                  <Text className="ml-1 text-sm text-gray-600">Last Updated: {project.lastUpdated}</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="group" size={16} color="#555" />
                  <Text className="ml-1 text-sm text-gray-600">Volunteers Joined: {project.volunteers}</Text>
                </View>
                {/* Action Buttons for Edit and Deregister */}
                <View className="flex-row justify-between mt-2">
                  <TouchableOpacity
                    className="flex-row items-center bg-blue-600 py-2 px-3 rounded-md"
                    onPress={() => handleEdit(project)}
                  >
                    <MaterialIcons name="edit" size={20} color="white" />
                    <Text className="text-white ml-1">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row items-center bg-red-600 py-2 px-3 rounded-md"
                    onPress={() => handleDeregister(project.id)}
                  >
                    <MaterialIcons name="cancel" size={20} color="white" />
                    <Text className="text-white ml-1">Deregister</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : isEditing ? (
        <View className="flex-1 p-6 bg-white">
          <Text className="text-xl font-bold mb-4">Edit Project</Text>
          <View className="mb-4">
            <Text className="text-lg text-gray-800 mb-2">Project Title:</Text>
            <TextInput
              placeholder="Project Title"
              value={editedTitle}
              onChangeText={setEditedTitle}
              className="border border-gray-300 rounded-md p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-lg text-gray-800 mb-2">Project Description:</Text>
            <TextInput
              placeholder="Project Description"
              value={editedDescription}
              onChangeText={setEditedDescription}
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-md p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-lg text-gray-800 mb-2">Location:</Text>
            <TextInput
              placeholder="Location"
              value={editedLocation}
              onChangeText={setEditedLocation}
              className="border border-gray-300 rounded-md p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-lg text-gray-800 mb-2">Date Initiated:</Text>
            <TextInput
              placeholder="Date Initiated"
              value={editedDate}
              onChangeText={setEditedDate}
              className="border border-gray-300 rounded-md p-2"
            />
          </View>
          <View className="mb-4">
            <Text className="text-lg text-gray-800 mb-2">Volunteers:</Text>
            <TextInput
              placeholder="Volunteers"
              value={editedVolunteers}
              onChangeText={setEditedVolunteers}
              keyboardType="numeric"
              className="border border-gray-300 rounded-md p-2"
            />
          </View>
          <View className="flex-row justify-between">
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={handleCancel} color="#FF3D00" />
          </View>
        </View>
      ) : (
        <View className="flex-1 p-6 bg-white">
          <Text className="text-xl font-bold mb-4">{selectedProject?.title}</Text>
          <Text className="text-lg text-gray-800 mb-2">{selectedProject?.description}</Text>
          <View className="mb-4">
            <Text className="text-lg text-gray-800 mb-2">Location:</Text>
            <Text>{selectedProject?.location}</Text>
          </View>
          <View className="mb-4">
            <Text className="text-lg text-gray-800 mb-2">Date Initiated:</Text>
            <Text>{selectedProject?.dateInitiated}</Text>
          </View>
          <View className="mb-4">
            <Text className="text-lg text-gray-800 mb-2">Volunteers Joined:</Text>
            <Text>{selectedProject?.volunteers}</Text>
          </View>
          <Button title="Back" onPress={handleBack} />
        </View>
      )}
    </ScrollView>
  );
};

export default MyProject;
