import {
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  return (
      <MaterialTopTabs
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14,fontWeight: 'bold', textTransform: 'capitalize'},
          tabBarScrollEnabled: true,
          tabBarIndicatorStyle: {
            backgroundColor: 'blue',
          },
          tabBarItemStyle: {
            width: 'auto',
          },
        }}
       >      
        <MaterialTopTabs.Screen name="myCommunity" options={{ title: "Your Communities" }} />
        {/* <MaterialTopTabs.Screen name="createCommunity" options={{ title: "Create Community" }} /> */}
        <MaterialTopTabs.Screen name="searchCommunity" options={{ title: "Search" }} />
        <MaterialTopTabs.Screen name="chat" options={{ title: "Chat" }} />
        {/* <MaterialTopTabs.Screen name="chatRoom" options={{ title: "Create Community" }} /> */}
     
      </MaterialTopTabs>
 
  );
}