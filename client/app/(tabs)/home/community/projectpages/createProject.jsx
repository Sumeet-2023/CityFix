import { View, Text, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CreateProject() {
  const [projectTitle,setProjectTitle] = useState('');
  const [projectDescription,setProjectDescription] = useState('');
  const [date,setDate] = useState(new Date());
  const [showDatePicker,setShowDatePicker] = useState(false);
  const [time,setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location,setLocation] = useState('');
  const [volunteers,setVolunteers] = useState('');
  const [contactInfo,setContactInfo] = useState('');
  const handleSubmit = () => {
    console.log({projectTitle,projectDescription,date,time,location,volunteers,contactInfo});
    alert("Project created successfully");
    setProjectTitle('');
    setProjectDescription('');
    setDate(new Date()); 
    setTime(new Date()); 
    setLocation('');
    setVolunteers('');
    setContactInfo('');
    router.push('home/community/projectpages/myProjects');
  };
  const onChangeDate = (event,selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate)
  };
  
  const onChangeTime = (event, selectedTime) => {
    if (selectedTime) {
      setTime(selectedTime);  
    }
    setShowTimePicker(false);  
  };
  const showTimepicker = () => {
    setShowTimePicker(true);  
  };
 
  return (
    <ScrollView>
        <View className="flex-1 bg-white p-4">
          <Text className="text-lg font-bold mb-4">Project Title</Text>
            <TextInput
              className="border border-gray-300 rounded p-3 mb-4"
              value={projectTitle}
              placeholderTextColor="#999" 
              onChangeText={setProjectTitle}
              placeholder='Enter your project issue'
            />
        <Text className="text-lg font-bold mb-4">Project Description</Text>
          <TextInput
            className="border border-gray-300 rounded p-3 mb-4 h-40"
            value={projectDescription}
            onChangeText={setProjectDescription}
            placeholder='Enter your project desc'
            multiline
            numberOfLines={5}
            editable
            placeholderTextColor="#999" 
          />
        
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-xl font-bold mb-2">Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border border-gray-300 rounded p-3">
            <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-xl font-bold mb-2">Time</Text>
            <TouchableOpacity 
              onPress={showTimepicker} 
              className="border border-gray-300 rounded p-3"
            >
            <Text>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  testID="timePicker"
                  value={time}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={onChangeTime}
                />
              )}
          </View>
        </View>
        {/* Location to be selected from the google map */}
        <Text className="text-xl font-bold mb-2">Location</Text>
        <View className="flex-row items-center border border-gray-300 rounded mb-4">
          <TextInput
            className="flex-1 p-3"
            value={location}
            onChangeText={setLocation}
            placeholder='Select Location' 
          />
          <View className="w-px h-full bg-gray-300" />
          <MaterialIcons name="arrow-forward" size={24} color="black" className="px-2" />
        </View>
        <Text className="text-xl font-bold mb-2">No of Volunteers needed</Text>
        <TextInput className="border border-gray-300 p-3 mb-4 rounded"
          value={volunteers}
          onChangeText={setVolunteers}
          placeholder="Enter number"
          keyboardType="numeric"
          placeholderTextColor="#999"  
        />
        <Text className="text-xl font-bold mb-2">Contact Info</Text>
        <TextInput className="border border-gray-300 p-3 mb-4 rounded"
          value={contactInfo}
          onChangeText={setContactInfo}
          placeholder="Enter contact info"
          keyboardType="numeric"
          placeholderTextColor="#999"  
        />
        
      <TouchableOpacity
        className="bg-green-600 rounded py-3"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-bold">SUBMIT</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
    
  )
}