import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import Homestack from "./Homestack";
import Profilestack from "./Profilestack";
import Shopstack from "./Shopstack";
const Tab = createBottomTabNavigator();
export default function Tabnavigator() {
  return (
    <Tabnavigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = focused ? "cart" : "cart-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Homestack} />
      <Tab.Screen name="Shop" component={Shopstack} />
      <Tab.Screen name="Profile" component={Profilestack} />
      
    </Tabnavigator>
  );
}
