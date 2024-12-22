import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Products from "../pages/Products";
import { useRoute } from "@react-navigation/native";
const Tab = createMaterialTopTabNavigator();

export default function ProductNavigator({ navigation }) {
  const route = useRoute();
  const { initialType } = route.params || {};

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
      <Tab.Screen name="Trà">
        {() => <Products type="Tra" navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Creamy">
        {() => <Products type="Creamy" navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Trà Sữa">
        {() => <Products type="Trasua" navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Fresh">
        {() => <Products type="Fresh" navigation={navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
