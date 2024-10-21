import {
    createMaterialTopTabNavigator,
  } from "@react-navigation/material-top-tabs";
  import { withLayoutContext } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

  const { Navigator } = createMaterialTopTabNavigator();
  
  export const MaterialTopTabs = withLayoutContext(Navigator);
  
  export default function TabLayout() {
    return (
   
      <MaterialTopTabs 
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14,fontWeight: 'bold', textTransform: 'capitalize'},
          tabBarIndicatorStyle: {
            backgroundColor: 'blue',
          },
        }}
       >
        <MaterialTopTabs.Screen name="myClan" options={{ title: "My clan" }} />
        <MaterialTopTabs.Screen name="search" options={{ title: "Search" }} />
        <MaterialTopTabs.Screen name="createClan" options={{ title: "Create clan" }} />
        <MaterialTopTabs.Screen name="ngo" options={{ title: "NGO's" }} />
     
      </MaterialTopTabs>
   
    );
  }