import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { db, serverurl } from '../../firebaseConfig';
import { useAuthStore } from '../store';
import CustomKeyboardView from '../../components/chat/customKeyboardView';
import ChatHeader from '../../components/chat/chatRoomHeader';
import { doc, onSnapshot, orderBy, query, setDoc, Timestamp, collection, addDoc } from 'firebase/firestore';
import { useChatRoom } from '../../hooks/useChatRoom';

const ChatRoom = () => {
  const [newMessage, setNewMessage] = useState('');
  const [channel, setChannel] = useState(null);
  const flatListRef = useRef(null);
  const { user } = useAuthStore();
  const params = useLocalSearchParams();
  
  const { messages, isLoading, sendMessage } = useChatRoom(channel?.id, user);

  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        const response = await axios.get(`${serverurl}/community/${params.id}`);
        setChannel(response.data);
      } catch (error) {
        console.error('Error fetching channel details:', error);
      }
    };

    if (params.id) {
      fetchChannelDetails();
    }
  }, [params.id]);

  const handleSendMessage = async () => {
    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    
    // If message is from today, show only time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    // If message is from this year, show month and day
    else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    }
    // If message is from previous years, show full date
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderMessage = ({ item, index, messages }) => {
    const isCurrentUser = item.userId === user.id;
    const showAvatar = !isCurrentUser && 
      (index === messages.length - 1 || 
       messages[index + 1]?.userId !== item.userId);
    
    return (
      <View style={{
        marginVertical: 2,
        marginHorizontal: 12,
        flexDirection: isCurrentUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
      }}>
        {!isCurrentUser && (
          <View style={{ width: 32, marginRight: 8 }}>
            {showAvatar && (
              <Image
                source={{ uri: item.profileUrl || 'https://via.placeholder.com/32' }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  marginBottom: 4,
                }}
              />
            )}
          </View>
        )}
        <View style={{
          maxWidth: '75%',
        }}>
          {!isCurrentUser && showAvatar && (
            <Text style={{ 
              fontSize: 13,
              color: '#6B7280',
              marginBottom: 4,
              marginLeft: 2,
            }}>
              {item.username || item.senderName}
            </Text>
          )}
          <View style={{
            backgroundColor: isCurrentUser ? '#111827' : '#F3F4F6',
            borderRadius: 16,
            padding: 12,
            borderTopLeftRadius: !isCurrentUser && !showAvatar ? 4 : 16,
            borderTopRightRadius: isCurrentUser ? 4 : 16,
          }}>
            <Text style={{ 
              color: isCurrentUser ? 'white' : '#111827',
              fontSize: 16,
            }}>
              {item.text}
            </Text>
          </View>
          <Text style={{ 
            fontSize: 11,
            color: '#6B7280',
            marginTop: 4,
            textAlign: isCurrentUser ? 'right' : 'left',
            marginHorizontal: 4,
          }}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatHeader channel={channel} />
      <CustomKeyboardView inChat>
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item, index }) => renderMessage({ 
              item, 
              index, 
              messages 
            })}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ 
              flexGrow: 1, 
              paddingVertical: 16,
            }}
            inverted={true}
            keyboardShouldPersistTaps="handled"
          />
          <View style={{
            flexDirection: 'row',
            padding: 16,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            alignItems: 'center',
          }}>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              multiline
              style={{
                flex: 1,
                backgroundColor: '#F3F4F6',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 8,
                maxHeight: 100,
              }}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
              style={{
                backgroundColor: newMessage.trim() ? '#111827' : '#E5E7EB',
                borderRadius: 20,
                padding: 8,
              }}
            >
              <Ionicons name="send" size={24} color={newMessage.trim() ? 'white' : '#9CA3AF'} />
            </TouchableOpacity>
          </View>
        </View>
      </CustomKeyboardView>
    </SafeAreaView>
  );
};

export default ChatRoom;