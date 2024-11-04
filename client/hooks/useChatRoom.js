// hooks/useChatRoom.js
import { useState, useEffect } from 'react';
import { doc, onSnapshot, orderBy, query, setDoc, Timestamp, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const useChatRoom = (channelId, user) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (channelId) {
      createRoomIfNotExists(channelId);
      // Set up Firestore listener
      const docRef = doc(db, "rooms", channelId);
      const messageRef = collection(docRef, "messages");
      const q = query(messageRef, orderBy('createdAt', 'desc'));
  
      const unsub = onSnapshot(q, (snapshot) => {
        const allMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(allMessages);
        setIsLoading(false);
      });
      return unsub;
    }
  }, [channelId]);

  const createRoomIfNotExists = async (channelId) => {
    await setDoc(doc(db, "rooms", channelId), {
      channelId,
      createdAt: Timestamp.fromDate(new Date()),
    }, { merge: true });
  };

  const sendMessage = async (newMessage) => {
    if (!newMessage.trim()) return;

    try {
      const docRef = doc(db, 'rooms', channelId);
      const messageRef = collection(docRef, "messages");

      await addDoc(messageRef, {
        userId: user.id,
        text: newMessage.trim(),
        profileUrl: user.profileUrl,
        senderName: user.username,
        createdAt: Timestamp.fromDate(new Date())
      });

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
};