import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
    {/* <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} /> */}
  </Stack.Navigator>
  )
}