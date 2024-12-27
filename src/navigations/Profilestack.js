import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../pages/ProfileScreen";
import OrderHistory from "../pages/OrderHistory";

const Stack = createStackNavigator();

export default function Profilestack() {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
    </Stack.Navigator>
  );
}
