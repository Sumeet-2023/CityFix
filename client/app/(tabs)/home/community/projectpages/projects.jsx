import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Switch, Share } from 'react-native';
import { Card, Title, Paragraph, Button, Badge, Divider, Dialog, Portal, IconButton, Menu } from 'react-native-paper';
import { serverurl } from '../../../../../firebaseConfig';
import { useAuthStore } from '../../../../store';
import axios from 'axios';
import { router } from 'expo-router';

const MyProject = ({ navigation }) => {
  const [myProjects, setMyProjects] = useState([]);
  const { user, communityId, setProjectId } = useAuthStore();
  const [role, setRole] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('activeProjects');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${serverurl}/project/byCommunityWithFilter/${communityId}?filterType=${filterType}&userId=${user?.id}`
        );
        const rel = await axios.get(
          `${serverurl}/community/role/${communityId}/${user?.id}`
        );
        setMyProjects(response.data);
        setRole(rel.data.role);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, [communityId, user?.id, filterType]);

  const handleProjectClick = (project) => {
    setProjectId(item.id);
    router.push('/(modals)/editProject');
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await axios.put(`${serverurl}/project/${projectId}`, { status: newStatus });
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
        const data = {
          userId: user?.id,
          communityId: communityId,
        };
        await axios.delete(`${serverurl}/project/${projectToDelete}/delete`, { data });
        setMyProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectToDelete));
        setDeleteDialogVisible(false);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleProjectDetail = useCallback((item) => {
    setProjectId(item.id);
    router.push(`/project-details`);
  }, []);

  const handleEditProject = useCallback((item) => {
    setProjectId(item.id);
    router.push('/(modals)/editProject');
  });

  const handleShare = async (project) => {
    try {
      const result = await Share.share({
        message: `Check out this project: ${project.projectName}\n\nDescription: ${project.description}`,
      });
  
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with activity type: ${result.activityType}`);
        } else {
          console.log('Project shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
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
    setFilterType((prevFilterType) =>
      prevFilterType === 'activeProjects' ? 'ongoingProjects' : 'activeProjects'
    );
  };

  return (
    <ScrollView
      className="bg-gray-100 flex-1 pt-4"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 space-y-4 mb-8">
        <View className="flex-row justify-between items-center">
          <Text className="text-black">
            {filterType === 'activeProjects' ? 'Active Projects' : 'Ongoing Projects'}
          </Text>
          <Switch
            value={filterType === 'ongoingProjects'}
            onValueChange={toggleFilter}
          />
        </View>

        {myProjects.map((project, index) => (
          <Card key={index + 1} onPress={() => handleProjectClick(project)} className="bg-purple-50">
            <Card.Content>
              <View className="flex-row justify-between items-center">
                <Title className="text-black">#{index + 1} - {project.projectName}</Title>
                <Badge className="text-white px-2 bg-green-400">
                  {project.status}
                </Badge>
              </View>
              <Paragraph className="text-black">{project.description}</Paragraph>
              <Divider style={{ marginVertical: 8 }} />
              <View className="flex-col justify-between pb-2">
                <Text>Created by: {project.creator?.username}</Text>
                <Text>Updated on: {new Date(project.updatedAt).toDateString()}</Text>
              </View>
            </Card.Content>
            {role !== 'MEMBER' && (
              <Card.Actions>
                <Button
                  icon={project.status === 'ONGOING' ? 'check' : 'update'}
                  mode="contained"
                  onPress={() => handleStatusChange(project.id, project.status === 'ONGOING' ? 'COMPLETED' : 'ONGOING')}
                  className={`${project.status === 'ONGOING' ? 'bg-green-500 mr-8' : 'bg-purple-400 mr-14'}`}
                  labelStyle={{ color: '#fff' }}
                >
                  {project.status === 'ONGOING' ? 'Mark Completed' : 'Mark Ongoing'}
                </Button>
                <IconButton
                  icon="pen"
                  iconColor={'#FFF'}
                  containerColor="#00F"
                  size={20}
                  onPress={() => handleEditProject(project)}
                />
                <IconButton
                  icon="delete"
                  iconColor={'#FFF'}
                  containerColor="#F00"
                  size={20}
                  onPress={() => showDeleteDialog(project.id)}
                />
              </Card.Actions>
            )}
            {role === 'MEMBER' && (
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
                <Button
                  icon="share"
                  mode="contained"
                  onPress={() => handleShare(project)}
                  className="bg-green-500"
                  labelStyle={{ color: '#fff' }}
                >
                  Share
                </Button>
              </Card.Actions>
            )}
          </Card>
        ))}
      </View>

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog} className="bg-white">
          <Dialog.Title className="text-black">Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Paragraph className="text-black">
              Are you sure you want to delete this project? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog} labelStyle={{ color: 'black' }}>
              Cancel
            </Button>
            <Button onPress={handleDelete} labelStyle={{ color: 'red' }}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

export default MyProject;
