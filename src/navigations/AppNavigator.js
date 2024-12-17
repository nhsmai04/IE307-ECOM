import { View, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNavigator from './BottomNavigator';
const Stack = createStackNavigator();
export default function Tabnavigator() {
  return (
  <Stack.Navigator initialRouteName="BottomNavigator" >
    <Stack.Screen name="BottomNavigator" component={BottomNavigator} options={{ headerShown: false }}  />
    {/* <Stack.Sceen name="Login" component={Login} options={{ headerShown: false }}  /> */}
  </Stack.Navigator>
  )
}