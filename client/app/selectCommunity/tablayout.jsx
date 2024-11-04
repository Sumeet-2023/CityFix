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
          tabBarLabelStyle: { fontSize: 18,fontWeight: 'bold', textTransform: 'capitalize'},
          tabBarScrollEnabled: true,
          tabBarIndicatorStyle: {
            backgroundColor: 'blue',
          },
          tabBarItemStyle: {
            width: 'auto',
          },
        }}
       >
        <MaterialTopTabs.Screen name="createCommunity" options={{ title: "Create Community" }} />
        <MaterialTopTabs.Screen name="myCommunity" options={{ title: "My community" }} />
       
      </MaterialTopTabs>
   
    );
  }