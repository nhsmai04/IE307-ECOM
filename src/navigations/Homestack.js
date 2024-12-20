import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Products from "../pages/Products";
import Home from "../pages/Home";
import DetailProduct from "../pages/DetailProduct";
const Stack = createStackNavigator();

export default function Homestack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen
        name="DetailProduct"
        component={DetailProduct}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
