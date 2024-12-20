import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProductNavigator from "./ProductNavigator";
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
      <Stack.Screen
        name="ProductNavigator"
        component={ProductNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailProduct"
        component={DetailProduct}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
