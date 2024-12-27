import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CartScreen from "../pages/CartScreen";
import PaymentScreen from "../pages/PaymentScreen";
const Stack = createStackNavigator();
export default function Shopstack() {
  return (
    <Stack.Navigator initialRouteName="CartScreen">
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
