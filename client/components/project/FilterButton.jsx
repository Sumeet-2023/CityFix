import React from 'react'; 
import { Text, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterButton = ({ title, active, onPress, icon }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-4 py-2 rounded-full mr-3 ${
        active ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
    >
      <Ionicons name={icon} size={16} color={active ? 'white' : '#4B5563'} />
      <Text className={`ml-2 font-medium ${active ? 'text-white' : 'text-gray-700'}`}>
        {title}
      </Text>
    </TouchableOpacity>
);
  
export default FilterButton;