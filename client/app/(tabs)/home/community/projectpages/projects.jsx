import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Switch, Share } from 'react-native';
import { Card, Title, Paragraph, Button, Badge, Divider, Dialog, Portal, IconButton } from 'react-native-paper';
import { serverurl } from '../../../../../firebaseConfig';
import { useAuthStore } from '../../../../store';
import axios from 'axios';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const MyProject = () => {
  const [myProjects, setMyProjects] = useState([]);
  const [role, setRole] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('activeProjects');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const { user, communityId, setProjectId } = useAuthStore();

  useEffect(() => {
    const fetchProjectsAndRole = async () => {
      try {
        const [projectsResponse, roleResponse] = await Promise.all([
          axios.get(`${serverurl}/project/byCommunityWithFilter/${communityId}?filterType=${filterType}&userId=${user?.id}`),
          axios.get(`${serverurl}/community/role/${communityId}/${user?.id}`)
        ]);
        setMyProjects(projectsResponse.data);
        setRole(roleResponse.data.role);
      } catch (error) {
        console.error('Failed to fetch projects or role:', error);
      }
    };
    fetchProjectsAndRole();
  }, [communityId, user?.id, filterType]);

  const handleProjectClick = (project) => {
    setProjectId(project.id);
    router.push('/(modals)/editProject');
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await axios.put(`${serverurl}/project/${projectId}`, { status: newStatus, userId: user?.id, communityId: communityId });
      setMyProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, status: newStatus } : project
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async () => {
    if (projectToDelete) {
      try {
        const data = { userId: user?.id, communityId: communityId };
        await axios.delete(`${serverurl}/project/${projectToDelete}/delete`, { data });
        setMyProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectToDelete));
        setDeleteDialogVisible(false);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleProjectDetail = useCallback((project) => {
    setProjectId(project.id);
    router.push(`/project-details`);
  }, []);

  const handleManageProject = useCallback((project) => {
    setProjectId(project.id);
    router.push(`../manageproject/events`);
  }, []);

  const handleShare = async (project) => {
    try {
      const result = await Share.share({
        message: `Check out this project: ${project.projectName}\n\nDescription: ${project.description}`,
      });
      console.log(result.action === Share.sharedAction ? 'Project shared successfully' : 'Share dismissed');
    } catch (error) {
      console.error('Error sharing the project:', error);
    }
  };

  const showDeleteDialog = (projectId) => {
    setProjectToDelete(projectId);
    setDeleteDialogVisible(true);
  };

  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
    setProjectToDelete(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(
        `${serverurl}/project/byCommunityWithFilter/${communityId}?filterType=${filterType}&userId=${user?.id}`
      );
      setMyProjects(response.data);
    } catch (error) {
      console.error('Failed to refresh projects:', error);
    }
    setRefreshing(false);
  };

  const toggleFilter = () => {
    setFilterType(prevFilterType => (prevFilterType === 'activeProjects' ? 'ongoingProjects' : 'activeProjects'));
  };

  const renderNoProjectsMessage = () => {
    const data = {};
    if (filterType === 'activeProjects'){
      data.title = role === 'MEMBER' ? 'No Active Projects' : 'No Projects To Be Reviewed';
      data.desc = 'You can join or vote projects that need attention.';
      data.btn = 'Join Or Vote Projects';
    } else {
      data.title = 'No Ongoing Projects';
      data.desc = role === 'MEMBER' ? 'No projects marked as ongoing yet' : 'You can review and mark an active project as ongoing';
      data.btn = role === 'MEMBER' ? 'Join Or Vote Projects' : 'Review Projects'
    }

    if (myProjects.length === 0) {
      return (
        <View className="self-center flex-col items-center justify-center space-y-4 p-6">
          <Ionicons name="alert-circle" size={40} color="#FF6347" />
          <Text className="text-xl font-semibold text-gray-800">
            {data.title}
          </Text>
          <Text className="text-sm text-gray-600">
            {data.desc}
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('./feeds')}
            className="bg-blue-500"
            labelStyle={{ color: '#fff' }}
          >
            {data.btn}
          </Button>
        </View>
      );
    }
    return null;
  };
  
  return (
    <ScrollView
      className="bg-gray-100 flex-1 pt-4"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="px-4 space-y-4 mb-8">
        <View className="flex-row justify-between items-center">
          <Text className="text-black">
            {filterType === 'activeProjects' ? 'Active Projects' : 'Ongoing Projects'}
          </Text>
          <Switch value={filterType === 'ongoingProjects'} onValueChange={toggleFilter} />
        </View>

        {renderNoProjectsMessage()}

        {myProjects.map((project, index) => (
          <Card key={index} onPress={() => handleProjectClick(project)} className="bg-purple-50">
            <Card.Content>
              <View className="flex-row justify-between items-center">
                <Title className="text-black">#{index + 1} - {project.projectName}</Title>
                <Badge className="text-white px-2 bg-green-400">{project.status}</Badge>
              </View>
              <Paragraph className="text-black">{project.description}</Paragraph>
              <Divider style={{ marginVertical: 8 }} />
              <View className="flex-col justify-between pb-2">
                <Text>Created by: {project.creator?.username}</Text>
                <Text>Updated on: {new Date(project.updatedAt).toDateString()}</Text>
              </View>
            </Card.Content>

            {role !== 'MEMBER' ? (
            <Card.Actions
              className="flex flex-wrap justify-between items-center space-x-2 mt-4 sm:justify-start"
            >
              <Button
                mode="contained"
                onPress={() =>
                  handleStatusChange(
                    project.id,
                    project.status === 'ONGOING' ? 'COMPLETED' : 'ONGOING'
                  )
                }
                className={`${
                  project.status === 'ONGOING'
                    ? 'bg-green-500'
                    : 'bg-purple-400'
                } flex-grow sm:flex-none`}
                labelStyle={{ color: '#fff', fontSize: 12 }}
              >
                {project.status === 'ONGOING' ? 'Mark Completed' : 'Mark Ongoing'}
              </Button>

              {project.status === 'ONGOING' && (
                <IconButton
                  icon="folder-eye"
                  iconColor={'#FFF'}
                  containerColor="#42A5F5"
                  size={20}
                  onPress={() => handleManageProject(project)}
                  className="sm:ml-2"
                />
              )}
            
              <IconButton
                icon="pen"
                iconColor={'#FFF'}
                containerColor="#FFA726"
                size={20}
                onPress={() =>
                  project.status === 'ONGOING'
                    ? handleProjectClick(project)
                    : handleEditProject(project)
                }
                className="sm:ml-2"
              />
            
              <IconButton
                icon="delete"
                iconColor={'#FFF'}
                containerColor="#F44336"
                size={20}
                onPress={() => showDeleteDialog(project.id)}
                className="sm:ml-2"
              />
            </Card.Actions>
            ) : (
              <Card.Actions>
                <Button
                  icon="eye"
                  mode="contained"
                  onPress={() => handleProjectDetail(project)}
                  className="mr-14 bg-blue-600"
                  labelStyle={{ color: '#fff' }}
                >
                  View Details
                </Button>
                <IconButton
                  icon="share-variant"
                  iconColor={'#FFF'}
                  containerColor="#0F0"
                  size={20}
                  onPress={() => handleProjectClick(project)}
                  className="sm:ml-2"
                />
                {project.status === 'ONGOING' && (
                  <IconButton
                    icon="folder-eye"
                    iconColor={'#FFF'}
                    containerColor="#00F"
                    size={20}
                    onPress={handleManageProject(project)}
                    className="sm:ml-2"
                  />
                )}
              </Card.Actions>
            )}
          </Card>
        ))}
      </View>

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog} className="bg-white">
          <Dialog.Title className="text-black">Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Paragraph className="text-black">Are you sure you want to delete this project? This action cannot be undone.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog} labelStyle={{ color: 'black' }}>Cancel</Button>
            <Button onPress={handleDelete} className="text-red-500">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

export default MyProject;
