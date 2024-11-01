import React from 'react'
import { View, Text,TouchableOpacity, ScrollView,Image } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { images } from '../../../../../constants';


const Volunteers = () => {
  const events = [
    {
      id:'1',
      image: images.ngo1,
      ngoName:'Green House',
      tag:'Organized by trump foundation',
      title:'Tree planting',
      description:'Help us plant 100 in the city chicago!',
      date:'Nov 17 , 2024',
      time:'8:00 AM - 1:00 PM',
      location:'Chicago',
      volunteers: {current:20 , needed: 50 }
    },
    {
      id:'2',
      ngoName:'White House',
      image: images.ngo2,
      tag:'Organized by Anurag foundation',
      title:'Beach cleaning',
      description:'Help us for Beach cleaning at juhu!',
      date:'Nov 17 , 2024',
      time:'8:00 AM - 1:00 PM',
      location:'Andheri',
      volunteers: {current:40 , needed: 100 }
    },
    {
      id:'3',
      ngoName:'Dhamaal',
      image: images.ngo3,
      tag:'Organized by Seva foundation',
      title:'To find Giant W',
      description:'Help us to find W at the St Sebistan Garden!',
      date:'Nov 27 , 2024',
      time:'8:00 AM - 1:00 PM',
      location:'Goa',
      volunteers: {current:7 , needed: 10 }
    }
  ]

  return (
    <ScrollView>
      <View className="flex-1 px-5 py-2">
        {events.map((event, index) => (
          <TouchableOpacity key={index}>
            <View className="bg-white p-4 m-2 rounded-xl ">
              <View className="flex-row items-center space-x-3 mb-2">
                <Image source={event.image} className="w-12 h-12 shadow-md rounded-xl" />
                <Text className="text-xl font-bold mb-2">{event.ngoName}</Text>
              </View>
              <Text className=" text-sm font-semibold mb-2"># {event.tag}</Text>
              <Text className="text-lg font-bold mb-2 text-black mb-2">Title: {event.title}</Text>
              <Text className="text-base font-bold mb-2 text-black mb-2">Description: {event.description}</Text>
              <Text className="text-base font-bold mb-2 text-black mb-2">Date: {event.date}</Text>
              <Text className="text-base font-bold mb-2 text-black mb-2">Time: {event.time}</Text>
              <Text className="text-base font-bold mb-2 text-black mb-2">Location: {event.location}</Text>

              <Text className="text-xl font-bold mb-2 text-black mb-2">
                Volunteer Needed: {event.volunteers.current}/{event.volunteers.needed}
              </Text>

              <View className="flex-row justify-between">
                <TouchableOpacity className="flex-row items-center bg-blue-500 px-5 py-2 rounded mt-2">
                  <Text className="text-black text-sm">Join</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center bg-blue-500 px-3 py-2 rounded mt-2">
                  <Text className="text-black text-sm">Share</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center bg-blue-500 px-3 py-2 rounded mt-2">
                  <Text className="text-black text-sm">Contact</Text>
                </TouchableOpacity>
              </View>
            </View>

          </TouchableOpacity>
        ))}
      </View>
      
    </ScrollView>
  );
  
}

export default Volunteers;