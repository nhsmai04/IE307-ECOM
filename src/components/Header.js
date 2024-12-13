import { View, Text ,StyleSheet, Image} from 'react-native'
import React from 'react'

export default function Header() {
  return (
    <View style={styles.container}>
        <View style={header}>
            <Image source={require('../assets/logo.png')} style={styles.logo}/>

        </View>
    </View>
  )
}
const styles = StyleSheet.create({

    
})