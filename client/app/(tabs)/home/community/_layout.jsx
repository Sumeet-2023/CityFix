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
          tabBarScrollEnabled: true,
          tabBarIndicatorStyle: {
            backgroundColor: 'blue',
          },
          tabBarItemStyle: {
            width: 'auto',
          },
        }}
       >
        <MaterialTopTabs.Screen name="feeds" options={{ title: "Feeds" }} />
        <MaterialTopTabs.Screen name="createProject" options={{ title: "Create Issues" }} />
        <MaterialTopTabs.Screen name="myProjects" options={{ title: "My issues" }} />
        <MaterialTopTabs.Screen name="volunteer" options={{ title: "Volunteer" }} />
        <MaterialTopTabs.Screen name="exploreMap" options={{ title: "Explore" }} />
     
      </MaterialTopTabs>
   
    );
  }