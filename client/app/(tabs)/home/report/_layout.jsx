import {
    createMaterialTopTabNavigator,
  } from "@react-navigation/material-top-tabs";
  import { withLayoutContext } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

  const { Navigator } = createMaterialTopTabNavigator();
  
  export const MaterialTopTabs = withLayoutContext(Navigator);
  
  export default function TabLayout() {
    return (
   
      <MaterialTopTabs>
      
        <MaterialTopTabs.Screen name="feeds" options={{ title: "Feeds" }} />
        <MaterialTopTabs.Screen name="createIssue" options={{ title: "Create" }} />
        <MaterialTopTabs.Screen name="myIssue" options={{ title: "My issue" }} />
        <MaterialTopTabs.Screen name="solvedIssue" options={{ title: "Solved" }} />
     
      </MaterialTopTabs>
   
    );
  }