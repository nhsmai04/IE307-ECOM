import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
        />
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
    minWidth: "100%",
    height: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#901D00",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 50,
  },
});
