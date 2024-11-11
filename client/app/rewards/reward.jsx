import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { MaterialIcons } from '@expo/vector-icons';

// Styled components
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Updated Sample Data for Rewards and Badges
const rewardWays = [
  {
    id: 1,
    title: 'Report Issues',
    points: '10 Points per Report',
    icon: 'report-problem',
    description: 'Earn points for every issue you report that helps improve your community.',
  },
  {
    id: 2,
    title: 'Join Communities',
    points: '15 Points per Join',
    icon: 'group',
    description: 'Join different communities and receive points for active participation.',
  },
  {
    id: 3,
    title: 'Participate in Projects',
    points: '20 Points per Project',
    icon: 'work',
    description: 'Engage in community projects to earn more points and make a difference.',
  },
  {
    id: 4,
    title: 'Comment & Interact',
    points: '5 Points per Comment',
    icon: 'comment',
    description: 'Contribute with meaningful comments and engage in discussions to earn points.',
  },
  {
    id: 5,
    title: 'Follow Other Users',
    points: '5 Points per Follow',
    icon: 'person-add',
    description: 'Follow other members to build your community and earn points for each follow.',
  },
  {
    id: 6,
    title: 'Create a Community',
    points: '30 Points per Community',
    icon: 'people-outline',
    description: 'Create a new community group to bring like-minded people together and earn extra points.',
  },
  {
    id: 7,
    title: 'Host an Event',
    points: '50 Points per Event',
    icon: 'event',
    description: 'Organize an event and earn rewards for taking the lead in making a positive impact.',
  },
  {
    id: 8,
    title: 'Invite Friends to Join',
    points: '10 Points per Invite',
    icon: 'person-add-alt',
    description: 'Invite friends to join the platform and earn points for every successful invite.',
  },
  {
    id: 9,
    title: 'Resolve an Issue',
    points: '40 Points per Resolution',
    icon: 'check-circle',
    description: 'Resolve issues reported by others to make a real change in your community.',
  },
];

const badges = [
  {
    id: 1,
    title: 'Community Leader',
    icon: 'star',
    description: 'Awarded for being an active leader in your community projects.',
    pointsRequired: 100,
  },
  {
    id: 2,
    title: 'Engagement Expert',
    icon: 'emoji-events',
    description: 'Earned by reaching a high engagement score within the community.',
    pointsRequired: 200,
  },
  {
    id: 3,
    title: 'Problem Solver',
    icon: 'handyman',
    description: 'Granted for resolving a significant number of issues reported.',
    pointsRequired: 150,
  },
  {
    id: 4,
    title: 'Event Organizer',
    icon: 'event-available',
    description: 'Awarded for successfully organizing multiple community events.',
    pointsRequired: 300,
  },
  {
    id: 5,
    title: 'Social Connector',
    icon: 'people-alt',
    description: 'Earned by following a set number of people and building a robust social network.',
    pointsRequired: 120,
  },
  {
    id: 6,
    title: 'Community Builder',
    icon: 'home-work',
    description: 'Granted for creating and managing multiple community groups.',
    pointsRequired: 250,
  },
  {
    id: 7,
    title: 'Top Commenter',
    icon: 'insert-comment',
    description: 'Awarded for contributing valuable comments and helping discussions grow.',
    pointsRequired: 80,
  },
];

const Reward = () => {
  return (
    <StyledView className="flex-1 p-4 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <StyledView className="mb-6">
          <StyledText className="text-3xl font-bold text-center">Rewards for Engagement</StyledText>
          <StyledText className="text-lg text-gray-600 text-center mt-2">
            Discover how you can earn points and get rewarded for your community engagement.
          </StyledText>
        </StyledView>

        {/* Ways to Earn Points */}
        <StyledView className="mb-6">
          <StyledText className="text-2xl font-bold mb-4">Ways to Earn Points</StyledText>
          {rewardWays.map((reward) => (
            <StyledView key={reward.id} className="bg-gray-100 rounded-lg p-4 mb-4 shadow-md">
              <StyledView className="flex-row items-center mb-2">
                <MaterialIcons name={reward.icon} size={30} color="#3b82f6" />
                <StyledText className="ml-3 text-xl font-semibold">{reward.title}</StyledText>
              </StyledView>
              <StyledText className="text-gray-700 mb-1">{reward.points}</StyledText>
              <StyledText className="text-gray-600">{reward.description}</StyledText>
            </StyledView>
          ))}
        </StyledView>

        {/* Badges Section */}
        <StyledView>
          <StyledText className="text-2xl font-bold mb-4">Earn Badges</StyledText>
          {badges.map((badge) => (
            <StyledView key={badge.id} className="bg-blue-500 rounded-lg p-4 mb-4 shadow-md">
              <StyledView className="flex-row items-center mb-2">
                <MaterialIcons name={badge.icon} size={30} color="white" />
                <StyledText className="ml-3 text-xl font-bold text-white">{badge.title}</StyledText>
              </StyledView>
              <StyledText className="text-white mb-1">{badge.description}</StyledText>
              <StyledText className="text-white">
                Points Required: <StyledText className="font-bold">{badge.pointsRequired}</StyledText>
              </StyledText>
            </StyledView>
          ))}
        </StyledView>

        {/* Collect Points Button */}
        <StyledTouchableOpacity className="bg-yellow-500 py-3 mt-6 rounded-lg items-center shadow-md">
          <StyledText className="text-black font-semibold text-lg">Start Engaging & Collect Points</StyledText>
        </StyledTouchableOpacity>
      </ScrollView>
    </StyledView>
  );
};

export default Reward;