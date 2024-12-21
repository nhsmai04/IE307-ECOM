import { View, Text } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homestack from "./Homestack";
import Profilestack from "./Profilestack";
import Shopstack from "./Shopstack";
const Tab = createBottomTabNavigator();
export default function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Trang chủ") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Tài khoản") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = focused ? "cart" : "cart-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Trang chủ"
        component={Homestack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Giỏ hàng" component={Shopstack} />
      <Tab.Screen name="Tài khoản" component={Profilestack} />
    </Tab.Navigator>
  );
}
