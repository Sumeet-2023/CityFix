import React, { useEffect, useState } from 'react';
import { ScrollView, Image, SafeAreaView, RefreshControl } from 'react-native';
import { styled } from 'nativewind';
import { serverurl } from '../../../../firebaseConfig';
import { useAuthStore } from '../../../store';
import axios from 'axios';
import { 
  Card, 
  Avatar, 
  Switch, 
  Text,
  Button, 
  Divider,
  Portal,
  Dialog,
  Surface,
  ActivityIndicator,
  FAB,
  List,
  IconButton,
  Badge
} from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledSurface = styled(Surface);

const MyClan = () => {
  const [myClan, setMyClan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [leaveDialogVisible, setLeaveDialogVisible] = useState(false);
  const { user } = useAuthStore();
  const [memberStatus, setMemberStatus] = useState({});

  const fetchClan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverurl}/clan/joinedClan/${user?.id}`);
      setMyClan(response.data);

      if (response.data?.members) {
        const initialStatus = {};
        response.data.members.forEach((member) => {
          initialStatus[member.user.id] = false;
        });
        setMemberStatus(initialStatus);
      }

      setError(null);
    } catch (err) {
      setError('Failed to load Clan');
      setMyClan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (memberId) => {
    setMemberStatus((prevStatus) => ({
      ...prevStatus,
      [memberId]: !prevStatus[memberId],
    }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClan();
    setRefreshing(false);
  };

  const handleLeave = async (clanId) => {
    try {
      await axios.post(`${serverurl}/clan/${clanId}/leave`, { userId: user?.id });
      setMyClan(null);
      setLeaveDialogVisible(false);
    } catch (error) {
      console.error('Failed to Leave clan:', error);
    }
  };

  useEffect(() => {
    fetchClan();
  }, []);

  if (loading) {
    return (
      <StyledSafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" />
      </StyledSafeAreaView>
    );
  }

  if (!myClan) {
    return (
      <StyledSafeAreaView className="flex-1 bg-gray-50 p-4">
        <StyledScrollView 
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <StyledSurface className="items-center justify-center p-8 rounded-xl bg-white shadow-sm">
            <FontAwesome5 name="users" size={80} color="#6B7280" />
            <Text className="text-2xl font-bold text-gray-800 mt-6 mb-2 text-center">
              No Clan Found
            </Text>
            <Text className="text-base text-gray-600 text-center mb-6">
              Join a clan to connect with others or create your own to lead!
            </Text>
            <Button mode="contained" className="w-full">
              Browse Clans
            </Button>
          </StyledSurface>
        </StyledScrollView>
      </StyledSafeAreaView>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-gray-50">
      <StyledScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Card className="m-4 bg-white shadow-lg">
          <Card.Content>
            <Surface className="flex-row items-center mb-4 p-2 rounded-lg bg-blue-50">
              {myClan?.badge?.icon ? (
                <Avatar.Icon size={48} icon={myClan.badge.icon}/>
              ) : (
                <Avatar.Icon size={48} icon="shield" />
              )}
              <Text className="text-2xl font-bold ml-3 text-blue-900">{myClan.clanName}</Text>
              <Badge className="ml-auto" size={24}>{myClan.members?.length}/{myClan.requiredMembers}</Badge>
            </Surface>

            <List.Section>
              <List.Item
                title="Description"
                description={myClan.description}
                titleStyle={{color: 'black'}}
                descriptionStyle={{color: 'black'}}
                left={props => <List.Icon {...props} icon="information" color='black' />}
              />
              <List.Item
                title="Type"
                description={myClan.type}
                titleStyle={{color: 'black'}}
                descriptionStyle={{color: 'black'}}
                left={props => <List.Icon {...props} icon="lock" color='black' />}
              />
              <List.Item
                title="Location"
                description={`${myClan.location?.city}, ${myClan.location?.country}`}
                titleStyle={{color: 'black'}}
                descriptionStyle={{color: 'black'}}
                left={props => <List.Icon {...props} icon="map-marker" color='black' />}
              />
              <List.Item
                title="Clan Tag"
                description={myClan.clanTag}
                titleStyle={{color: 'black'}}
                descriptionStyle={{color: 'black'}}
                left={props => <List.Icon {...props} icon="tag" color='black' />}
              />
            </List.Section>

            <Divider className="my-4" />

            <Surface className="flex-row justify-between mt-2" style={{backgroundColor: 'white', shadowColor: 'white'}}>
              <Button 
                mode="contained" 
                className="flex-1 mr-2"
                icon="message"
              >
                Message
              </Button>
              <Button 
                mode="contained"
                buttonColor="red"
                className="flex-1 ml-2"
                icon="logout"
                onPress={() => setLeaveDialogVisible(true)}
              >
                Leave
              </Button>
            </Surface>
          </Card.Content>
        </Card>

        <Card className="mx-4 mb-4 bg-white">
          <Card.Title 
            title="Members" 
            subtitle={`${myClan.members?.length} of ${myClan.requiredMembers} members`}
            titleStyle={{color: 'black'}}
            subtitleStyle={{color: 'black'}}
            left={(props) => <Avatar.Icon {...props} icon="account-group" />}
          />
          <Card.Content style={{backgroundColor: 'white', paddingBottom: 40}}>
            {Array.isArray(myClan.members) && myClan.members.map((member, index) => (
              <Surface key={index} className="flex-row items-center justify-between py-3 bg-white" style={{shadowColor: 'white'}}>
                <Surface className="flex-row items-center flex-1 bg-white" style={{shadowColor: 'white'}}>
                  <Avatar.Image
                    size={40}
                    source={{ uri: member.user.profileUrl ?? 'https://via.placeholder.com/40' }}
                  />
                  <Text className="ml-3 text-base font-medium text-black">{member.user.username}</Text>
                </Surface>
                <Surface className="flex-row items-center bg-white" style={{shadowColor: 'white'}}>
                  <Switch
                    value={memberStatus[member.user.id]}
                    style={{backgroundColor: 'white'}}
                    onValueChange={() => handleToggle(member.user.id)}
                  />
                  <Text className="mr-2 text-sm text-black bg-white">
                    {memberStatus[member.user.id] ? 'Paid' : 'Unpaid'}
                  </Text>
                </Surface>
              </Surface>
            ))}
          </Card.Content>
        </Card>
      </StyledScrollView>

      <FAB
        icon="account-plus"
        label="Invite"
        className="absolute bottom-2 right-4"
      />

      <Portal>
        <Dialog visible={leaveDialogVisible} onDismiss={() => setLeaveDialogVisible(false)}>
          <Dialog.Title>Leave Clan</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to leave this clan? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLeaveDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => handleLeave(myClan.id)} textColor="red">Leave</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </StyledSafeAreaView>
  );
};

export default MyClan;