import React, { useState } from 'react';
import { View, Animated } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MARKER_COLORS = {
  issue: '#1565C0',      // Darker blue
  crowdfunding: '#2196F3', // Medium blue
  community: '#64B5F6'    // Light blue
};

const LegendItem = ({ icon, color, label }) => (
  <View className="flex-row items-center py-2 px-1 my-0.5 rounded-lg hover:bg-gray-50">
    <View className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
      <MaterialCommunityIcons 
        name={icon} 
        size={22} 
        color={color}
      />
    </View>
    <Text className="ml-3 text-gray-700 font-medium">{label}</Text>
  </View>
);

const FoldableLegend = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLegend = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {!isExpanded ? (
        <IconButton
          icon="map-legend"
          className="bg-white rounded-full shadow-lg border border-gray-100"
          size={24}
          onPress={toggleLegend}
        />
      ) : (
        <Card className="bg-white rounded-xl shadow-xl border border-gray-100">
          <Card.Content className="p-0">
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <MaterialCommunityIcons 
                  name="map-legend" 
                  size={20} 
                  color="#4B5563"
                  style={{ marginRight: 8 }}
                />
                <Text className="font-semibold text-gray-800 text-base">Map Legend</Text>
              </View>
              <IconButton
                icon="close"
                size={20}
                onPress={toggleLegend}
                className="opacity-60 hover:opacity-100"
              />
            </View>
            <View className="p-2">
              <LegendItem 
                icon="alert-circle"
                color={MARKER_COLORS.issue}
                label="Issues"
              />
              <LegendItem 
                icon="hand-heart"
                color={MARKER_COLORS.crowdfunding}
                label="Crowdfunding"
              />
              <LegendItem 
                icon="account-group"
                color={MARKER_COLORS.community}
                label="Communities"
              />
            </View>
          </Card.Content>
        </Card>
      )}
    </>
  );
};

export default FoldableLegend;