import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import React from "react";
import Header from "../components/Header";
import Item from "../components/ItemHome";
const { height } = Dimensions.get("window"); // Lấy chiều cao của thiết bị

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
      </View>
      <View style={styles.content}>
        <View style={styles.item}>
          <Item title="Trà" imageUrl="../assets/images/icon.png" />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  header: {
    height: height * 0.15,
    width: "100%",
  },
});
