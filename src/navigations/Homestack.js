import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Products from '../pages/Products'
const Stack = createStackNavigator()

export default function Homestack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Products" component={Products} />
    </Stack.Navigator>
  )
}