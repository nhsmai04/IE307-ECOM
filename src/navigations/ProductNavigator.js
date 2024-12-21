import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Products from "../pages/Products";
import { useRoute } from "@react-navigation/native";
const Tab = createMaterialTopTabNavigator();

export default function ProductNavigator({ navigation }) {
  const route = useRoute();
  const { initialType } = route.params || {};
  console.log("initialType:", initialType);
  const mapTypeToRouteName = {
    Trà: "Trà",
    Creamy: "Creamy",
    "Trà sữa": "Trà Sữa",
    Fresh: "Fresh",
  };
  const initialRouteName = mapTypeToRouteName[initialType];
  

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      style={{ marginTop: 30 }}
      swipeEnabled={false}
      screenOptions={{
        gestureEnabled: false,
      }}
    >
      
      {/* <Tab.Screen name="Trà" component={Products} initialParams={{ type: "Tra" }} /> */}
      <Tab.Screen name="Trà" component={Products} initialParams={{ type: "Tra" }}/>
        
      <Tab.Screen name="Creamy" component={Products} initialParams={{ type: "Creamy" }}/>
 
      <Tab.Screen name="Trà Sữa" component={Products} initialParams={{ type: "Trasua" }}/>
        
      <Tab.Screen name="Fresh" component={Products} initialParams={{ type: "Fresh" }}/>
       
    </Tab.Navigator>
  );
}