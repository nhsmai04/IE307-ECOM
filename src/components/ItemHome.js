import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ItemHome({ title, imageUrl, navigation }) {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={imageUrl} style={styles.image} />
      {/* Overlay Text */}
      <Text style={styles.text}>{title}</Text>
      {/* Explore Button */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("ProductNavigator", { initialType: title })
        }
      >
        <Text style={styles.btnText}>Khám phá</Text>
        <Icon name="arrow-right" size={20} color="white" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%", // Adjust height as needed
    position: "relative", // Parent for absolute positioning
    overflow: "hidden",
    borderRadius: 10, // Optional for rounded corners
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Ensure the image covers the entire container
  },
  text: {
    position: "absolute",
    top: 20,
    left: 20,
    color: "rgba(225, 199, 141, 1)",
    fontSize: 24,
    fontFamily: "Lato-Bold",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  btn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato-Bold",
    marginRight: 10,
  },
  icon: {
    alignSelf: "center",
  },
});
